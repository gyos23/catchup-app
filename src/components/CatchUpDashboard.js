// CatchUp - Personal Relationship Assistant
// Complete React Application

import React, { useState, useEffect } from "react";
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
  Mail,
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
    topics: ["Career", "Yoga", "Food & Restaurants", "Travel"],
    contactHistory: [
      { date: "3 days ago", medium: "Call", subject: "Career", initiatedBy: "me", summary: "Discussed her new job interview prep" },
      { date: "10 days ago", medium: "Text", subject: "Food & Restaurants", initiatedBy: "them", summary: "She found a new brunch spot downtown" },
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
    },
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
    topics: ["Tech & Work", "Gaming", "NBA", "Career"],
    contactHistory: [
      { date: "2 weeks ago", medium: "Text", subject: "Career", initiatedBy: "them", summary: "Told me about his promotion to Senior Dev" },
      { date: "1 month ago", medium: "Call", subject: "NBA", initiatedBy: "me", summary: "Long catch-up after the playoffs" },
      { date: "6 weeks ago", medium: "Text", subject: "Gaming", initiatedBy: "them", summary: "Shared a clip from his stream" },
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
    },
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
    topics: ["Work Projects", "Wedding Planning", "Design", "Travel"],
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
    },
  },
];

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
    case "Call": return <Phone size={13} />;
    case "Text": return <MessageCircle size={13} />;
    case "Email": return <Mail size={13} />;
    case "F2F": return <User size={13} />;
    default: return <Send size={13} />;
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

// ─── Detail View ─────────────────────────────────────────────────────────────
const PersonDetailView = ({ person, onBack, onContact }) => {
  const maxContacts = Math.max(...person.analytics.contactFrequency.map(d => d.contacts), 1);

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
                <p className="text-blue-100 text-sm">{person.relationship}</p>
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

        {/* Topics */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex items-center space-x-2 mb-3">
            <Lightbulb size={16} style={{ color: brandColors.yellow }} />
            <h2 className="font-semibold text-gray-900">Shared Topics</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {person.topics.map((topic, i) => (
              <span
                key={i}
                className="text-xs px-3 py-1 rounded-full font-medium"
                style={{ backgroundColor: "#e8f4fd", color: brandColors.primary }}
              >
                {topic}
              </span>
            ))}
          </div>
        </div>

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
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [showDetailView, setShowDetailView] = useState(false);

  // Try to load live iMessage data on mount
  useEffect(() => {
    fetch("/data/relationships.json")
      .then((r) => r.json())
      .then((data) => {
        if (data.relationships?.length > 0) {
          setRelationships(data.relationships);
          setDataSource("imessage");
        }
      })
      .catch(() => {
        // Fall back to sample data silently
      });
  }, []);
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

  const filteredRelationships = relationships.filter((person) => {
    const matchesFilter = filterStatus === "all" || person.status === filterStatus;
    const matchesSearch = person.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const statusCounts = {
    all: relationships.length,
    green: relationships.filter((r) => r.status === "green").length,
    yellow: relationships.filter((r) => r.status === "yellow").length,
    red: relationships.filter((r) => r.status === "red").length,
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: brandColors.background }}>

      {/* Detail View (full-screen slide-in) */}
      {showDetailView && selectedPerson && (
        <PersonDetailView
          person={selectedPerson}
          onBack={() => setShowDetailView(false)}
          onContact={(person, method) => {
            setShowDetailView(false);
            openContactPanel(person);
            setSelectedContactMethod(method);
          }}
        />
      )}

      {/* Header */}
      <div className="px-6 py-8" style={{ backgroundColor: brandColors.primary }}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Heart className="text-white" size={28} />
            <h1 className="text-2xl font-bold text-white">CatchUp</h1>
          </div>
          <div className="text-right">
            <p className="text-blue-100 text-sm">Your Relationship Health</p>
            <p className="text-white text-xl font-semibold">
              {Math.round(relationships.reduce((acc, r) => acc + r.healthScore, 0) / relationships.length)}%
            </p>
            <p className="text-blue-200 text-xs mt-0.5">
              {dataSource === "imessage" ? "📱 Live iMessage data" : "📋 Sample data"}
            </p>
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

      {/* Relationships List */}
      <div className="px-6 py-4 space-y-3">
        {filteredRelationships.map((person) => (
          <div
            key={person.id}
            className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-200"
          >
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
                      onClick={() => openDetailView(person)}
                      className="font-semibold text-gray-900 hover:underline text-left"
                      style={{ color: brandColors.darkBlue }}
                    >
                      {person.name}
                    </button>
                    {getStatusIcon(person.status)}
                  </div>
                  <p className="text-sm text-gray-500">{person.relationship}</p>
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
                    onClick={() => openAnalyticsPanel(person)}
                    className="p-2 rounded-lg transition-all duration-200 hover:bg-blue-50 hover:scale-105"
                    style={{ color: brandColors.primary }}
                    title="Analytics"
                  >
                    <BarChart3 size={14} />
                  </button>
                  <button
                    onClick={() => openAIPanel(person)}
                    className="p-2 rounded-lg transition-all duration-200 hover:bg-purple-50 hover:scale-105"
                    style={{ color: brandColors.primary }}
                    title="AI Suggestions"
                  >
                    <Sparkles size={14} />
                  </button>
                  <button
                    onClick={() => openContactPanel(person)}
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
        ))}
      </div>

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

export default CatchUpDashboard;
