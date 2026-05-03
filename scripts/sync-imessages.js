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
const CALL_HISTORY_DB = path.join(os.homedir(), "Library/Application Support/CallHistoryDB/CallHistory.storedata");
const LOOKBACK_DAYS = 365;
const LOOKBACK_SEC = LOOKBACK_DAYS * 86400;

// ZCALLTYPE codes
const CALL_MEDIUM = { 1: "Phone Call", 8: "FaceTime Audio", 16: "FaceTime Video" };

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
function computeHealthScore({ days_since, msgs_per_week, from_me, total_msgs, this_month, last_month, call_stats = {} }) {
  const { answered_calls = 0, call_mins = 0, days_since_call = 9999 } = call_stats;

  // Each answered call with >30s counts as 3 message-equivalents (capped at 15)
  const call_equiv = Math.min(answered_calls * 3, 15);
  const eff_days = Math.min(days_since, days_since_call);
  const eff_mpw  = msgs_per_week + (call_equiv / (LOOKBACK_DAYS / 7.0));

  // Recency (0-40) — use most recent contact of any kind
  const recency =
    eff_days <= 1 ? 40 : eff_days <= 3 ? 35 : eff_days <= 7 ? 28
    : eff_days <= 14 ? 20 : eff_days <= 30 ? 10 : eff_days <= 60 ? 5 : 2;

  // Frequency (0-30)
  const freq =
    eff_mpw >= 10 ? 30 : eff_mpw >= 5 ? 24 : eff_mpw >= 2 ? 18
    : eff_mpw >= 1 ? 12 : eff_mpw >= 0.5 ? 6 : 2;

  // Initiation balance (0-20) — do YOU reach out too?
  const outgoing_calls = call_stats.outgoing_calls || 0;
  const eff_from_me = from_me + outgoing_calls * 3;
  const eff_total   = total_msgs + call_equiv;
  const ratio = eff_total > 0 ? eff_from_me / eff_total : 0;
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

// Deterministic numeric ID from a string — avoids Math.random() which breaks
// per-contact localStorage persistence (doNotTrack, tags, etc.) on every sync.
function stableId(str) {
  let h = 5381;
  for (let i = 0; i < str.length; i++) h = (Math.imul(h, 33) ^ str.charCodeAt(i)) >>> 0;
  return h;
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
    HAVING total_msgs >= 1
    ORDER BY last_contact DESC
    LIMIT 200
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
    HAVING total_msgs >= 1
    ORDER BY last_contact DESC
    LIMIT 50
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

// ── Topic extraction ──────────────────────────────────────────────────────────
const TOPIC_KEYWORDS = {
  "Work": ["work", "job", "office", "meeting", "boss", "client", "project", "deadline", "salary", "interview", "company", "business", "hire"],
  "Family": ["mom", "dad", "sister", "brother", "family", "kids", "baby", "parent", "aunt", "uncle", "grandma", "grandpa", "birthday", "wedding"],
  "Food & Dining": ["eat", "lunch", "dinner", "breakfast", "restaurant", "food", "cook", "recipe", "coffee", "brunch", "hungry", "meal", "drinks"],
  "Sports": ["game", "play", "team", "score", "match", "gym", "workout", "training", "basketball", "football", "soccer", "fitness"],
  "Travel": ["trip", "flight", "hotel", "vacation", "airport", "travel", "city", "visit", "driving", "road trip"],
  "Entertainment": ["movie", "show", "netflix", "music", "concert", "book", "watch", "episode", "series", "album", "stream"],
  "Health": ["doctor", "sick", "hospital", "medicine", "health", "diet", "sleep", "stress", "anxiety", "therapy", "wellness"],
  "Finance": ["money", "pay", "bill", "rent", "invest", "budget", "cost", "expensive", "bank", "loan", "cash"],
  "Tech": ["app", "code", "software", "computer", "phone", "update", "tech", "website", "device", "ai", "startup"],
  "Relationships": ["dating", "girlfriend", "boyfriend", "partner", "love", "breakup", "married", "engaged", "single"],
};

function extractTopics(contactId, isGroup = false) {
  const joinFilter = isGroup
    ? `JOIN chat_message_join cmj ON cmj.message_id = m.ROWID
       JOIN chat c ON c.ROWID = cmj.chat_id AND c.chat_identifier = '${contactId}'`
    : `JOIN handle h ON h.ROWID = m.handle_id AND h.id = '${contactId}'
       JOIN chat_message_join cmj ON cmj.message_id = m.ROWID
       JOIN chat c ON c.ROWID = cmj.chat_id AND c.style = 45`;

  const sql = `
    SELECT substr(lower(m.text), 1, 500) as text
    FROM message m
    ${joinFilter}
    WHERE m.item_type = 0
      AND m.text IS NOT NULL
      AND m.text != ''
      AND length(trim(m.text)) > 3
    ORDER BY m.date DESC
    LIMIT 60
  `;

  const tmpFile = path.join(os.tmpdir(), `catchup_topics_${Date.now()}.sql`);
  fs.writeFileSync(tmpFile, sql);
  let rows = [];
  try {
    const out = execSync(`sqlite3 -json "${MESSAGES_DB}" < "${tmpFile}"`, {
      shell: true, maxBuffer: 5 * 1024 * 1024,
    }).toString().trim();
    fs.unlinkSync(tmpFile);
    rows = out ? JSON.parse(out) : [];
  } catch (e) {
    if (fs.existsSync(tmpFile)) fs.unlinkSync(tmpFile);
    return [];
  }

  const allText = rows.map((r) => r.text || "").join(" ");
  const counts = {};
  for (const [topic, keywords] of Object.entries(TOPIC_KEYWORDS)) {
    let hits = 0;
    for (const kw of keywords) {
      // Count occurrences of keyword as word boundary
      const re = new RegExp(`\\b${kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "g");
      const matches = allText.match(re);
      if (matches) hits += matches.length;
    }
    if (hits > 0) counts[topic] = hits;
  }

  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([topic]) => topic);
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

// ── 5. Call history from CallHistoryDB ───────────────────────────────────────
function fetchCallsForContact(phoneNumber) {
  if (!phoneNumber || phoneNumber.startsWith("chat")) return [];
  const norm = phoneNumber.replace(/\D/g, "").slice(-10);
  if (!norm || norm.length < 7) return [];

  const normSql = (col) =>
    `substr(replace(replace(replace(replace(replace(replace(${col},'+',''),'-',''),' ',''),'(',''),')',''),'.',''), -10)`;

  const sql = `
    SELECT
      ZCALLTYPE   as call_type,
      ZANSWERED   as answered,
      ZORIGINATED as originated,
      CAST(ROUND(ZDURATION,0) AS INTEGER) as duration,
      ZADDRESS    as address,
      datetime(ZDATE+978307200,'unixepoch','localtime') as call_date
    FROM ZCALLRECORD
    WHERE ${normSql("ZADDRESS")} = '${norm}'
      AND ZDATE > (strftime('%s','now') - 978307200 - ${LOOKBACK_SEC})
    ORDER BY ZDATE DESC
    LIMIT 50
  `;
  const tmpFile = path.join(os.tmpdir(), `catchup_calls_${Date.now()}.sql`);
  fs.writeFileSync(tmpFile, sql);
  try {
    const out = execSync(`sqlite3 -json "${CALL_HISTORY_DB}" < "${tmpFile}"`, {
      shell: true, maxBuffer: 2 * 1024 * 1024,
    }).toString().trim();
    fs.unlinkSync(tmpFile);
    return out ? JSON.parse(out) : [];
  } catch {
    if (fs.existsSync(tmpFile)) fs.unlinkSync(tmpFile);
    return [];
  }
}

function buildCallStats(calls) {
  const answered = calls.filter(c => c.answered && c.duration > 30);
  const now = new Date();
  const daysSinceCall = calls.length > 0
    ? Math.round((now - new Date(calls[0].call_date)) / 86400000)
    : 9999;
  return {
    answered_calls:  answered.length,
    outgoing_calls:  answered.filter(c => c.originated).length,
    call_mins:       Math.round(answered.reduce((s, c) => s + c.duration, 0) / 60),
    days_since_call: daysSinceCall,
    phone:           answered.filter(c => c.call_type === 1).length,
    facetimeAudio:   answered.filter(c => c.call_type === 8).length,
    facetimeVideo:   answered.filter(c => c.call_type === 16).length,
  };
}

// ── 6. Build contact history from snippets + calls ────────────────────────────
function buildContactHistory(snippets, calls = []) {
  const now = new Date();

  const msgHistory = snippets.map((s) => ({
    _ts: new Date(s.date).getTime(),
    date: formatDaysAgo(Math.round((now - new Date(s.date)) / 86400000)),
    medium: "iMessage",
    subject: "—",
    initiatedBy: s.is_from_me ? "me" : "them",
    summary: s.text?.replace(/[^\x20-\x7E]/g, "").trim().slice(0, 100) || "(attachment)",
  }));

  const callHistory = calls
    .filter(c => c.answered && c.duration > 10)
    .map((c) => ({
      _ts: new Date(c.call_date).getTime(),
      date: formatDaysAgo(Math.round((now - new Date(c.call_date)) / 86400000)),
      medium: CALL_MEDIUM[c.call_type] || "Phone Call",
      subject: "—",
      initiatedBy: c.originated ? "me" : "them",
      summary: `${CALL_MEDIUM[c.call_type] || "Call"} · ${Math.round(c.duration / 60)} min`,
    }));

  return [...msgHistory, ...callHistory]
    .sort((a, b) => b._ts - a._ts)
    .slice(0, 8)
    .map(({ _ts, ...rest }) => rest);
}

// ── 7. Shape a contact into app format ───────────────────────────────────────
function shapeContact(row, snippets, calls, now, isGroup = false, participants = [], topics = []) {
  const call_stats = isGroup ? {} : buildCallStats(calls);
  const score = computeHealthScore({ ...row, call_stats });
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
    id: stableId((row.contact_id || "") + (isGroup ? "g" : "")),
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
    topics,
    recentContext: [],
    aiSuggestions: [],
    contactHistory: buildContactHistory(snippets, isGroup ? [] : calls),
    analytics: {
      totalContacts: row.total_msgs,
      avgResponseTime: "—",
      contactFrequency: monthlyChart(row, now),
      methodBreakdown,
      responsiveness: Math.round((row.from_them / Math.max(row.total_msgs, 1)) * 100),
      initiationRatio: { me: row.from_me, them: row.from_them },
      callStats: isGroup ? null : {
        phone: call_stats.phone || 0,
        facetimeAudio: call_stats.facetimeAudio || 0,
        facetimeVideo: call_stats.facetimeVideo || 0,
        totalMinutes: call_stats.call_mins || 0,
      },
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

  const callDbExists = fs.existsSync(CALL_HISTORY_DB);
  console.log(callDbExists ? "✅ CallHistoryDB found — tracking calls & FaceTime" : "⚠️  No CallHistoryDB — call data skipped");

  // Deduplicate: same resolved name = same person texting from multiple numbers.
  // Merge by keeping the row with the most recent lastContact; accumulate total_msgs.
  const seen = new Map(); // name → row index in deduped array
  const deduped = [];
  for (const row of individuals) {
    const key = row.name?.toLowerCase().trim() || row.contact_id;
    if (seen.has(key)) {
      const idx = seen.get(key);
      const existing = deduped[idx];
      // Keep the more recent contact_id (for snippet/call lookups) and merge counts
      if (row.days_since < existing.days_since) {
        deduped[idx] = { ...row, total_msgs: existing.total_msgs + row.total_msgs,
          from_me: existing.from_me + row.from_me,
          from_them: existing.from_them + row.from_them };
      } else {
        deduped[idx].total_msgs += row.total_msgs;
        deduped[idx].from_me   += row.from_me;
        deduped[idx].from_them += row.from_them;
      }
    } else {
      seen.set(key, deduped.length);
      deduped.push({ ...row });
    }
  }
  console.log(`  (${individuals.length - deduped.length} duplicates merged)`);

  for (const row of deduped) {
    const snippets = fetchRecentSnippets(row.contact_id, false);
    const calls    = callDbExists ? fetchCallsForContact(row.contact_id) : [];
    const topics   = extractTopics(row.contact_id, false);
    relationships.push(shapeContact(row, snippets, calls, now, false, [], topics));
  }

  // Group chats
  const groups = fetchGroupChats(abDb);
  console.log(`✅ ${groups.length} group chats`);

  for (const row of groups) {
    const snippets = fetchRecentSnippets(row.contact_id, true);
    const participants = abDb ? fetchGroupParticipants(row.contact_id, abDb) : [];
    const topics = extractTopics(row.contact_id, true);
    relationships.push(shapeContact(row, snippets, [], now, true, participants, topics));
  }

  // Sort by last contact
  relationships.sort((a, b) => new Date(b.lastContactDate) - new Date(a.lastContactDate));

  const out = {
    generatedAt: new Date().toISOString(),
    source: callDbExists ? "iMessage+Calls" : "iMessage",
    relationships,
  };

  // ── Write 1: local public/data (for web app / Vercel)
  const outPath = path.join(__dirname, "../public/data/relationships.json");
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
  console.log(`\n✅ ${relationships.length} contacts written to public/data/relationships.json`);

  // ── Write 2: iCloud Drive container (auto-syncs to iPhone)
  const iCloudBase = path.join(
    os.homedir(),
    "Library/Mobile Documents/iCloud~com~dorianliriano~CatchUp/Documents"
  );
  try {
    fs.mkdirSync(iCloudBase, { recursive: true });
    const iCloudPath = path.join(iCloudBase, "relationships.json");
    fs.writeFileSync(iCloudPath, JSON.stringify(out, null, 2));
    console.log(`☁️  Also written to iCloud Drive → iPhone will update automatically`);
    console.log(`   (${iCloudPath})`);
  } catch (e) {
    console.log(`⚠️  iCloud write skipped: ${e.message}`);
    console.log(`   Run from your Mac to enable iCloud sync, or AirDrop relationships.json manually.`);
  }
  console.log();

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
