#!/usr/bin/env node
/**
 * CatchUp iMessage Sync Script
 * Reads Messages + AddressBook, outputs public/data/relationships.json
 * Run: npm run sync
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const os = require("os");

// ── Paths ─────────────────────────────────────────────────────────────────────
const MESSAGES_DB = path.join(os.homedir(), "Library/Messages/chat.db");
const LOOKBACK_DAYS = 90;
const LOOKBACK_SEC = LOOKBACK_DAYS * 86400;

function findAddressBook() {
  const sourcesDir = path.join(
    os.homedir(),
    "Library/Application Support/AddressBook/Sources"
  );
  try {
    const sources = fs.readdirSync(sourcesDir);
    for (const src of sources) {
      const candidate = path.join(sourcesDir, src, "AddressBook-v22.abcddb");
      if (fs.existsSync(candidate)) return candidate;
    }
  } catch {}
  return null;
}

// ── Query helper ──────────────────────────────────────────────────────────────
function query(sql, attachDb = null) {
  const attach = attachDb
    ? `ATTACH DATABASE '${attachDb.replace(/'/g, "''")}' AS ab; `
    : "";
  // Write SQL to a temp file to avoid shell escaping issues
  const tmpFile = path.join(os.tmpdir(), `catchup_query_${Date.now()}.sql`);
  fs.writeFileSync(tmpFile, attach + sql);
  try {
    const out = execSync(`sqlite3 -json "${MESSAGES_DB}" < "${tmpFile}"`, {
      shell: true,
      maxBuffer: 20 * 1024 * 1024,
    })
      .toString()
      .trim();
    fs.unlinkSync(tmpFile);
    return out ? JSON.parse(out) : [];
  } catch (e) {
    fs.unlinkSync(tmpFile);
    console.error("Query error:", e.message.slice(0, 200));
    return [];
  }
}

// ── Phone normalisation: strip all non-digits, take last 10 ──────────────────
// SQLite expression that does the same thing
const normalizeExpr = (col) =>
  `substr(replace(replace(replace(replace(replace(replace(${col},'+',''),'-',''),' ',''),'(',''),')',''),'.',''), -10)`;

// ── Health score ──────────────────────────────────────────────────────────────
function computeHealthScore({ days_since, msgs_per_week, from_me, total_msgs, this_month, last_month }) {
  // Recency (0-40)
  const recency =
    days_since <= 1 ? 40 : days_since <= 3 ? 35 : days_since <= 7 ? 28
    : days_since <= 14 ? 20 : days_since <= 30 ? 10 : days_since <= 60 ? 5 : 2;

  // Frequency (0-30)
  const freq =
    msgs_per_week >= 10 ? 30 : msgs_per_week >= 5 ? 24 : msgs_per_week >= 2 ? 18
    : msgs_per_week >= 1 ? 12 : msgs_per_week >= 0.5 ? 6 : 2;

  // Initiation balance (0-20) — do YOU reach out too?
  const ratio = total_msgs > 0 ? from_me / total_msgs : 0;
  const balance = ratio >= 0.3 ? 20 : ratio >= 0.15 ? 14 : ratio >= 0.05 ? 8 : 3;

  // Trend (0-10) — is activity stable/growing?
  const trend = this_month >= last_month * 0.8 ? 10 : this_month >= last_month * 0.5 ? 5 : 0;

  return Math.min(100, recency + freq + balance + trend);
}

function getStatus(score) {
  return score >= 70 ? "green" : score >= 40 ? "yellow" : "red";
}

function formatDaysAgo(days) {
  if (days < 1) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 14) return "1 week ago";
  if (days < 30) return `${Math.round(days / 7)} weeks ago`;
  if (days < 60) return "1 month ago";
  return `${Math.round(days / 30)} months ago`;
}

function getNextSuggested(score, days_since, msgs_per_week) {
  if (score < 40) return "Overdue";
  const interval = msgs_per_week > 0 ? 7 / msgs_per_week : 30;
  const dueIn = Math.max(0, interval - days_since);
  if (dueIn <= 0) return "Now";
  if (dueIn <= 1) return "Tomorrow";
  if (dueIn <= 7) return `In ${Math.round(dueIn)} days`;
  return `In ${Math.round(dueIn / 7)} weeks`;
}

function initials(name) {
  return name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase() || "?").join("");
}

function frequencyLabel(msgs_per_week) {
  if (msgs_per_week >= 5) return "Daily";
  if (msgs_per_week >= 2) return "Weekly";
  if (msgs_per_week >= 0.5) return "Bi-weekly";
  return "Monthly";
}

function monthlyChart(row, now) {
  const keys = ["four_months_ago", "three_months_ago", "two_months_ago", "last_month", "this_month"];
  return keys.map((key, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (4 - i), 1);
    return {
      month: d.toLocaleString("default", { month: "short" }),
      contacts: row[key] || 0,
    };
  });
}

function buildMonthCounts(offset) {
  return `SUM(CASE WHEN strftime('%Y-%m', datetime(m.date/1000000000+978307200,'unixepoch','localtime'))=strftime('%Y-%m','now','${offset} month') THEN 1 ELSE 0 END)`;
}

// ── 1. Individual contacts ────────────────────────────────────────────────────
function fetchIndividualContacts(abDb) {
  console.log("  Querying individual contacts...");

  const sql = `
    ${abDb ? `ATTACH DATABASE '${abDb.replace(/'/g, "''")}' AS ab;` : ""}
    SELECT
      COALESCE(
        CASE
          WHEN p.ZFIRSTNAME IS NOT NULL AND p.ZLASTNAME IS NOT NULL THEN p.ZFIRSTNAME || ' ' || p.ZLASTNAME
          WHEN p.ZFIRSTNAME IS NOT NULL THEN p.ZFIRSTNAME
          WHEN p.ZLASTNAME IS NOT NULL THEN p.ZLASTNAME
          ELSE NULL
        END,
        h.id
      ) as name,
      h.id as contact_id,
      COUNT(*) as total_msgs,
      SUM(CASE WHEN m.is_from_me=0 THEN 1 ELSE 0 END) as from_them,
      SUM(CASE WHEN m.is_from_me=1 THEN 1 ELSE 0 END) as from_me,
      MAX(datetime(m.date/1000000000+978307200,'unixepoch','localtime')) as last_contact,
      CAST(ROUND(julianday('now') - julianday(MAX(datetime(m.date/1000000000+978307200,'unixepoch','localtime'))),0) AS INTEGER) as days_since,
      ROUND(COUNT(*) / (${LOOKBACK_DAYS} / 7.0), 1) as msgs_per_week,
      ${buildMonthCounts("0")} as this_month,
      ${buildMonthCounts("-1")} as last_month,
      ${buildMonthCounts("-2")} as two_months_ago,
      ${buildMonthCounts("-3")} as three_months_ago,
      ${buildMonthCounts("-4")} as four_months_ago
    FROM message m
    JOIN handle h ON h.ROWID = m.handle_id
    JOIN chat_message_join cmj ON cmj.message_id = m.ROWID
    JOIN chat c ON c.ROWID = cmj.chat_id AND c.style = 45
    ${abDb ? `
    LEFT JOIN ab.ZABCDPHONENUMBER ph ON
      ${normalizeExpr("h.id")} = ${normalizeExpr("ph.ZFULLNUMBER")}
    LEFT JOIN ab.ZABCDRECORD p ON p.Z_PK = ph.ZOWNER
    ` : ""}
    WHERE m.date > (strftime('%s','now') - 978307200 - ${LOOKBACK_SEC}) * 1000000000
      AND m.item_type = 0
      AND (m.text IS NOT NULL OR m.cache_has_attachments=1)
      AND h.id NOT LIKE '%@rbm%'
      AND h.id NOT LIKE '%urn:biz%'
      AND h.id NOT LIKE '%smsfp%'
      AND h.id NOT LIKE '%@%'
    GROUP BY h.id
    HAVING total_msgs > 5
    ORDER BY last_contact DESC
    LIMIT 25
  `;

  const tmpFile = path.join(os.tmpdir(), `catchup_ind_${Date.now()}.sql`);
  fs.writeFileSync(tmpFile, sql);
  try {
    const out = execSync(`sqlite3 -json "${MESSAGES_DB}" < "${tmpFile}"`, {
      shell: true, maxBuffer: 20 * 1024 * 1024,
    }).toString().trim();
    fs.unlinkSync(tmpFile);
    return out ? JSON.parse(out) : [];
  } catch (e) {
    fs.unlinkSync(tmpFile);
    console.error("  Individual contacts error:", e.message.slice(0, 300));
    return [];
  }
}

// ── 2. Group chats ────────────────────────────────────────────────────────────
function fetchGroupChats(abDb) {
  console.log("  Querying group chats...");

  const sql = `
    ${abDb ? `ATTACH DATABASE '${abDb.replace(/'/g, "''")}' AS ab;` : ""}
    SELECT
      COALESCE(NULLIF(c.display_name,''), 'Group Chat') as name,
      c.chat_identifier as contact_id,
      COUNT(DISTINCT m.ROWID) as total_msgs,
      SUM(CASE WHEN m.is_from_me=0 THEN 1 ELSE 0 END) as from_them,
      SUM(CASE WHEN m.is_from_me=1 THEN 1 ELSE 0 END) as from_me,
      COUNT(DISTINCT chj.handle_id) as participant_count,
      MAX(datetime(m.date/1000000000+978307200,'unixepoch','localtime')) as last_contact,
      CAST(ROUND(julianday('now') - julianday(MAX(datetime(m.date/1000000000+978307200,'unixepoch','localtime'))),0) AS INTEGER) as days_since,
      ROUND(COUNT(DISTINCT m.ROWID) / (${LOOKBACK_DAYS} / 7.0), 1) as msgs_per_week,
      ${buildMonthCounts("0")} as this_month,
      ${buildMonthCounts("-1")} as last_month,
      ${buildMonthCounts("-2")} as two_months_ago,
      ${buildMonthCounts("-3")} as three_months_ago,
      ${buildMonthCounts("-4")} as four_months_ago
    FROM chat c
    JOIN chat_message_join cmj ON cmj.chat_id = c.ROWID
    JOIN message m ON m.ROWID = cmj.message_id
    JOIN chat_handle_join chj ON chj.chat_id = c.ROWID
    WHERE c.style = 43
      AND m.date > (strftime('%s','now') - 978307200 - ${LOOKBACK_SEC}) * 1000000000
      AND m.item_type = 0
      AND (m.text IS NOT NULL OR m.cache_has_attachments=1)
    GROUP BY c.ROWID
    HAVING total_msgs > 5
    ORDER BY last_contact DESC
    LIMIT 10
  `;

  const tmpFile = path.join(os.tmpdir(), `catchup_grp_${Date.now()}.sql`);
  fs.writeFileSync(tmpFile, sql);
  try {
    const out = execSync(`sqlite3 -json "${MESSAGES_DB}" < "${tmpFile}"`, {
      shell: true, maxBuffer: 20 * 1024 * 1024,
    }).toString().trim();
    fs.unlinkSync(tmpFile);
    return out ? JSON.parse(out) : [];
  } catch (e) {
    fs.unlinkSync(tmpFile);
    console.error("  Group chats error:", e.message.slice(0, 300));
    return [];
  }
}

// ── 3. Recent message snippets ────────────────────────────────────────────────
function fetchRecentSnippets(contactId, isGroup = false) {
  const joinFilter = isGroup
    ? `JOIN chat_message_join cmj ON cmj.message_id = m.ROWID
       JOIN chat c ON c.ROWID = cmj.chat_id AND c.chat_identifier = '${contactId}'`
    : `JOIN handle h ON h.ROWID = m.handle_id AND h.id = '${contactId}'
       JOIN chat_message_join cmj ON cmj.message_id = m.ROWID
       JOIN chat c ON c.ROWID = cmj.chat_id AND c.style = 45`;

  const sql = `
    SELECT
      datetime(m.date/1000000000+978307200,'unixepoch','localtime') as date,
      m.is_from_me,
      substr(m.text, 1, 120) as text
    FROM message m
    ${joinFilter}
    WHERE m.item_type = 0
      AND m.text IS NOT NULL
      AND m.text != ''
      AND length(trim(m.text)) > 3
    ORDER BY m.date DESC
    LIMIT 6
  `;

  const tmpFile = path.join(os.tmpdir(), `catchup_snip_${Date.now()}.sql`);
  fs.writeFileSync(tmpFile, sql);
  try {
    const out = execSync(`sqlite3 -json "${MESSAGES_DB}" < "${tmpFile}"`, {
      shell: true, maxBuffer: 5 * 1024 * 1024,
    }).toString().trim();
    fs.unlinkSync(tmpFile);
    return out ? JSON.parse(out) : [];
  } catch (e) {
    if (fs.existsSync(tmpFile)) fs.unlinkSync(tmpFile);
    return [];
  }
}

// ── 4. Group chat participant names ───────────────────────────────────────────
function fetchGroupParticipants(chatIdentifier, abDb) {
  const sql = `
    ${abDb ? `ATTACH DATABASE '${abDb.replace(/'/g, "''")}' AS ab;` : ""}
    SELECT
      COALESCE(
        CASE
          WHEN p.ZFIRSTNAME IS NOT NULL AND p.ZLASTNAME IS NOT NULL THEN p.ZFIRSTNAME || ' ' || p.ZLASTNAME
          WHEN p.ZFIRSTNAME IS NOT NULL THEN p.ZFIRSTNAME
          ELSE h.id
        END,
        h.id
      ) as name
    FROM chat c
    JOIN chat_handle_join chj ON chj.chat_id = c.ROWID
    JOIN handle h ON h.ROWID = chj.handle_id
    ${abDb ? `
    LEFT JOIN ab.ZABCDPHONENUMBER ph ON
      ${normalizeExpr("h.id")} = ${normalizeExpr("ph.ZFULLNUMBER")}
    LEFT JOIN ab.ZABCDRECORD p ON p.Z_PK = ph.ZOWNER
    ` : ""}
    WHERE c.chat_identifier = '${chatIdentifier}'
    LIMIT 20
  `;

  const tmpFile = path.join(os.tmpdir(), `catchup_part_${Date.now()}.sql`);
  fs.writeFileSync(tmpFile, sql);
  try {
    const out = execSync(`sqlite3 -json "${MESSAGES_DB}" < "${tmpFile}"`, {
      shell: true, maxBuffer: 2 * 1024 * 1024,
    }).toString().trim();
    fs.unlinkSync(tmpFile);
    return out ? JSON.parse(out).map((r) => r.name) : [];
  } catch (e) {
    if (fs.existsSync(tmpFile)) fs.unlinkSync(tmpFile);
    return [];
  }
}

// ── 5. Build contact history from snippets ────────────────────────────────────
function buildContactHistory(snippets) {
  return snippets.map((s) => {
    const date = new Date(s.date);
    const now = new Date();
    const diffDays = Math.round((now - date) / 86400000);
    return {
      date: formatDaysAgo(diffDays),
      medium: "iMessage",
      subject: "—",
      initiatedBy: s.is_from_me ? "me" : "them",
      summary: s.text?.replace(/[^\x20-\x7E]/g, "").trim().slice(0, 100) || "(attachment)",
    };
  });
}

// ── 6. Shape a contact into app format ───────────────────────────────────────
function shapeContact(row, snippets, now, isGroup = false, participants = []) {
  const score = computeHealthScore(row);
  const name = row.name?.startsWith("+") || row.name?.startsWith("chat")
    ? isGroup ? `Group (${row.participant_count || "?"})` : `Unknown (…${row.contact_id.slice(-4)})`
    : row.name;

  const textPct = Math.round((row.from_me / Math.max(row.total_msgs, 1)) * 60 + 20);
  const methodBreakdown = {
    calls: Math.max(0, 100 - Math.min(textPct, 80) - 10),
    texts: Math.min(textPct, 80),
    social: 10,
  };

  return {
    id: Math.random().toString(36).slice(2),
    name,
    avatar: initials(name),
    phoneNumber: isGroup ? "" : row.contact_id,
    isGroup,
    participants: isGroup ? participants : [],
    participantCount: isGroup ? (row.participant_count || 0) : 1,
    status: getStatus(score),
    healthScore: score,
    lastContact: formatDaysAgo(row.days_since),
    lastContactDate: row.last_contact,
    contactFrequency: frequencyLabel(row.msgs_per_week),
    nextSuggested: getNextSuggested(score, row.days_since, row.msgs_per_week),
    relationship: isGroup ? "Group Chat" : "Contact",
    notes: snippets[0]?.text?.replace(/[^\x20-\x7E]/g, "").trim().slice(0, 80) || "",
    preferredMethod: "text",
    email: "",
    bestTimeToContact: "—",
    mood: score > 70 ? "positive" : score > 40 ? "neutral" : "distant",
    topics: [],
    recentContext: [],
    aiSuggestions: [],
    contactHistory: buildContactHistory(snippets),
    analytics: {
      totalContacts: row.total_msgs,
      avgResponseTime: "—",
      contactFrequency: monthlyChart(row, now),
      methodBreakdown,
      responsiveness: Math.round((row.from_them / Math.max(row.total_msgs, 1)) * 100),
      initiationRatio: { me: row.from_me, them: row.from_them },
    },
  };
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log("\n🔄 CatchUp iMessage Sync\n");

  const abDb = findAddressBook();
  console.log(abDb ? `✅ AddressBook: ${path.basename(path.dirname(abDb))}` : "⚠️  No AddressBook found — names will be phone numbers");

  const now = new Date();
  const relationships = [];

  // Individual contacts
  const individuals = fetchIndividualContacts(abDb);
  console.log(`✅ ${individuals.length} individual contacts`);

  for (const row of individuals) {
    const snippets = fetchRecentSnippets(row.contact_id, false);
    relationships.push(shapeContact(row, snippets, now, false, []));
  }

  // Group chats
  const groups = fetchGroupChats(abDb);
  console.log(`✅ ${groups.length} group chats`);

  for (const row of groups) {
    const snippets = fetchRecentSnippets(row.contact_id, true);
    const participants = abDb ? fetchGroupParticipants(row.contact_id, abDb) : [];
    relationships.push(shapeContact(row, snippets, now, true, participants));
  }

  // Sort by last contact
  relationships.sort((a, b) => new Date(b.lastContactDate) - new Date(a.lastContactDate));

  const out = {
    generatedAt: new Date().toISOString(),
    source: "iMessage",
    relationships,
  };

  const outPath = path.join(__dirname, "../public/data/relationships.json");
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(out, null, 2));

  console.log(`\n✅ ${relationships.length} contacts written to public/data/relationships.json\n`);

  const emoji = { green: "🟢", yellow: "🟡", red: "🔴" };
  const tag = { true: "👥", false: "👤" };
  relationships.forEach((r) => {
    const e = emoji[r.status] || "⚪";
    const t = tag[r.isGroup] || "👤";
    console.log(`${e}${t} ${r.name.padEnd(28)} ${r.healthScore}%  ${r.lastContact}`);
  });
  console.log();
}

main().catch(console.error);
