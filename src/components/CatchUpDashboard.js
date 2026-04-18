// CatchUp - Personal Relationship Assistant
// Complete React Application

import React, { useState, useEffect, useRef } from "react";
import { DesignA, DesignB, DesignC, DesignD } from "./HomeVariants";
import {
  User,
  Phone,
  MessageCircle,
  Calendar,
  Search,
  Heart,
  AlertTriangle,
  CheckCircle,
  Sparkles,
  ArrowRight,
  Clock,
  Lightbulb,
  X,
  BarChart3,
  TrendingUp,
  Activity,
  Send,
  Zap,
  ChevronLeft,
  ChevronDown,
  Mail,
  Target,
  Plus,
  EyeOff,
  Eye,
  Info,
  Shield,
  Smartphone,
} from "lucide-react";

const brandColors = {
  primary: "#0969b8",
  secondary: "#6c6870",
  white: "#ffffff",
  warning: "#e6961e",
  background: "#f4f4f3",
  black: "#000000",
  darkBlue: "#0c2340",
  blue: "#003087",
  red: "#e4002c",
  gray: "#c4ced3",
  yellow: "#f2a900",
};

// ─── Relationship Tags ────────────────────────────────────────────────────────
const RELATIONSHIP_TAGS = [
  { id: "family", label: "Family", icon: "👨‍👩‍👧‍👦" },
  { id: "close_friend", label: "Close Friend", icon: "❤️" },
  { id: "friend", label: "Friend", icon: "👥" },
  { id: "work_colleague", label: "Work Colleague", icon: "💼" },
  { id: "acquaintance", label: "Acquaintance", icon: "🤝" },
];

// ─── All topic categories (for add-buttons) ───────────────────────────────────
const ALL_TOPIC_CATEGORIES = [
  "Work", "Family", "Food & Dining", "Sports", "Travel",
  "Entertainment", "Health", "Finance", "Tech", "Relationships",
];

// ─── Sort options ─────────────────────────────────────────────────────────────
const SORT_OPTIONS = [
  { key: "healthDesc", label: "Health: Best first" },
  { key: "healthAsc",  label: "Health: Needs care" },
  { key: "lastContact", label: "Last contacted" },
  { key: "nameAz",     label: "Name A–Z" },
  { key: "mostActive", label: "Most active" },
];
const SORT_LABEL = Object.fromEntries(SORT_OPTIONS.map(o => [o.key, o.label]));

// ─── Sample Data (fallback) ──────────────────────────────────────────────────
const SAMPLE_RELATIONSHIPS = [
  {
    id: 1,
    name: "Sarah Chen",
    status: "green",
    lastContact: "3 days ago",
    contactFrequency: "Weekly",
    nextSuggested: "Tomorrow",
    avatar: "SC",
    relationship: "Best Friend",
    healthScore: 95,
    notes: "Coffee catch-up went great",
    preferredMethod: "call",
    phoneNumber: "+1234567890",
    email: "sarah.chen@email.com",
    bestTimeToContact: "Weekday evenings after 6pm",
    mood: "excited",
    topics: ["Career", "Yoga", "Food & Dining", "Travel"],
    contactHistory: [
      { date: "3 days ago", medium: "Call", subject: "Career", initiatedBy: "me", summary: "Discussed her new job interview prep" },
      { date: "10 days ago", medium: "Text", subject: "Food & Dining", initiatedBy: "them", summary: "She found a new brunch spot downtown" },
      { date: "3 weeks ago", medium: "F2F", subject: "Life", initiatedBy: "me", summary: "Coffee catch-up — great energy, she's happy" },
      { date: "1 month ago", medium: "Call", subject: "Yoga", initiatedBy: "them", summary: "She raved about her new yoga instructor" },
      { date: "6 weeks ago", medium: "Text", subject: "Travel", initiatedBy: "me", summary: "Planning a possible trip for summer" },
    ],
    aiSuggestions: [
      { type: "topic", content: "Ask about her new yoga instructor she mentioned", priority: "high", icon: "💪" },
      { type: "activity", content: "Suggest trying that new brunch place downtown", priority: "medium", icon: "🥐" },
    ],
    recentContext: ["Started yoga classes", "Job interview last week", "Loves trying new restaurants"],
    analytics: {
      totalContacts: 47,
      avgResponseTime: "2 hours",
      contactFrequency: [
        { month: "Sep", contacts: 8 },
        { month: "Aug", contacts: 12 },
        { month: "Jul", contacts: 10 },
        { month: "Jun", contacts: 9 },
        { month: "May", contacts: 8 },
      ],
      methodBreakdown: { calls: 65, texts: 25, social: 10 },
      responsiveness: 95,
      initiationRatio: { me: 23, them: 24 },
    },
    scoreBreakdown: { recency: 35, freq: 30, balance: 20, trend: 10 },
  },
  {
    id: 2,
    name: "Marcus Johnson",
    status: "yellow",
    lastContact: "2 weeks ago",
    contactFrequency: "Bi-weekly",
    nextSuggested: "This weekend",
    avatar: "MJ",
    relationship: "College Friend",
    healthScore: 70,
    notes: "Mentioned new job promotion",
    preferredMethod: "text",
    phoneNumber: "+1234567891",
    email: "marcus.j.dev@email.com",
    bestTimeToContact: "Weekend mornings",
    mood: "stressed but proud",
    topics: ["Tech", "Sports", "Work"],
    contactHistory: [
      { date: "2 weeks ago", medium: "Text", subject: "Career", initiatedBy: "them", summary: "Told me about his promotion to Senior Dev" },
      { date: "1 month ago", medium: "Call", subject: "NBA", initiatedBy: "me", summary: "Long catch-up after the playoffs" },
      { date: "6 weeks ago", medium: "Text", subject: "Sports", initiatedBy: "them", summary: "Shared a clip from his stream" },
      { date: "2 months ago", medium: "F2F", subject: "Life", initiatedBy: "me", summary: "Beers and dinner — talked about his relationship" },
    ],
    aiSuggestions: [
      { type: "congratulations", content: "Congratulate on his promotion to Senior Developer", priority: "high", icon: "🎉" },
      { type: "topic", content: "Ask about his new team and responsibilities", priority: "medium", icon: "👥" },
    ],
    recentContext: ["Got promoted to Senior Developer", "Working with new team"],
    analytics: {
      totalContacts: 28,
      avgResponseTime: "4 hours",
      contactFrequency: [
        { month: "Sep", contacts: 2 },
        { month: "Aug", contacts: 4 },
        { month: "Jul", contacts: 6 },
        { month: "Jun", contacts: 8 },
        { month: "May", contacts: 8 },
      ],
      methodBreakdown: { calls: 20, texts: 70, social: 10 },
      responsiveness: 70,
      initiationRatio: { me: 10, them: 18 },
    },
    scoreBreakdown: { recency: 20, freq: 18, balance: 20, trend: 5 },
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    status: "red",
    lastContact: "6 weeks ago",
    contactFrequency: "Monthly",
    nextSuggested: "Overdue",
    avatar: "ER",
    relationship: "Work Colleague",
    healthScore: 35,
    notes: "Need to congratulate on engagement",
    preferredMethod: "message",
    phoneNumber: "+1234567892",
    email: "emily.rodriguez@company.com",
    bestTimeToContact: "Weekday lunch break",
    mood: "might be hurt by lack of contact",
    topics: ["Work", "Travel"],
    contactHistory: [
      { date: "6 weeks ago", medium: "Text", subject: "Work Projects", initiatedBy: "them", summary: "Needed help with a deadline — I responded late" },
      { date: "3 months ago", medium: "F2F", subject: "Life", initiatedBy: "them", summary: "She told me about the engagement in person" },
      { date: "4 months ago", medium: "Call", subject: "Design", initiatedBy: "me", summary: "Collaborated on a client presentation" },
      { date: "6 months ago", medium: "Text", subject: "Travel", initiatedBy: "them", summary: "Pre-scheduled — planning a work trip together" },
    ],
    aiSuggestions: [
      { type: "urgent", content: "Congratulate on engagement (6 weeks overdue!)", priority: "critical", icon: "💍" },
      { type: "apology", content: "Acknowledge you've been out of touch", priority: "high", icon: "🙏" },
    ],
    recentContext: ["Got engaged to longtime boyfriend", "Planning wedding for next year"],
    analytics: {
      totalContacts: 15,
      avgResponseTime: "12 hours",
      contactFrequency: [
        { month: "Sep", contacts: 0 },
        { month: "Aug", contacts: 1 },
        { month: "Jul", contacts: 2 },
        { month: "Jun", contacts: 4 },
        { month: "May", contacts: 8 },
      ],
      methodBreakdown: { calls: 30, texts: 40, social: 30 },
      responsiveness: 35,
      initiationRatio: { me: 2, them: 13 },
    },
    scoreBreakdown: { recency: 5, freq: 6, balance: 8, trend: 0 },
  },
];

// ─── useContactPrefs hook ─────────────────────────────────────────────────────
function useContactPrefs(contactId) {
  const STORAGE_KEY = "catchup_prefs";

  function load() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    } catch {
      return {};
    }
  }

  function save(all) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  }

  function getPrefs(all) {
    return all[contactId] || { relationship: null, addedTopics: [], removedTopics: [], targetHealth: null, doNotTrack: false };
  }

  const [prefs, setPrefs] = useState(() => getPrefs(load()));

  // Keep in sync if contactId changes
  useEffect(() => {
    setPrefs(getPrefs(load()));
  }, [contactId]); // helpers are stable closures; contactId is the only dep

  function update(patch) {
    const all = load();
    const current = getPrefs(all);
    const next = { ...current, ...patch };
    all[contactId] = next;
    save(all);
    setPrefs(next);
  }

  function setRelationship(value) {
    update({ relationship: value });
  }

  function addTopic(topic) {
    const all = load();
    const current = getPrefs(all);
    const added = [...new Set([...(current.addedTopics || []), topic])];
    const removed = (current.removedTopics || []).filter((t) => t !== topic);
    const next = { ...current, addedTopics: added, removedTopics: removed };
    all[contactId] = next;
    save(all);
    setPrefs(next);
  }

  function removeTopic(topic, isDetected) {
    const all = load();
    const current = getPrefs(all);
    let removed = current.removedTopics || [];
    let added = current.addedTopics || [];
    if (isDetected) {
      removed = [...new Set([...removed, topic])];
    } else {
      added = added.filter((t) => t !== topic);
    }
    const next = { ...current, addedTopics: added, removedTopics: removed };
    all[contactId] = next;
    save(all);
    setPrefs(next);
  }

  function setTargetHealth(value) {
    update({ targetHealth: value });
  }

  function setDoNotTrack(value) {
    update({ doNotTrack: value });
  }

  // Compute effective topics: (detectedTopics - dismissed) + added
  function computeTopics(detectedTopics) {
    const removed = prefs.removedTopics || [];
    const added = prefs.addedTopics || [];
    const filtered = (detectedTopics || []).filter((t) => !removed.includes(t));
    const extra = added.filter((t) => !filtered.includes(t));
    return [...filtered, ...extra];
  }

  return {
    relationship: prefs.relationship || null,
    setRelationship,
    addedTopics: prefs.addedTopics || [],
    removedTopics: prefs.removedTopics || [],
    addTopic,
    removeTopic,
    computeTopics,
    targetHealth: prefs.targetHealth || null,
    setTargetHealth,
    doNotTrack: prefs.doNotTrack || false,
    setDoNotTrack,
  };
}

// ─── Score suggestion engine ──────────────────────────────────────────────────
function computeScoreBreakdown(person) {
  // Try to use stored breakdown; otherwise approximate from healthScore
  if (person.scoreBreakdown) return person.scoreBreakdown;
  // Rough split of healthScore
  const s = person.healthScore;
  return { recency: Math.round(s * 0.4), freq: Math.round(s * 0.3), balance: Math.round(s * 0.2), trend: Math.round(s * 0.1) };
}

function generateGoalSuggestions(person) {
  const suggestions = [];
  const { recency, freq, balance, trend } = computeScoreBreakdown(person);

  // Recency suggestions
  if (recency < 40) {
    const gain = 40 - recency;
    suggestions.push({
      icon: "⏰",
      title: "Message today",
      detail: `Boost your recency score from ${recency} → 40 (+${gain} pts) with one message right now`,
      pts: gain,
    });
  }

  // Frequency suggestions
  if (freq < 30) {
    const nextFreqScore = freq === 2 ? 6 : freq === 6 ? 12 : freq === 12 ? 18 : freq === 18 ? 24 : 30;
    const gain = nextFreqScore - freq;
    const needed = freq === 2 ? "at least every 2 weeks" : freq === 6 ? "at least weekly" : "multiple times a week";
    suggestions.push({
      icon: "📈",
      title: "Reach out more often",
      detail: `Message ${needed} to improve your frequency score ${freq} → ${nextFreqScore} (+${gain} pts)`,
      pts: gain,
    });
  }

  // Balance suggestions
  if (balance < 20) {
    const ratio = person.analytics?.initiationRatio || { me: 0, them: 1 };
    const total = (ratio.me || 0) + (ratio.them || 0);
    const currentPct = total > 0 ? Math.round((ratio.me / total) * 100) : 0;
    if (currentPct < 15) {
      const gain = (balance === 3 ? 8 : 14) - balance;
      const target = currentPct < 5 ? "5%" : "15%";
      suggestions.push({
        icon: "🤝",
        title: "Initiate more conversations",
        detail: `You've started ${currentPct}% of chats. Reach out first to hit ${target}+ for a +${gain} pt balance boost`,
        pts: gain,
      });
    } else {
      const gain = 20 - balance;
      suggestions.push({
        icon: "🤝",
        title: "Keep initiating",
        detail: `You're at ${currentPct}% initiation. Push to 30%+ for full +${gain} balance pts`,
        pts: gain,
      });
    }
  }

  // Trend suggestions
  if (trend < 10) {
    const gain = 10 - trend;
    suggestions.push({
      icon: "📊",
      title: "Stay consistent this month",
      detail: `Contact frequency is dropping. Match last month's activity to earn +${gain} trend pts`,
      pts: gain,
    });
  }

  return suggestions;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const getStatusColor = (status) => {
  switch (status) {
    case "green": return brandColors.primary;
    case "yellow": return brandColors.yellow;
    case "red": return brandColors.red;
    default: return brandColors.secondary;
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case "green": return <CheckCircle size={16} color={brandColors.primary} />;
    case "yellow": return <AlertTriangle size={16} color={brandColors.yellow} />;
    case "red": return <AlertTriangle size={16} color={brandColors.red} />;
    default: return null;
  }
};

const getPriorityColor = (priority) => {
  switch (priority) {
    case "critical": return brandColors.red;
    case "high": return brandColors.yellow;
    case "medium": return brandColors.primary;
    default: return brandColors.secondary;
  }
};

const getMediumIcon = (medium) => {
  switch (medium) {
    case "Call":
    case "Phone Call":    return <Phone size={13} />;
    case "Text":
    case "iMessage":      return <MessageCircle size={13} />;
    case "Email":         return <Mail size={13} />;
    case "F2F":           return <User size={13} />;
    case "FaceTime Audio":return <Phone size={13} />;
    case "FaceTime Video":return <Zap size={13} />;
    default:              return <Send size={13} />;
  }
};

const generateAIMessage = (person) => {
  const firstName = person.name.split(" ")[0];
  if (person.mood === "excited") return `Hey ${firstName}! Hope you're doing great! Thinking of you and wanted to catch up 😊`;
  if (person.mood.includes("stressed")) return `Hi ${firstName}! I know things have been hectic for you lately. Hope you're doing okay! 💙`;
  if (person.mood.includes("hurt")) return `Hi ${firstName}! I've been thinking about you and realized it's been too long since we talked. Hope you're well! ❤️`;
  return `Hey ${firstName}! Hope you're having a great day! Would love to catch up soon 😊`;
};

const getBestContactMethod = (person) => {
  const methods = person.analytics?.methodBreakdown || {};
  if (methods.calls > 50) return "call";
  if (methods.texts > 40) return "text";
  return person.preferredMethod;
};

// ─── RelationshipTagPicker ────────────────────────────────────────────────────
const RelationshipTagPicker = ({ selected, onSelect }) => {
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customValue, setCustomValue] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (showCustomInput && inputRef.current) inputRef.current.focus();
  }, [showCustomInput]);

  function handleCustomSubmit(e) {
    e.preventDefault();
    const val = customValue.trim();
    if (val) {
      onSelect(val);
      setCustomValue("");
      setShowCustomInput(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <p className="text-xs text-gray-500 mb-3 font-medium">RELATIONSHIP TYPE</p>
      <div className="flex flex-wrap gap-2">
        {RELATIONSHIP_TAGS.map((tag) => {
          const isActive = selected === tag.label;
          return (
            <button
              key={tag.id}
              onClick={() => onSelect(isActive ? null : tag.label)}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
              style={{
                backgroundColor: isActive ? brandColors.primary : "#f4f4f3",
                color: isActive ? brandColors.white : brandColors.secondary,
                border: `1.5px solid ${isActive ? brandColors.primary : "#e0e0e0"}`,
              }}
            >
              <span>{tag.icon}</span>
              <span>{tag.label}</span>
            </button>
          );
        })}

        {/* Custom tag */}
        {!showCustomInput ? (
          <button
            onClick={() => setShowCustomInput(true)}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
            style={{
              backgroundColor: "#f4f4f3",
              color: brandColors.primary,
              border: `1.5px dashed ${brandColors.primary}`,
            }}
          >
            <Plus size={11} />
            <span>Custom</span>
          </button>
        ) : (
          <form onSubmit={handleCustomSubmit} className="flex items-center space-x-1">
            <input
              ref={inputRef}
              type="text"
              value={customValue}
              onChange={(e) => setCustomValue(e.target.value)}
              placeholder="Type tag…"
              className="text-xs px-2 py-1.5 rounded-full border outline-none w-28"
              style={{ borderColor: brandColors.primary, color: brandColors.darkBlue }}
              onBlur={() => { if (!customValue.trim()) setShowCustomInput(false); }}
            />
            <button type="submit" className="text-xs font-semibold" style={{ color: brandColors.primary }}>OK</button>
            <button type="button" onClick={() => setShowCustomInput(false)} className="text-gray-400"><X size={12} /></button>
          </form>
        )}

        {/* Show if selected tag is a custom one (not in presets) */}
        {selected && !RELATIONSHIP_TAGS.find((t) => t.label === selected) && (
          <button
            onClick={() => onSelect(null)}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-medium"
            style={{ backgroundColor: brandColors.primary, color: brandColors.white, border: `1.5px solid ${brandColors.primary}` }}
          >
            <span>{selected}</span>
            <X size={11} />
          </button>
        )}
      </div>
    </div>
  );
};

// ─── InteractiveTopics ────────────────────────────────────────────────────────
const InteractiveTopics = ({ detectedTopics, addedTopics, removedTopics, addTopic, removeTopic, computeTopics }) => {
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customValue, setCustomValue] = useState("");
  const customInputRef = useRef(null);

  useEffect(() => {
    if (showCustomInput && customInputRef.current) customInputRef.current.focus();
  }, [showCustomInput]);

  const effectiveTopics = computeTopics(detectedTopics);
  const effectiveSet = new Set(effectiveTopics);

  // Topics available to add: all predefined minus already shown
  const availableToAdd = ALL_TOPIC_CATEGORIES.filter((t) => !effectiveSet.has(t));

  function handleCustomSubmit(e) {
    e.preventDefault();
    const val = customValue.trim();
    if (val) {
      addTopic(val);
      setCustomValue("");
      setShowCustomInput(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <div className="flex items-center space-x-2 mb-3">
        <Lightbulb size={16} style={{ color: brandColors.yellow }} />
        <h2 className="font-semibold text-gray-900">Shared Topics</h2>
      </div>

      {/* Active topics as dismissable chips */}
      {effectiveTopics.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {effectiveTopics.map((topic) => {
            const isDetected = (detectedTopics || []).includes(topic) && !removedTopics.includes(topic);
            return (
              <span
                key={topic}
                className="flex items-center space-x-1 text-xs px-3 py-1 rounded-full font-medium"
                style={{ backgroundColor: "#e8f4fd", color: brandColors.primary }}
              >
                <span>{topic}</span>
                <button
                  onClick={() => removeTopic(topic, isDetected)}
                  className="ml-1 hover:opacity-70 transition-opacity"
                  style={{ color: brandColors.primary }}
                >
                  <X size={11} />
                </button>
              </span>
            );
          })}
        </div>
      )}

      {/* Available predefined topics to add */}
      {availableToAdd.length > 0 && (
        <div className="mb-3">
          <p className="text-xs text-gray-400 mb-2">Add a topic:</p>
          <div className="flex flex-wrap gap-1.5">
            {availableToAdd.slice(0, 6).map((topic) => (
              <button
                key={topic}
                onClick={() => addTopic(topic)}
                className="flex items-center space-x-1 text-xs px-2.5 py-1 rounded-full font-medium transition-all hover:opacity-80"
                style={{ backgroundColor: "#f4f4f3", color: brandColors.secondary, border: `1px solid #e0e0e0` }}
              >
                <Plus size={10} />
                <span>{topic}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Custom topic input */}
      {!showCustomInput ? (
        <button
          onClick={() => setShowCustomInput(true)}
          className="flex items-center space-x-1 text-xs px-3 py-1.5 rounded-full font-medium mt-1"
          style={{ backgroundColor: "#f4f4f3", color: brandColors.primary, border: `1.5px dashed ${brandColors.primary}` }}
        >
          <Plus size={11} />
          <span>Custom topic</span>
        </button>
      ) : (
        <form onSubmit={handleCustomSubmit} className="flex items-center space-x-2 mt-1">
          <input
            ref={customInputRef}
            type="text"
            value={customValue}
            onChange={(e) => setCustomValue(e.target.value)}
            placeholder="e.g. Hiking"
            className="text-xs px-3 py-1.5 rounded-full border outline-none flex-1"
            style={{ borderColor: brandColors.primary }}
            onBlur={() => { if (!customValue.trim()) setShowCustomInput(false); }}
          />
          <button type="submit" className="text-xs font-semibold" style={{ color: brandColors.primary }}>Add</button>
          <button type="button" onClick={() => setShowCustomInput(false)} className="text-gray-400"><X size={12} /></button>
        </form>
      )}
    </div>
  );
};

// ─── ReachYourGoal section ────────────────────────────────────────────────────
const ReachYourGoal = ({ person, targetHealth, setTargetHealth }) => {
  const currentScore = person.healthScore;
  const defaultTarget = Math.min(100, Math.ceil((currentScore + 5) / 5) * 5);
  const target = targetHealth !== null ? targetHealth : defaultTarget;

  const suggestions = generateGoalSuggestions(person);
  const { recency, freq, balance, trend } = computeScoreBreakdown(person);

  const maxGain = suggestions.reduce((sum, s) => sum + s.pts, 0);
  const projectedMax = Math.min(100, currentScore + maxGain);

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <div className="flex items-center space-x-2 mb-4">
        <Target size={16} style={{ color: brandColors.primary }} />
        <h2 className="font-semibold text-gray-900">Reach Your Goal</h2>
      </div>

      {/* Score display */}
      <div className="flex items-center justify-between mb-3">
        <div className="text-center">
          <p className="text-xs text-gray-500">Current</p>
          <p className="text-2xl font-bold" style={{ color: getStatusColor(person.status) }}>{currentScore}%</p>
        </div>
        <div className="flex-1 mx-4 h-1.5 rounded-full" style={{ backgroundColor: "#e0e0e0" }}>
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${((target - currentScore) / Math.max(100 - currentScore, 1)) * 100}%`,
              backgroundColor: brandColors.primary,
            }}
          />
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500">Target</p>
          <p className="text-2xl font-bold" style={{ color: brandColors.primary }}>{target}%</p>
        </div>
      </div>

      {/* Slider */}
      <div className="mb-1">
        <input
          type="range"
          min={Math.min(currentScore, 95)}
          max={100}
          step={5}
          value={target}
          onChange={(e) => setTargetHealth(Number(e.target.value))}
          className="w-full"
          style={{ accentColor: brandColors.primary }}
        />
        <div className="flex justify-between text-xs text-gray-400 mt-0.5">
          <span>{currentScore}%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Score breakdown */}
      <div className="grid grid-cols-4 gap-2 my-4">
        {[
          { label: "Recency", val: recency, max: 40 },
          { label: "Frequency", val: freq, max: 30 },
          { label: "Balance", val: balance, max: 20 },
          { label: "Trend", val: trend, max: 10 },
        ].map(({ label, val, max }) => (
          <div key={label} className="text-center">
            <div className="text-xs text-gray-500 mb-1">{label}</div>
            <div className="text-sm font-bold" style={{ color: val >= max * 0.7 ? brandColors.primary : val >= max * 0.4 ? brandColors.yellow : brandColors.red }}>
              {val}/{max}
            </div>
          </div>
        ))}
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-gray-500 font-medium mb-2">
            Improve by up to +{maxGain} pts (max reachable: {projectedMax}%)
          </p>
          {suggestions.map((s, i) => (
            <div
              key={i}
              className="flex items-start space-x-3 p-3 rounded-xl"
              style={{ backgroundColor: "#f4f4f3" }}
            >
              <span className="text-xl flex-shrink-0">{s.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800">{s.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{s.detail}</p>
              </div>
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 self-start mt-0.5"
                style={{ backgroundColor: "#dbeafe", color: brandColors.primary }}
              >
                +{s.pts} pts
              </span>
            </div>
          ))}
        </div>
      )}

      {suggestions.length === 0 && (
        <p className="text-sm text-gray-500 text-center py-2">You're already maxing out all score components 🎉</p>
      )}
    </div>
  );
};

// ─── About View ──────────────────────────────────────────────────────────────
const SciencePill = ({ text }) => (
  <div className="mt-3 flex items-start space-x-2 pt-3 border-t border-gray-50">
    <span className="text-xs flex-shrink-0 mt-0.5">🔬</span>
    <p className="text-xs text-gray-400 leading-relaxed italic">{text}</p>
  </div>
);

const AboutView = ({ onBack }) => {
  const scoreComponents = [
    {
      label: "Recency",
      max: 40,
      color: brandColors.primary,
      icon: "⏱️",
      description: "How recently you last connected — by message, call, or FaceTime. The most recent contact wins, regardless of type.",
      tiers: [
        { pts: 40, text: "Today or yesterday" },
        { pts: 35, text: "Within 3 days" },
        { pts: 28, text: "Within a week" },
        { pts: 20, text: "Within 2 weeks" },
        { pts: 10, text: "Within a month" },
        { pts: 5,  text: "Within 2 months" },
        { pts: 2,  text: "More than 2 months ago" },
      ],
      science: "Roberts & Dunbar (2011, Personal Relationships) found that contact frequency is the primary predictor of emotional closeness — the less recently you've spoken, the more closeness decays. Recency gets the highest weight (40 pts) because it's the strongest single signal of an active relationship.",
    },
    {
      label: "Frequency",
      max: 30,
      color: "#7c3aed",
      icon: "📈",
      description: "How often you exchange messages or calls on average per week, looking back 90 days.",
      tiers: [
        { pts: 30, text: "10+ times a week (daily)" },
        { pts: 24, text: "5–9 times a week" },
        { pts: 18, text: "2–4 times a week" },
        { pts: 12, text: "About once a week" },
        { pts: 6,  text: "A few times a month" },
        { pts: 2,  text: "Rarely" },
      ],
      science: "Dunbar's layered network model (Sutcliffe et al., 2012, British Journal of Psychology) shows humans maintain ~5 \"support clique\" friends (needing weekly contact), ~15 \"sympathy group\" friends (monthly), and ~50 active friends (a few times a year). The frequency tiers here map directly to those layers. Separately, Hall (2018, Journal of Social and Personal Relationships) found it takes ~50 hours of interaction to form a casual friendship and ~200 hours for a best friend — consistent contact is how those hours accumulate.",
    },
    {
      label: "Balance",
      max: 20,
      color: brandColors.warning,
      icon: "🤝",
      description: "Whether you're the one reaching out, not just responding. Healthy relationships flow both ways.",
      tiers: [
        { pts: 20, text: "You start 30%+ of conversations" },
        { pts: 14, text: "You start 15–29%" },
        { pts: 8,  text: "You start 5–14%" },
        { pts: 3,  text: "Almost always them initiating" },
      ],
      science: "Equity theory (Adams, 1965) established that perceived imbalance in any relationship — including who does the reaching out — creates dissatisfaction over time. Relational maintenance research (Stafford & Canary, 1991, Communication Monographs) identifies mutual \"assurance\" and \"positivity\" behaviors — both of which require someone to initiate — as core to keeping relationships stable. You don't need perfect 50/50, but consistently being the passive party is a warning sign.",
    },
    {
      label: "Trend",
      max: 10,
      color: "#059669",
      icon: "📊",
      description: "Whether the relationship is warming up or cooling down compared to last month.",
      tiers: [
        { pts: 10, text: "This month ≥ last month (stable or growing)" },
        { pts: 5,  text: "Slightly less active than last month" },
        { pts: 0,  text: "Significantly quieter than last month" },
      ],
      science: "Declining contact is an early warning of relationship dissolution. Dunbar's group studied temporal communication patterns in phone networks and found that the volume of calls between two people is a leading indicator of relationship strength — a consistent drop tends to precede the relationship going dormant. Trend gets the smallest weight (10 pts) because a single quiet month isn't alarming — but the direction matters.",
    },
  ];

  return (
    <div className="fixed inset-0 z-40 overflow-y-auto" style={{ backgroundColor: brandColors.background }}>
      {/* Header */}
      <div style={{ backgroundColor: brandColors.primary }}>
        <div className="px-4 pt-10 pb-6">
          <button
            onClick={onBack}
            className="flex items-center space-x-1 text-white opacity-80 hover:opacity-100 mb-5 transition-opacity"
          >
            <ChevronLeft size={20} />
            <span className="text-sm">Back</span>
          </button>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: "rgba(255,255,255,0.2)" }}>
              <Info size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">How CatchUp Works</h1>
              <p className="text-blue-200 text-sm">Transparent · Science-informed · On-device</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-5 space-y-4">

        {/* Science grounding card */}
        <div className="rounded-2xl p-5 shadow-sm" style={{ backgroundColor: "#eff6ff", border: `1.5px solid ${brandColors.primary}30` }}>
          <p className="text-sm font-semibold mb-2" style={{ color: brandColors.primary }}>🧠 Grounded in Relationship Science</p>
          <p className="text-sm text-gray-700 leading-relaxed mb-3">
            The scoring draws on three decades of research into how humans maintain social bonds. The short version: <strong>contact frequency and recency</strong> are the strongest predictors of perceived closeness, and relationships that aren't actively maintained decay — sometimes faster than we expect.
          </p>
          <div className="space-y-2">
            {[
              { who: "Robin Dunbar", role: "Oxford professor of evolutionary psychology", finding: "Humans have a hard cognitive limit of ~150 stable relationships, structured in layers — and each layer needs a specific contact frequency to stay active." },
              { who: "Jeffrey Hall", role: "University of Kansas, 2018", finding: "Casual friendships require ~50 hours of interaction to form; close friendships ~90 hours; best friends 200+. Hours accumulate through consistent, repeated contact." },
              { who: "Holt-Lunstad et al.", role: "Meta-analysis, PLOS Medicine 2010", finding: "Social relationships are among the strongest predictors of longevity — comparable to quitting smoking. Weak social ties increase mortality risk by ~29%." },
            ].map((r) => (
              <div key={r.who} className="flex items-start space-x-2 py-2 border-t border-blue-100 first:border-0 first:pt-0">
                <span className="text-base flex-shrink-0 mt-0.5">📖</span>
                <div>
                  <p className="text-xs font-semibold text-gray-800">{r.who} <span className="font-normal text-gray-400">· {r.role}</span></p>
                  <p className="text-xs text-gray-600 leading-relaxed mt-0.5">{r.finding}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dunbar layers explainer */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Dunbar's Inner Circle</p>
          <p className="text-xs text-gray-500 mb-4 leading-relaxed">
            Dunbar found that everyone's network naturally organises into layers by closeness — and each layer has an implied contact cadence to stay active. CatchUp is designed to help you maintain your innermost circles.
          </p>
          <div className="space-y-2">
            {[
              { layer: "~5 people",   label: "Support Clique",   cadence: "Weekly contact",      color: brandColors.primary,  desc: "Your go-to people. Know your problems. Would lend you money." },
              { layer: "~15 people",  label: "Sympathy Group",   cadence: "Monthly contact",     color: "#7c3aed",            desc: "Close friends. You'd attend their wedding or funeral." },
              { layer: "~50 people",  label: "Active Network",   cadence: "A few times a year",  color: brandColors.warning,  desc: "Good friends. You pick up where you left off." },
              { layer: "~150 people", label: "Dunbar's Number",  cadence: "Occasional",          color: brandColors.secondary, desc: "The outer limit of stable social relationships." },
            ].map((d) => (
              <div key={d.layer} className="flex items-start space-x-3 py-2 border-b border-gray-50 last:border-0">
                <div className="flex-shrink-0 w-16 text-center pt-0.5">
                  <p className="text-xs font-bold" style={{ color: d.color }}>{d.layer}</p>
                  <p className="text-xs text-gray-400 leading-tight">{d.cadence}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{d.label}</p>
                  <p className="text-xs text-gray-500">{d.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* The Health Score intro */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">The Health Score</p>
          <p className="text-gray-700 text-sm leading-relaxed">
            Every person gets a score from <strong>0 to 100</strong> based on four observable signals from your messages and calls. No guessing, no AI black box — just patterns from data you already have.
          </p>
          <div className="mt-4 flex rounded-full overflow-hidden h-4">
            {[
              { pct: 40, color: brandColors.primary },
              { pct: 30, color: "#7c3aed" },
              { pct: 20, color: brandColors.warning },
              { pct: 10, color: "#059669" },
            ].map((s, i) => (
              <div key={i} style={{ width: `${s.pct}%`, backgroundColor: s.color }} />
            ))}
          </div>
          <div className="flex mt-1.5">
            {[
              { label: "Recency", pts: 40, color: brandColors.primary },
              { label: "Frequency", pts: 30, color: "#7c3aed" },
              { label: "Balance", pts: 20, color: brandColors.warning },
              { label: "Trend", pts: 10, color: "#059669" },
            ].map((s) => (
              <div key={s.label} className="text-center" style={{ width: `${s.pts}%` }}>
                <p className="text-xs font-bold" style={{ color: s.color }}>{s.pts}</p>
                <p className="text-gray-400 leading-tight" style={{ fontSize: "10px" }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Each component with science */}
        {scoreComponents.map((c) => (
          <div key={c.label} className="bg-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-xl">{c.icon}</span>
                <span className="font-semibold text-gray-900">{c.label}</span>
              </div>
              <span className="text-sm font-bold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: c.color }}>
                up to {c.max} pts
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-3 leading-relaxed">{c.description}</p>
            <div className="space-y-1.5">
              {c.tiers.map((t) => (
                <div key={t.pts} className="flex items-center space-x-3">
                  <div className="flex-1 h-2 rounded-full bg-gray-100 relative overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${(t.pts / c.max) * 100}%`, backgroundColor: c.color, opacity: 0.3 + 0.7 * (t.pts / c.max) }}
                    />
                  </div>
                  <span className="text-xs font-semibold w-8 text-right flex-shrink-0" style={{ color: c.color }}>{t.pts}</span>
                  <span className="text-xs text-gray-500 flex-shrink-0 w-44">{t.text}</span>
                </div>
              ))}
            </div>
            <SciencePill text={c.science} />
          </div>
        ))}

        {/* Calls */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-xl">📞</span>
            <span className="font-semibold text-gray-900">Why Calls Count More</span>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed mb-3">
            Each answered call counts as roughly <strong>3 messages</strong> in the score. This isn't arbitrary — richer communication channels do more bonding work per minute than text.
          </p>
          <div className="space-y-2 mb-3">
            {[
              { icon: "📹", label: "FaceTime Video", note: "Closest to in-person — facial cues, tone, laughter" },
              { icon: "🎙️", label: "FaceTime Audio / Phone", note: "Tone of voice carries emotional nuance texts can't" },
              { icon: "💬", label: "iMessage", note: "High volume, lower bonding depth per exchange" },
            ].map((row) => (
              <div key={row.label} className="flex items-center space-x-3 py-1.5 border-b border-gray-50 last:border-0">
                <span className="text-lg flex-shrink-0">{row.icon}</span>
                <div>
                  <p className="text-sm font-medium text-gray-800">{row.label}</p>
                  <p className="text-xs text-gray-400">{row.note}</p>
                </div>
              </div>
            ))}
          </div>
          <SciencePill text={"Vlahovic, Roberts & Dunbar (2012, Journal of Computer-Mediated Communication) found that voice calls produce more subjective feelings of closeness than text-based communication. Dunbar's broader research on \"social grooming\" suggests a hierarchy: face-to-face > voice > text, in terms of bonding effectiveness per unit of time."} />
        </div>

        {/* Status colors */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">What the Colors Mean</p>
          <div className="space-y-3">
            {[
              { color: brandColors.primary, dot: "🟢", label: "Healthy  70–100", desc: "You're in consistent touch. This relationship is actively maintained." },
              { color: brandColors.yellow,  dot: "🟡", label: "Needs Attention  40–69", desc: "It's been a while. A quick message can reset the clock significantly." },
              { color: brandColors.red,     dot: "🔴", label: "Priority  below 40", desc: "This relationship is going dormant. The longer you wait, the harder it gets to restart." },
            ].map((s) => (
              <div key={s.label} className="flex items-start space-x-3">
                <span className="text-lg flex-shrink-0">{s.dot}</span>
                <div>
                  <p className="text-sm font-semibold" style={{ color: s.color }}>{s.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <SciencePill text="The 70/40 thresholds are design decisions, not published cutoffs. But the direction is grounded: Roberts & Dunbar (2011) found emotional closeness scores correlate strongly with contact frequency, and Dunbar's layer model implies different maintenance requirements for different relationship tiers." />
        </div>

        {/* Data sources */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <div className="flex items-center space-x-2 mb-3">
            <Smartphone size={16} style={{ color: brandColors.primary }} />
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Data Sources</p>
          </div>
          <div className="space-y-1">
            {[
              { icon: "💬", label: "iMessage", desc: "Text and photo messages — last 90 days, individual and group chats." },
              { icon: "📞", label: "Phone & FaceTime", desc: "Answered calls over 10 seconds — last 90 days. Type (phone/audio/video) is recorded." },
              { icon: "👤", label: "Contacts", desc: "Used only to resolve phone numbers to names. Nothing is stored or transmitted." },
            ].map((s) => (
              <div key={s.label} className="flex items-start space-x-3 py-2.5 border-b border-gray-50 last:border-0">
                <span className="text-xl flex-shrink-0 mt-0.5">{s.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{s.label}</p>
                  <p className="text-xs text-gray-500 leading-relaxed mt-0.5">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Privacy */}
        <div className="rounded-2xl p-5 shadow-sm" style={{ backgroundColor: "#f0fdf4", border: "1.5px solid #bbf7d0" }}>
          <div className="flex items-center space-x-2 mb-2">
            <Shield size={16} style={{ color: "#059669" }} />
            <p className="text-sm font-semibold" style={{ color: "#059669" }}>100% On-Device</p>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            All data stays on your Mac. CatchUp reads your local databases directly — nothing is uploaded, synced to a server, or shared with anyone. Your messages and calls never leave your device.
          </p>
        </div>

        <div className="h-6" />
      </div>
    </div>
  );
};

// ─── Detail View ─────────────────────────────────────────────────────────────
const PersonDetailView = ({ person, onBack, onContact }) => {
  const maxContacts = Math.max(...person.analytics.contactFrequency.map(d => d.contacts), 1);

  const {
    relationship,
    setRelationship,
    addedTopics,
    removedTopics,
    addTopic,
    removeTopic,
    computeTopics,
    targetHealth,
    setTargetHealth,
    doNotTrack,
    setDoNotTrack,
  } = useContactPrefs(String(person.id));

  return (
    <div
      className="fixed inset-0 z-40 overflow-y-auto"
      style={{ backgroundColor: brandColors.background }}
    >
      {/* Header */}
      <div style={{ backgroundColor: brandColors.primary }}>
        <div className="px-4 pt-10 pb-6">
          <button
            onClick={onBack}
            className="flex items-center space-x-1 text-white opacity-80 hover:opacity-100 mb-4 transition-opacity"
          >
            <ChevronLeft size={20} />
            <span className="text-sm">Back</span>
          </button>

          <div className="flex items-end justify-between">
            <div className="flex items-center space-x-4">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg"
                style={{ backgroundColor: "rgba(255,255,255,0.25)" }}
              >
                {person.avatar}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">{person.name}</h1>
                <p className="text-blue-100 text-sm">
                  {relationship || person.relationship}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  {getStatusIcon(person.status)}
                  <span className="text-white text-sm font-medium">{person.healthScore}% health</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-blue-100 text-xs">Frequency</p>
              <p className="text-white font-semibold text-sm">{person.contactFrequency}</p>
              <p className="text-blue-100 text-xs mt-1">Next suggested</p>
              <p className="text-white font-semibold text-sm">{person.nextSuggested}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">

        {/* Relationship Tag Picker */}
        <RelationshipTagPicker selected={relationship} onSelect={setRelationship} />

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <p className="text-xs text-gray-500 mb-1">Last Contact</p>
            <p className="font-semibold text-gray-900">{person.lastContact}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <p className="text-xs text-gray-500 mb-1">Total Contacts</p>
            <p className="font-semibold" style={{ color: brandColors.primary }}>{person.analytics.totalContacts}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <p className="text-xs text-gray-500 mb-1">Fav Medium</p>
            <p className="font-semibold text-gray-900 capitalize">
              {Object.entries(person.analytics.methodBreakdown)
                .sort((a, b) => b[1] - a[1])[0][0]}
            </p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <p className="text-xs text-gray-500 mb-1">Avg Response</p>
            <p className="font-semibold text-gray-900">{person.analytics.avgResponseTime}</p>
          </div>
        </div>

        {/* Activity Graph */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center space-x-2 mb-4">
            <Activity size={16} style={{ color: brandColors.primary }} />
            <h2 className="font-semibold text-gray-900">Contact Activity</h2>
          </div>
          <div className="flex items-end justify-between h-24">
            {person.analytics.contactFrequency.map((data, i) => (
              <div key={i} className="flex flex-col items-center space-y-1 flex-1">
                <div className="w-full flex justify-center">
                  <div
                    className="w-6 rounded-t-md transition-all duration-500"
                    style={{
                      height: `${Math.max((data.contacts / maxContacts) * 80, 4)}px`,
                      backgroundColor:
                        data.contacts === 0 ? brandColors.red
                        : data.contacts < 4 ? brandColors.yellow
                        : brandColors.primary,
                    }}
                  />
                </div>
                <span className="text-xs text-gray-500">{data.month}</span>
                <span className="text-xs font-medium text-gray-700">{data.contacts}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Call Stats (if any) */}
        {person.analytics?.callStats && (
          person.analytics.callStats.phone > 0 ||
          person.analytics.callStats.facetimeAudio > 0 ||
          person.analytics.callStats.facetimeVideo > 0
        ) && (
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center space-x-2 mb-3">
              <Phone size={16} style={{ color: brandColors.primary }} />
              <h2 className="font-semibold text-gray-900">Calls & FaceTime</h2>
              <span className="text-xs text-gray-400 ml-auto">{person.analytics.callStats.totalMinutes} min total</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Phone", count: person.analytics.callStats.phone, icon: "📞" },
                { label: "FT Audio", count: person.analytics.callStats.facetimeAudio, icon: "🎙️" },
                { label: "FT Video", count: person.analytics.callStats.facetimeVideo, icon: "📹" },
              ].map(({ label, count, icon }) => (
                <div
                  key={label}
                  className="flex flex-col items-center p-2 rounded-xl"
                  style={{ backgroundColor: count > 0 ? "#e8f4fd" : "#f9fafb" }}
                >
                  <span className="text-lg mb-0.5">{icon}</span>
                  <span className="text-lg font-bold" style={{ color: count > 0 ? brandColors.primary : "#9ca3af" }}>{count}</span>
                  <span className="text-xs text-gray-500">{label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Interactive Topics */}
        <InteractiveTopics
          detectedTopics={person.topics || []}
          addedTopics={addedTopics}
          removedTopics={removedTopics}
          addTopic={addTopic}
          removeTopic={removeTopic}
          computeTopics={computeTopics}
        />

        {/* Contact History */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center space-x-2 mb-3">
            <Clock size={16} style={{ color: brandColors.primary }} />
            <h2 className="font-semibold text-gray-900">Contact History</h2>
          </div>
          <div className="space-y-0">
            {person.contactHistory.map((entry, i) => (
              <div
                key={i}
                className={`py-3 flex items-start space-x-3 ${
                  i < person.contactHistory.length - 1 ? "border-b border-gray-50" : ""
                }`}
              >
                {/* Medium icon */}
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: "#e8f4fd", color: brandColors.primary }}
                >
                  {getMediumIcon(entry.medium)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-semibold text-gray-800">{entry.medium}</span>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: "#f4f4f3", color: brandColors.secondary }}
                      >
                        {entry.subject}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400 flex-shrink-0">{entry.date}</span>
                  </div>
                  <p className="text-xs text-gray-500 truncate">{entry.summary}</p>
                  <p className="text-xs mt-0.5" style={{ color: entry.initiatedBy === "me" ? brandColors.primary : brandColors.secondary }}>
                    {entry.initiatedBy === "me" ? "You reached out" : "They reached out"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reach Your Goal */}
        <ReachYourGoal
          person={person}
          targetHealth={targetHealth}
          setTargetHealth={setTargetHealth}
        />

        {/* AI Suggestions */}
        {person.aiSuggestions?.length > 0 && (
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center space-x-2 mb-3">
              <Sparkles size={16} style={{ color: brandColors.primary }} />
              <h2 className="font-semibold text-gray-900">AI Suggestions</h2>
            </div>
            <div className="space-y-2">
              {person.aiSuggestions.map((s, i) => (
                <div
                  key={i}
                  className="flex items-start space-x-3 p-3 rounded-xl border-l-4"
                  style={{ borderLeftColor: getPriorityColor(s.priority), backgroundColor: "#f9fafb" }}
                >
                  <span className="text-lg">{s.icon}</span>
                  <p className="text-sm text-gray-700">{s.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Best Time */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center space-x-2 mb-1">
            <Calendar size={16} style={{ color: brandColors.primary }} />
            <h2 className="font-semibold text-gray-900">Best Time to Reach Out</h2>
          </div>
          <p className="text-sm text-gray-600 ml-6">{person.bestTimeToContact}</p>
        </div>

        {/* Do Not Track */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {doNotTrack
                ? <EyeOff size={18} style={{ color: brandColors.red }} />
                : <Eye size={18} style={{ color: brandColors.secondary }} />
              }
              <div>
                <p className="font-semibold text-gray-900 text-sm">Do Not Track</p>
                <p className="text-xs text-gray-500">
                  {doNotTrack ? "Hidden from your main list" : "Showing in your main list"}
                </p>
              </div>
            </div>
            <button
              onClick={() => setDoNotTrack(!doNotTrack)}
              className="relative w-12 h-6 rounded-full transition-colors duration-300 flex-shrink-0"
              style={{ backgroundColor: doNotTrack ? brandColors.red : "#d1d5db" }}
            >
              <span
                className="absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-300"
                style={{ left: doNotTrack ? "calc(100% - 20px)" : "4px" }}
              />
            </button>
          </div>
          {doNotTrack && (
            <p className="text-xs text-gray-400 mt-3 ml-9">
              You can restore this contact from the "Hidden" view on the main screen.
            </p>
          )}
        </div>

        {/* Spacer for action bar */}
        <div className="h-20" />
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3 flex space-x-3">
        <button
          onClick={() => onContact(person, "call")}
          className="flex-1 py-3 rounded-xl flex items-center justify-center space-x-2 font-medium text-white transition-all hover:opacity-90"
          style={{ backgroundColor: brandColors.primary }}
        >
          <Phone size={16} />
          <span>Call</span>
        </button>
        <button
          onClick={() => onContact(person, "text")}
          className="flex-1 py-3 rounded-xl flex items-center justify-center space-x-2 font-medium transition-all hover:opacity-90"
          style={{ backgroundColor: "#e8f4fd", color: brandColors.primary }}
        >
          <MessageCircle size={16} />
          <span>Text</span>
        </button>
        <button
          onClick={() => onContact(person, "email")}
          className="flex-1 py-3 rounded-xl flex items-center justify-center space-x-2 font-medium transition-all hover:opacity-90"
          style={{ backgroundColor: "#e8f4fd", color: brandColors.primary }}
        >
          <Mail size={16} />
          <span>Email</span>
        </button>
      </div>
    </div>
  );
};

// ─── Main Dashboard ───────────────────────────────────────────────────────────
const CatchUpDashboard = () => {
  const [relationships, setRelationships] = useState(SAMPLE_RELATIONSHIPS);
  const [dataSource, setDataSource] = useState("sample");
  const [syncing, setSyncing] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all"); // "all" | "individual" | "group"
  const [sortBy, setSortBy] = useState("healthDesc");
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showHidden, setShowHidden] = useState(false);
  const [prefsVersion, setPrefsVersion] = useState(0);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [showDetailView, setShowDetailView] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [lastSynced, setLastSynced] = useState(null);
  const [designVariant, setDesignVariant] = useState(() =>
    localStorage.getItem("catchup_design") || "D"
  );

  // Load data and set up auto-refresh every 30 minutes
  const loadData = React.useCallback((silent = false) => {
    fetch("/data/relationships.json?t=" + Date.now())
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data.relationships)) {
          setRelationships(data.relationships);
          setDataSource(data.source?.includes("Calls") ? "imessage+calls" : "imessage");
          setLastSynced(data.generatedAt || null);
        }
      })
      .catch(() => {
        if (!silent) {/* Fall back to sample data silently */}
      });
  }, []);

  useEffect(() => {
    loadData(false);
    const interval = setInterval(() => loadData(true), 30 * 60 * 1000); // every 30 min
    return () => clearInterval(interval);
  }, [loadData]);

  // Read all contact prefs from localStorage (re-reads when prefsVersion bumps)
  const contactPrefs = React.useMemo(() => {
    try { return JSON.parse(localStorage.getItem("catchup_prefs") || "{}"); }
    catch { return {}; }
  }, [prefsVersion]);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [showAnalyticsPanel, setShowAnalyticsPanel] = useState(false);
  const [showContactPanel, setShowContactPanel] = useState(false);
  const [selectedContactMethod, setSelectedContactMethod] = useState(null);

  const openDetailView = (person) => {
    setSelectedPerson(person);
    setShowDetailView(true);
  };

  const openAIPanel = (person) => {
    setSelectedPerson(person);
    setShowAIPanel(true);
  };

  const openAnalyticsPanel = (person) => {
    setSelectedPerson(person);
    setShowAnalyticsPanel(true);
  };

  const openContactPanel = (person) => {
    setSelectedPerson(person);
    setSelectedContactMethod(null);
    setShowContactPanel(true);
  };

  const initiateContact = (person, method, message = "") => {
    const encodedMessage = encodeURIComponent(message);
    switch (method) {
      case "call":
        window.open(`tel:${person.phoneNumber}`, "_self");
        break;
      case "text":
        if (/iPhone|iPad|iPod|Mac/.test(navigator.userAgent)) {
          window.open(`sms:${person.phoneNumber}&body=${encodedMessage}`, "_self");
        } else {
          window.open(`sms:${person.phoneNumber}?body=${encodedMessage}`, "_self");
        }
        break;
      case "email":
        window.open(
          `mailto:${person.email}?subject=${encodeURIComponent("Let's catch up!")}&body=${encodedMessage}`,
          "_self"
        );
        break;
      default:
        initiateContact(person, person.preferredMethod, message);
    }
    setShowContactPanel(false);
  };

  // Separate tracked vs hidden
  const trackedRelationships = relationships.filter(r => !(contactPrefs[String(r.id)]?.doNotTrack));
  const hiddenRelationships  = relationships.filter(r =>   contactPrefs[String(r.id)]?.doNotTrack);
  const hiddenCount = hiddenRelationships.length;

  const sourceList = showHidden ? hiddenRelationships : trackedRelationships;

  const sortedAndFiltered = [...sourceList]
    .filter((person) => {
      const matchesStatus = filterStatus === "all" || person.status === filterStatus;
      const matchesSearch = person.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType =
        filterType === "all" ||
        (filterType === "individual" && !person.isGroup) ||
        (filterType === "group" && person.isGroup);
      return matchesStatus && matchesSearch && matchesType;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "healthAsc":   return a.healthScore - b.healthScore;
        case "lastContact":
          return new Date(a.lastContactDate || 0) - new Date(b.lastContactDate || 0);
        case "nameAz":      return a.name.localeCompare(b.name);
        case "mostActive":  return (b.analytics?.totalContacts || 0) - (a.analytics?.totalContacts || 0);
        case "healthDesc":
        default:            return b.healthScore - a.healthScore;
      }
    });

  const filteredRelationships = sortedAndFiltered;

  const statusCounts = {
    all: trackedRelationships.length,
    green: trackedRelationships.filter((r) => r.status === "green").length,
    yellow: trackedRelationships.filter((r) => r.status === "yellow").length,
    red: trackedRelationships.filter((r) => r.status === "red").length,
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: brandColors.background }}>

      {/* About View */}
      {showAbout && <AboutView onBack={() => setShowAbout(false)} />}

      {/* ── Design switcher pill (floats above everything) ── */}
      <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2"
           style={{ pointerEvents: "auto" }}>
        <div className="flex items-center space-x-1 rounded-full px-2 py-1.5 shadow-2xl"
             style={{ backgroundColor: "rgba(12,35,64,0.92)", backdropFilter: "blur(12px)" }}>
          {[
            { key: "D",        label: "✦ Focus" },
            { key: "original", label: "Classic" },
            { key: "A",        label: "Coach" },
            { key: "B",        label: "Orbit" },
            { key: "C",        label: "Pulse" },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => { setDesignVariant(key); localStorage.setItem("catchup_design", key); }}
              className="px-3 py-1 rounded-full text-xs font-semibold transition-all"
              style={{
                backgroundColor: designVariant === key ? "#0969b8" : "transparent",
                color: designVariant === key ? "#fff" : "rgba(255,255,255,0.5)",
              }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Variant screens */}
      {designVariant === "D" && !showDetailView && !showAbout && (
        <DesignD
          relationships={filteredRelationships.length ? filteredRelationships : relationships}
          onOpenDetail={openDetailView}
          onOpenContact={openContactPanel}
          dataSource={dataSource}
          lastSynced={lastSynced}
        />
      )}
      {designVariant === "A" && !showDetailView && !showAbout && (
        <DesignA
          relationships={filteredRelationships.length ? filteredRelationships : relationships}
          onOpenDetail={openDetailView}
          onOpenContact={openContactPanel}
          dataSource={dataSource}
          lastSynced={lastSynced}
        />
      )}
      {designVariant === "B" && !showDetailView && !showAbout && (
        <DesignB
          relationships={filteredRelationships.length ? filteredRelationships : relationships}
          onOpenDetail={openDetailView}
          onOpenContact={openContactPanel}
          dataSource={dataSource}
          lastSynced={lastSynced}
        />
      )}
      {designVariant === "C" && !showDetailView && !showAbout && (
        <DesignC
          relationships={filteredRelationships.length ? filteredRelationships : relationships}
          onOpenDetail={openDetailView}
          onOpenContact={openContactPanel}
          dataSource={dataSource}
          lastSynced={lastSynced}
        />
      )}

      {/* Detail View (full-screen slide-in) */}
      {showDetailView && selectedPerson && (
        <PersonDetailView
          person={selectedPerson}
          onBack={() => { setShowDetailView(false); setPrefsVersion(v => v + 1); }}
          onContact={(person, method) => {
            setShowDetailView(false);
            openContactPanel(person);
            setSelectedContactMethod(method);
          }}
        />
      )}

      {/* ── Original design (shown when designVariant === "original") ── */}
      {designVariant === "original" && <>

      {/* Header — extra top padding for iOS notch/Dynamic Island in standalone PWA mode */}
      <div className="px-6 pb-8" style={{ backgroundColor: brandColors.primary, paddingTop: "max(2rem, env(safe-area-inset-top, 2rem))" }}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Heart className="text-white" size={28} />
            <h1 className="text-2xl font-bold text-white">CatchUp</h1>
            <button
              onClick={() => setShowAbout(true)}
              className="w-7 h-7 rounded-full flex items-center justify-center transition-all hover:bg-white hover:bg-opacity-20"
              style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
              title="How it works"
            >
              <Info size={14} className="text-white" />
            </button>
          </div>
          <div className="text-right">
            <p className="text-blue-100 text-sm">Your Relationship Health</p>
            <p className="text-white text-xl font-semibold">
              {Math.round(relationships.reduce((acc, r) => acc + r.healthScore, 0) / relationships.length)}%
            </p>
            <p className="text-blue-200 text-xs mt-0.5">
              {dataSource === "imessage+calls"
                ? "📱 iMessage + Calls"
                : dataSource === "imessage"
                ? "📱 Live iMessage data"
                : "📋 Sample data"}
            </p>
            {lastSynced && (
              <p className="text-blue-300 text-xs mt-0.5 opacity-70">
                Synced {(() => {
                  const mins = Math.round((Date.now() - new Date(lastSynced).getTime()) / 60000);
                  return mins < 1 ? "just now" : mins < 60 ? `${mins}m ago` : `${Math.round(mins / 60)}h ago`;
                })()}
              </p>
            )}
          </div>
        </div>

        {/* Status Summary Cards */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            { key: "all", label: "Total", color: brandColors.white, textColor: brandColors.primary },
            { key: "green", label: "Healthy", color: brandColors.primary, textColor: brandColors.white },
            { key: "yellow", label: "Attention", color: brandColors.yellow, textColor: brandColors.white },
            { key: "red", label: "Priority", color: brandColors.red, textColor: brandColors.white },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setFilterStatus(item.key)}
              className="p-3 rounded-xl transition-all duration-200 transform hover:scale-105"
              style={{
                backgroundColor: filterStatus === item.key ? item.color : "rgba(255,255,255,0.2)",
                color: filterStatus === item.key ? item.textColor : brandColors.white,
                border: `2px solid ${filterStatus === item.key ? item.color : "rgba(255,255,255,0.3)"}`,
              }}
            >
              <p className="text-2xl font-bold">{statusCounts[item.key]}</p>
              <p className="text-xs opacity-90">{item.label}</p>
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search relationships..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border-0 focus:ring-2 focus:ring-white focus:ring-opacity-50 outline-none"
            style={{ backgroundColor: "rgba(255,255,255,0.9)" }}
          />
        </div>
      </div>

      {/* Sort & Filter Bar */}
      <div className="bg-white border-b border-gray-100 px-4 py-2.5 flex items-center justify-between">
        {/* Sort dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowSortMenu(!showSortMenu)}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-medium border transition-all"
            style={{
              borderColor: sortBy !== "healthDesc" ? brandColors.primary : "#e0e0e0",
              color: sortBy !== "healthDesc" ? brandColors.primary : brandColors.secondary,
              backgroundColor: sortBy !== "healthDesc" ? "#e8f4fd" : "transparent",
            }}
          >
            <span>{SORT_LABEL[sortBy]}</span>
            <ChevronDown size={12} />
          </button>
          {showSortMenu && (
            <div className="absolute top-full mt-1 left-0 bg-white rounded-xl shadow-lg border border-gray-100 z-20 overflow-hidden" style={{ minWidth: "180px" }}>
              {SORT_OPTIONS.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => { setSortBy(key); setShowSortMenu(false); }}
                  className="w-full text-left px-4 py-2.5 text-xs hover:bg-gray-50 transition-colors flex items-center justify-between"
                  style={{ color: sortBy === key ? brandColors.primary : "#374151", fontWeight: sortBy === key ? "600" : "400" }}
                >
                  <span>{label}</span>
                  {sortBy === key && <CheckCircle size={12} style={{ color: brandColors.primary }} />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Type filter pills */}
        <div className="flex items-center space-x-1">
          {[
            { key: "all",        label: "All" },
            { key: "individual", label: "People" },
            { key: "group",      label: "Groups" },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilterType(key)}
              className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
              style={{
                backgroundColor: filterType === key ? brandColors.primary : "#f4f4f3",
                color: filterType === key ? "#ffffff" : brandColors.secondary,
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Relationships List */}
      {/* Overlay to close sort menu when clicking elsewhere */}
      {showSortMenu && (
        <div className="fixed inset-0 z-10" onClick={() => setShowSortMenu(false)} />
      )}

      {showHidden && (
        <div className="mx-6 mt-4 mb-1 flex items-center space-x-2 p-3 rounded-xl" style={{ backgroundColor: "#fff3f3", border: `1.5px solid ${brandColors.red}20` }}>
          <EyeOff size={14} style={{ color: brandColors.red }} />
          <p className="text-xs font-medium flex-1" style={{ color: brandColors.red }}>
            Showing {hiddenCount} Do Not Track contact{hiddenCount !== 1 ? "s" : ""}
          </p>
          <button
            onClick={() => { setShowHidden(false); setFilterStatus("all"); setFilterType("all"); }}
            className="text-xs font-semibold"
            style={{ color: brandColors.red }}
          >
            Back to list
          </button>
        </div>
      )}

      <div className="px-6 py-4 space-y-3">
        {filteredRelationships.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            <p className="text-sm">No contacts match your filters.</p>
          </div>
        ) : (
          filteredRelationships.map((person) => (
            <ContactCard
              key={person.id}
              person={person}
              onOpenDetail={openDetailView}
              onOpenAnalytics={openAnalyticsPanel}
              onOpenAI={openAIPanel}
              onOpenContact={openContactPanel}
            />
          ))
        )}
      </div>

      {/* Hidden contacts footer */}
      {!showHidden && hiddenCount > 0 && (
        <div className="text-center pb-6">
          <button
            onClick={() => setShowHidden(true)}
            className="inline-flex items-center space-x-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors py-2 px-4 rounded-full hover:bg-gray-100"
          >
            <EyeOff size={12} />
            <span>{hiddenCount} hidden contact{hiddenCount !== 1 ? "s" : ""}</span>
          </button>
        </div>
      )}

      </> /* end original design */}

      {/* Smart Contact Panel */}
      {showContactPanel && selectedPerson && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl w-full max-w-md mx-4 overflow-hidden animate-slide-up">
            <div className="px-6 py-4 border-b border-gray-100" style={{ backgroundColor: brandColors.primary }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                    style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
                  >
                    {selectedPerson.avatar}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{selectedPerson.name}</h2>
                    <p className="text-sm text-blue-100">Smart Contact Assistant</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowContactPanel(false)}
                  className="p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors duration-200"
                >
                  <X size={20} className="text-white" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl">
                <div className="flex items-center space-x-2 mb-2">
                  <Sparkles size={16} style={{ color: brandColors.primary }} />
                  <span className="text-sm font-medium text-gray-900">AI Recommendation</span>
                </div>
                <p className="text-sm text-gray-700 mb-3">
                  Based on their patterns, {selectedPerson.name} responds best to{" "}
                  <span className="font-medium" style={{ color: brandColors.primary }}>
                    {getBestContactMethod(selectedPerson)}s
                  </span>{" "}
                  during{" "}
                  <span className="font-medium">{selectedPerson.bestTimeToContact.toLowerCase()}</span>
                </p>
              </div>

              <h3 className="font-semibold text-gray-900 mb-3">Choose Contact Method</h3>
              <div className="space-y-3">
                {[
                  { method: "call", label: "Call Now", desc: "Direct phone call", Icon: Phone },
                  { method: "text", label: "Send Message", desc: "AI-crafted text message", Icon: MessageCircle },
                  { method: "email", label: "Email", desc: "Send an email", Icon: Send },
                ].map(({ method, label, desc, Icon }) => (
                  <button
                    key={method}
                    onClick={() =>
                      method === "call"
                        ? initiateContact(selectedPerson, "call")
                        : setSelectedContactMethod(method)
                    }
                    className="w-full p-4 rounded-xl border-2 flex items-center justify-between transition-all duration-200 hover:scale-105 hover:shadow-lg"
                    style={{
                      borderColor: selectedContactMethod === method || (getBestContactMethod(selectedPerson) === method && !selectedContactMethod) ? brandColors.primary : "#e5e7eb",
                      backgroundColor: selectedContactMethod === method || (getBestContactMethod(selectedPerson) === method && !selectedContactMethod) ? "#f0f8ff" : "transparent",
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon size={20} style={{ color: brandColors.primary }} />
                      <div className="text-left">
                        <p className="font-medium text-gray-900">{label}</p>
                        <p className="text-sm text-gray-500">{desc}</p>
                      </div>
                    </div>
                    {getBestContactMethod(selectedPerson) === method ? (
                      <span className="text-xs px-2 py-1 rounded-full text-white" style={{ backgroundColor: brandColors.primary }}>
                        RECOMMENDED
                      </span>
                    ) : (
                      <ArrowRight size={16} className="text-gray-400" />
                    )}
                  </button>
                ))}
              </div>

              {selectedContactMethod && (
                <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                    <Lightbulb size={16} className="mr-2" style={{ color: brandColors.yellow }} />
                    AI-Generated Message
                  </h4>
                  <div className="mb-3 p-3 bg-white rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-700 italic">"{generateAIMessage(selectedPerson)}"</p>
                  </div>
                  <button
                    onClick={() => initiateContact(selectedPerson, selectedContactMethod, generateAIMessage(selectedPerson))}
                    className="w-full py-3 px-4 rounded-lg text-white font-medium transition-all duration-200 hover:scale-105 flex items-center justify-center space-x-2"
                    style={{ backgroundColor: brandColors.primary }}
                  >
                    <Send size={16} />
                    <span>Send via {selectedContactMethod.charAt(0).toUpperCase() + selectedContactMethod.slice(1)}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* AI Suggestions Panel */}
      {showAIPanel && selectedPerson && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
          <div className="bg-white rounded-t-3xl w-full max-w-lg max-h-[80vh] overflow-hidden animate-slide-up">
            <div className="px-6 py-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                    style={{ backgroundColor: getStatusColor(selectedPerson.status) }}
                  >
                    {selectedPerson.avatar}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{selectedPerson.name}</h2>
                    <p className="text-sm text-gray-500">AI Conversation Assistant</p>
                  </div>
                </div>
                <button onClick={() => setShowAIPanel(false)} className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200">
                  <X size={20} className="text-gray-500" />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto max-h-[calc(80vh-120px)] p-6">
              <div className="mb-4 p-4 bg-blue-50 rounded-xl">
                <div className="flex items-center space-x-2 mb-3">
                  <Clock size={16} style={{ color: brandColors.primary }} />
                  <h3 className="font-semibold" style={{ color: brandColors.primary }}>Recent Context</h3>
                </div>
                <div className="space-y-2">
                  {selectedPerson.recentContext?.map((context, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: brandColors.primary }} />
                      <p className="text-sm text-gray-700">{context}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                {selectedPerson.aiSuggestions?.map((suggestion, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-xl border-l-4 bg-gray-50"
                    style={{ borderLeftColor: getPriorityColor(suggestion.priority) }}
                  >
                    <div className="flex items-start space-x-3">
                      <span className="text-2xl">{suggestion.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span
                            className="text-xs font-medium px-2 py-1 rounded-full text-white"
                            style={{ backgroundColor: getPriorityColor(suggestion.priority) }}
                          >
                            {suggestion.priority.toUpperCase()}
                          </span>
                        </div>
                        <p className="text-gray-900 font-medium">{suggestion.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <button
                  onClick={() => { setShowAIPanel(false); openContactPanel(selectedPerson); }}
                  className="w-full py-3 px-4 rounded-xl text-white font-medium transition-all duration-200 hover:scale-105 flex items-center justify-center space-x-2"
                  style={{ backgroundColor: brandColors.primary }}
                >
                  <Zap size={16} />
                  <span>Smart Contact</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Panel */}
      {showAnalyticsPanel && selectedPerson && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
          <div className="bg-white rounded-t-3xl w-full max-w-lg max-h-[90vh] overflow-hidden animate-slide-up">
            <div className="px-6 py-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                    style={{ backgroundColor: getStatusColor(selectedPerson.status) }}
                  >
                    {selectedPerson.avatar}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{selectedPerson.name}</h2>
                    <p className="text-sm text-gray-500">Relationship Analytics</p>
                  </div>
                </div>
                <button onClick={() => setShowAnalyticsPanel(false)} className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200">
                  <X size={20} className="text-gray-500" />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto max-h-[calc(90vh-120px)] pb-6">
              <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-purple-50">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Activity size={16} className="mr-2" style={{ color: brandColors.primary }} />
                  Key Metrics
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white p-3 rounded-xl">
                    <p className="text-xs text-gray-500">Total Contacts</p>
                    <p className="text-2xl font-bold" style={{ color: brandColors.primary }}>{selectedPerson.analytics?.totalContacts}</p>
                  </div>
                  <div className="bg-white p-3 rounded-xl">
                    <p className="text-xs text-gray-500">Avg Response</p>
                    <p className="text-2xl font-bold" style={{ color: brandColors.yellow }}>{selectedPerson.analytics?.avgResponseTime}</p>
                  </div>
                  <div className="bg-white p-3 rounded-xl">
                    <p className="text-xs text-gray-500">Responsiveness</p>
                    <p className="text-2xl font-bold" style={{ color: getStatusColor(selectedPerson.status) }}>{selectedPerson.analytics?.responsiveness}%</p>
                  </div>
                  <div className="bg-white p-3 rounded-xl">
                    <p className="text-xs text-gray-500">Health Score</p>
                    <p className="text-2xl font-bold" style={{ color: brandColors.secondary }}>{selectedPerson.healthScore}%</p>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <TrendingUp size={16} className="mr-2" style={{ color: brandColors.primary }} />
                  Contact Frequency Trend
                </h3>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-end justify-between h-32">
                    {selectedPerson.analytics?.contactFrequency.map((data, index) => (
                      <div key={index} className="flex flex-col items-center space-y-2">
                        <div
                          className="w-8 rounded-t-lg transition-all duration-500"
                          style={{
                            height: `${Math.max((data.contacts / 12) * 100, 8)}%`,
                            backgroundColor: data.contacts === 0 ? brandColors.red : data.contacts < 4 ? brandColors.yellow : brandColors.primary,
                            minHeight: "8px",
                          }}
                        />
                        <span className="text-xs text-gray-600">{data.month}</span>
                        <span className="text-xs font-medium text-gray-900">{data.contacts}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="px-6 py-4">
                <h3 className="font-semibold text-gray-900 mb-3">Communication Methods</h3>
                <div className="space-y-3">
                  {Object.entries(selectedPerson.analytics?.methodBreakdown || {}).map(([method, percentage]) => (
                    <div key={method} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {method === "calls" && <Phone size={14} />}
                        {method === "texts" && <MessageCircle size={14} />}
                        {method === "social" && <Heart size={14} />}
                        <span className="text-sm capitalize">{method}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full transition-all duration-500 rounded-full"
                            style={{
                              width: `${percentage}%`,
                              backgroundColor: method === "calls" ? brandColors.primary : method === "texts" ? brandColors.yellow : brandColors.red,
                            }}
                          />
                        </div>
                        <span className="text-sm font-medium w-8">{percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="px-6 py-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Lightbulb size={16} className="mr-2" style={{ color: brandColors.yellow }} />
                  Data Insights
                </h3>
                <div className="space-y-3">
                  {selectedPerson.analytics?.responsiveness < 50 && (
                    <div className="p-3 bg-red-50 rounded-lg border-l-4" style={{ borderLeftColor: brandColors.red }}>
                      <p className="text-sm text-red-800">🚨 Low responsiveness detected. This relationship may need more attention.</p>
                    </div>
                  )}
                  {selectedPerson.analytics?.contactFrequency[0].contacts === 0 && (
                    <div className="p-3 bg-orange-50 rounded-lg border-l-4" style={{ borderLeftColor: brandColors.yellow }}>
                      <p className="text-sm text-orange-800">📉 No contact this month. Consider reaching out soon.</p>
                    </div>
                  )}
                  <div className="p-3 bg-blue-50 rounded-lg border-l-4" style={{ borderLeftColor: brandColors.primary }}>
                    <p className="text-sm text-blue-800">
                      💡 {selectedPerson.name} prefers{" "}
                      {selectedPerson.analytics?.methodBreakdown.calls > 50 ? "phone calls" : "text messages"}{" "}
                      and responds within {selectedPerson.analytics?.avgResponseTime} on average.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6">
        <button
          className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-white transition-all duration-200 hover:scale-110"
          style={{ backgroundColor: brandColors.primary }}
        >
          <User size={24} />
        </button>
      </div>

      <style jsx>{`
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

// ─── ContactCard (extracted so it can use useContactPrefs) ───────────────────
const ContactCard = ({ person, onOpenDetail, onOpenAnalytics, onOpenAI, onOpenContact }) => {
  const { relationship } = useContactPrefs(String(person.id));
  const displayRelationship = relationship || person.relationship;

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0"
            style={{ backgroundColor: getStatusColor(person.status) }}
          >
            {person.avatar}
          </div>

          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onOpenDetail(person)}
                className="font-semibold text-gray-900 hover:underline text-left"
                style={{ color: brandColors.darkBlue }}
              >
                {person.name}
              </button>
              {getStatusIcon(person.status)}
            </div>
            <p className="text-sm text-gray-500">{displayRelationship}</p>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-xs text-gray-400">Last: {person.lastContact}</span>
              <span className="text-xs text-gray-400">•</span>
              <span className="text-xs text-gray-400">Next: {person.nextSuggested}</span>
            </div>
          </div>
        </div>

        <div className="text-right flex-shrink-0">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-xs text-gray-500">Health</span>
            <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full transition-all duration-500 rounded-full"
                style={{ width: `${person.healthScore}%`, backgroundColor: getStatusColor(person.status) }}
              />
            </div>
            <span className="text-xs font-medium" style={{ color: getStatusColor(person.status) }}>
              {person.healthScore}%
            </span>
          </div>

          <div className="flex items-center space-x-2 justify-end">
            <button
              onClick={() => onOpenAnalytics(person)}
              className="p-2 rounded-lg transition-all duration-200 hover:bg-blue-50 hover:scale-105"
              style={{ color: brandColors.primary }}
              title="Analytics"
            >
              <BarChart3 size={14} />
            </button>
            <button
              onClick={() => onOpenAI(person)}
              className="p-2 rounded-lg transition-all duration-200 hover:bg-purple-50 hover:scale-105"
              style={{ color: brandColors.primary }}
              title="AI Suggestions"
            >
              <Sparkles size={14} />
            </button>
            <button
              onClick={() => onOpenContact(person)}
              className="p-2 rounded-lg transition-colors duration-200 hover:bg-blue-50"
              style={{ color: brandColors.primary }}
              title="Smart Contact"
            >
              <Zap size={14} />
            </button>
          </div>
        </div>
      </div>

      {person.notes && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-sm text-gray-600 italic">"{person.notes}"</p>
        </div>
      )}
    </div>
  );
};

export default CatchUpDashboard;
