// CatchUp - Personal Relationship Assistant
// Complete Functional React Application

import React, { useState } from "react";
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
  Mail,
  Check,
} from "lucide-react";

const CatchUpDashboard = () => {
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [showAnalyticsPanel, setShowAnalyticsPanel] = useState(false);
  const [showContactPanel, setShowContactPanel] = useState(false);
  const [selectedContactMethod, setSelectedContactMethod] = useState(null);
  const [contactMessage, setContactMessage] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");

  // Sample relationship data - replace with real data in production
  const relationships = [
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
      aiSuggestions: [
        {
          type: "topic",
          content: "Ask about her new yoga instructor she mentioned",
          priority: "high",
          icon: "💪",
        },
        {
          type: "activity",
          content: "Suggest trying that new brunch place downtown",
          priority: "medium",
          icon: "🥐",
        },
      ],
      recentContext: [
        "Started yoga classes",
        "Job interview last week",
        "Loves trying new restaurants",
      ],
      bestTimeToContact: "Weekday evenings after 6pm",
      mood: "excited",
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
      aiSuggestions: [
        {
          type: "congratulations",
          content: "Congratulate on his promotion to Senior Developer",
          priority: "high",
          icon: "🎉",
        },
        {
          type: "topic",
          content: "Ask about his new team and responsibilities",
          priority: "medium",
          icon: "👥",
        },
      ],
      recentContext: [
        "Got promoted to Senior Developer",
        "Working with new team",
      ],
      bestTimeToContact: "Weekend mornings",
      mood: "stressed but proud",
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
      aiSuggestions: [
        {
          type: "urgent",
          content: "Congratulate on engagement (6 weeks overdue!)",
          priority: "critical",
          icon: "💍",
        },
        {
          type: "apology",
          content: "Acknowledge you've been out of touch",
          priority: "high",
          icon: "🙏",
        },
      ],
      recentContext: [
        "Got engaged to longtime boyfriend",
        "Planning wedding for next year",
      ],
      bestTimeToContact: "Weekday lunch break",
      mood: "might be hurt by lack of contact",
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

  // Brand colors
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

  // Helper functions
  const getStatusColor = (status) => {
    switch (status) {
      case "green":
        return brandColors.primary;
      case "yellow":
        return brandColors.yellow;
      case "red":
        return brandColors.red;
      default:
        return brandColors.secondary;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "green":
        return <CheckCircle size={16} color={brandColors.primary} />;
      case "yellow":
        return <AlertTriangle size={16} color={brandColors.yellow} />;
      case "red":
        return <AlertTriangle size={16} color={brandColors.red} />;
      default:
        return null;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "critical":
        return brandColors.red;
      case "high":
        return brandColors.yellow;
      case "medium":
        return brandColors.primary;
      case "low":
        return brandColors.secondary;
      default:
        return brandColors.secondary;
    }
  };

  // Functional handlers
  const handleFilterChange = (status) => {
    setFilterStatus(status);
    setSelectedPerson(null);
    showTemporaryNotification(
      `Filtering by: ${status === "all" ? "All contacts" : status + " status"}`
    );
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handlePersonSelect = (person) => {
    setSelectedPerson(person);
    setShowAIPanel(false);
    setShowAnalyticsPanel(false);
    setShowContactPanel(false);
  };

  const handleShowAI = () => {
    setShowAIPanel(true);
    setShowAnalyticsPanel(false);
    setShowContactPanel(false);
  };

  const handleShowAnalytics = () => {
    setShowAnalyticsPanel(true);
    setShowAIPanel(false);
    setShowContactPanel(false);
  };

  const handleContactMethod = (method) => {
    setSelectedContactMethod(method);
    setShowContactPanel(true);
    setShowAIPanel(false);
    setShowAnalyticsPanel(false);

    // Pre-fill message based on AI suggestions if available
    if (selectedPerson?.aiSuggestions?.[0]) {
      setContactMessage(
        `Hi ${selectedPerson.name.split(" ")[0]}! ${
          selectedPerson.aiSuggestions[0].content
        }`
      );
    }
  };

  const handleSendMessage = () => {
    if (!contactMessage.trim()) {
      showTemporaryNotification("Please enter a message first!");
      return;
    }

    const methodName =
      selectedContactMethod === "call"
        ? "Call initiated"
        : selectedContactMethod === "text"
        ? "Message sent"
        : selectedContactMethod === "email"
        ? "Email sent"
        : "Message sent";

    showTemporaryNotification(`${methodName} to ${selectedPerson.name}!`);
    setContactMessage("");
    setShowContactPanel(false);
    setSelectedContactMethod(null);

    // In a real app, this would update the backend
    console.log(
      `Contacting ${selectedPerson.name} via ${selectedContactMethod}: ${contactMessage}`
    );
  };

  const handleUseSuggestion = (suggestion) => {
    setContactMessage(
      contactMessage + (contactMessage ? " " : "") + suggestion.content
    );
    showTemporaryNotification("AI suggestion added to message!");
  };

  const handleQuickContact = (person) => {
    setSelectedPerson(person);
    handleContactMethod(person.preferredMethod);
  };

  const showTemporaryNotification = (message) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  const handleMarkAsContacted = () => {
    showTemporaryNotification(`Marked ${selectedPerson.name} as contacted!`);
    // In a real app, update the backend
  };

  const handleScheduleReminder = () => {
    showTemporaryNotification(`Reminder scheduled for ${selectedPerson.name}!`);
    // In a real app, integrate with calendar
  };

  // Filter and search logic
  const filteredRelationships = relationships.filter((person) => {
    const matchesFilter =
      filterStatus === "all" || person.status === filterStatus;
    const matchesSearch =
      person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.relationship.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Sort by priority (red first, then yellow, then green)
  const sortedRelationships = [...filteredRelationships].sort((a, b) => {
    const statusOrder = { red: 0, yellow: 1, green: 2 };
    return statusOrder[a.status] - statusOrder[b.status];
  });

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: brandColors.background }}
    >
      {/* Notification Toast */}
      {showNotification && (
        <div className="fixed top-4 right-4 z-50 animate-slide-down">
          <div
            className="px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2"
            style={{ backgroundColor: brandColors.primary }}
          >
            <Check size={20} className="text-white" />
            <span className="text-white font-medium">
              {notificationMessage}
            </span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: brandColors.primary }}
              >
                <Heart size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">CatchUp</h1>
                <p className="text-sm text-gray-500">
                  Stay connected with what matters
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => handleFilterChange("all")}
                  className={`px-4 py-2 rounded-md transition-all duration-200 ${
                    filterStatus === "all"
                      ? "text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-200"
                  }`}
                  style={{
                    backgroundColor:
                      filterStatus === "all"
                        ? brandColors.primary
                        : "transparent",
                  }}
                >
                  All
                </button>
                <button
                  onClick={() => handleFilterChange("green")}
                  className={`px-4 py-2 rounded-md transition-all duration-200 ${
                    filterStatus === "green"
                      ? "text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-200"
                  }`}
                  style={{
                    backgroundColor:
                      filterStatus === "green"
                        ? brandColors.primary
                        : "transparent",
                  }}
                >
                  Good
                </button>
                <button
                  onClick={() => handleFilterChange("yellow")}
                  className={`px-4 py-2 rounded-md transition-all duration-200 ${
                    filterStatus === "yellow"
                      ? "text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-200"
                  }`}
                  style={{
                    backgroundColor:
                      filterStatus === "yellow"
                        ? brandColors.yellow
                        : "transparent",
                  }}
                >
                  Check In
                </button>
                <button
                  onClick={() => handleFilterChange("red")}
                  className={`px-4 py-2 rounded-md transition-all duration-200 ${
                    filterStatus === "red"
                      ? "text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-200"
                  }`}
                  style={{
                    backgroundColor:
                      filterStatus === "red" ? brandColors.red : "transparent",
                  }}
                >
                  Urgent
                </button>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-4 relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search people or relationships..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 transition-all duration-200"
              style={{ focusRing: brandColors.primary }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Contacts</p>
                <p className="text-2xl font-bold text-gray-900">
                  {relationships.length}
                </p>
              </div>
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: brandColors.primary + "20" }}
              >
                <User size={24} style={{ color: brandColors.primary }} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Need Attention</p>
                <p
                  className="text-2xl font-bold"
                  style={{ color: brandColors.red }}
                >
                  {relationships.filter((p) => p.status === "red").length}
                </p>
              </div>
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: brandColors.red + "20" }}
              >
                <AlertTriangle size={24} style={{ color: brandColors.red }} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Check Soon</p>
                <p
                  className="text-2xl font-bold"
                  style={{ color: brandColors.yellow }}
                >
                  {relationships.filter((p) => p.status === "yellow").length}
                </p>
              </div>
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: brandColors.yellow + "20" }}
              >
                <Clock size={24} style={{ color: brandColors.yellow }} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">All Good</p>
                <p
                  className="text-2xl font-bold"
                  style={{ color: brandColors.primary }}
                >
                  {relationships.filter((p) => p.status === "green").length}
                </p>
              </div>
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: brandColors.primary + "20" }}
              >
                <CheckCircle size={24} style={{ color: brandColors.primary }} />
              </div>
            </div>
          </div>
        </div>

        {/* Relationship Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedRelationships.map((person) => (
            <div
              key={person.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden cursor-pointer border-2 border-transparent hover:border-opacity-50"
              style={{
                borderColor:
                  selectedPerson?.id === person.id
                    ? getStatusColor(person.status)
                    : "transparent",
              }}
              onClick={() => handlePersonSelect(person)}
            >
              <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                      style={{ backgroundColor: getStatusColor(person.status) }}
                    >
                      {person.avatar}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {person.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {person.relationship}
                      </p>
                    </div>
                  </div>
                  {getStatusIcon(person.status)}
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Last contact:</span>
                    <span className="font-medium text-gray-900">
                      {person.lastContact}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Next suggested:</span>
                    <span
                      className="font-medium"
                      style={{ color: getStatusColor(person.status) }}
                    >
                      {person.nextSuggested}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Health Score:</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full transition-all duration-500"
                          style={{
                            width: `${person.healthScore}%`,
                            backgroundColor: getStatusColor(person.status),
                          }}
                        />
                      </div>
                      <span className="font-medium text-gray-900">
                        {person.healthScore}%
                      </span>
                    </div>
                  </div>
                </div>

                {person.notes && (
                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <p className="text-sm text-gray-700">{person.notes}</p>
                  </div>
                )}

                {/* Quick Actions */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPerson(person);
                      handleContactMethod("call");
                    }}
                    className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-1"
                    title="Call"
                  >
                    <Phone size={16} />
                    <span className="text-sm">Call</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPerson(person);
                      handleContactMethod("text");
                    }}
                    className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-1"
                    title="Text"
                  >
                    <MessageCircle size={16} />
                    <span className="text-sm">Text</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPerson(person);
                      handleShowAI();
                    }}
                    className="px-3 py-2 rounded-lg transition-colors duration-200 flex items-center justify-center"
                    style={{
                      backgroundColor: brandColors.primary + "20",
                      color: brandColors.primary,
                    }}
                    title="AI Suggestions"
                  >
                    <Sparkles size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {sortedRelationships.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              No contacts found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>

      {/* Detail Panels */}
      {selectedPerson && (
        <div className="fixed bottom-0 left-0 right-0 z-50">
          <div className="max-w-2xl mx-auto bg-white rounded-t-3xl shadow-2xl animate-slide-up">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-xl"
                    style={{
                      backgroundColor: getStatusColor(selectedPerson.status),
                    }}
                  >
                    {selectedPerson.avatar}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {selectedPerson.name}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {selectedPerson.relationship}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedPerson(null)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>

              {/* Action Tabs */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleShowAI}
                  className={`flex-1 px-4 py-2 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 ${
                    showAIPanel
                      ? "text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  style={{
                    backgroundColor: showAIPanel
                      ? brandColors.primary
                      : undefined,
                  }}
                >
                  <Sparkles size={16} />
                  <span>AI Suggestions</span>
                </button>
                <button
                  onClick={handleShowAnalytics}
                  className={`flex-1 px-4 py-2 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 ${
                    showAnalyticsPanel
                      ? "text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  style={{
                    backgroundColor: showAnalyticsPanel
                      ? brandColors.primary
                      : undefined,
                  }}
                >
                  <BarChart3 size={16} />
                  <span>Analytics</span>
                </button>
                <button
                  onClick={handleMarkAsContacted}
                  className="px-4 py-2 bg-green-100 text-green-700 hover:bg-green-200 rounded-lg transition-colors duration-200 flex items-center space-x-2"
                >
                  <Check size={16} />
                  <span>Mark Contacted</span>
                </button>
              </div>
            </div>

            {/* Panel Content */}
            <div className="max-h-96 overflow-y-auto p-6">
              {showAIPanel && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900 flex items-center">
                      <Sparkles
                        size={16}
                        className="mr-2"
                        style={{ color: brandColors.primary }}
                      />
                      AI-Powered Suggestions
                    </h3>
                  </div>

                  {selectedPerson.aiSuggestions?.map((suggestion, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-xl cursor-pointer hover:shadow-md transition-all duration-200 border-l-4"
                      style={{
                        backgroundColor:
                          getPriorityColor(suggestion.priority) + "10",
                        borderLeftColor: getPriorityColor(suggestion.priority),
                      }}
                      onClick={() => handleUseSuggestion(suggestion)}
                    >
                      <div className="flex items-start space-x-3">
                        <span className="text-2xl">{suggestion.icon}</span>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <span
                              className="text-xs font-medium uppercase tracking-wide"
                              style={{
                                color: getPriorityColor(suggestion.priority),
                              }}
                            >
                              {suggestion.type}
                            </span>
                            <span
                              className="text-xs px-2 py-1 rounded-full"
                              style={{
                                backgroundColor:
                                  getPriorityColor(suggestion.priority) + "20",
                                color: getPriorityColor(suggestion.priority),
                              }}
                            >
                              {suggestion.priority}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 mb-2">
                            {suggestion.content}
                          </p>
                          <button
                            className="text-xs font-medium flex items-center"
                            style={{ color: brandColors.primary }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUseSuggestion(suggestion);
                            }}
                          >
                            Use this suggestion
                            <ArrowRight size={12} className="ml-1" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Context Info */}
                  <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                    <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                      <Lightbulb
                        size={16}
                        className="mr-2"
                        style={{ color: brandColors.yellow }}
                      />
                      Recent Context
                    </h4>
                    <ul className="space-y-2">
                      {selectedPerson.recentContext?.map((context, index) => (
                        <li
                          key={index}
                          className="text-sm text-gray-700 flex items-start"
                        >
                          <span className="mr-2">•</span>
                          {context}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-3 pt-3 border-t border-blue-100">
                      <p className="text-xs text-gray-600">
                        <Clock size={12} className="inline mr-1" />
                        Best time: {selectedPerson.bestTimeToContact}
                      </p>
                    </div>
                  </div>

                  {/* Contact Buttons */}
                  <div className="grid grid-cols-3 gap-3 mt-6">
                    <button
                      onClick={() => handleContactMethod("call")}
                      className="p-4 rounded-xl transition-all duration-200 hover:shadow-md"
                      style={{
                        backgroundColor: brandColors.primary + "10",
                        color: brandColors.primary,
                      }}
                    >
                      <Phone size={24} className="mx-auto mb-2" />
                      <span className="text-sm font-medium">Call</span>
                    </button>
                    <button
                      onClick={() => handleContactMethod("text")}
                      className="p-4 rounded-xl transition-all duration-200 hover:shadow-md"
                      style={{
                        backgroundColor: brandColors.yellow + "10",
                        color: brandColors.yellow,
                      }}
                    >
                      <MessageCircle size={24} className="mx-auto mb-2" />
                      <span className="text-sm font-medium">Text</span>
                    </button>
                    <button
                      onClick={() => handleContactMethod("email")}
                      className="p-4 rounded-xl transition-all duration-200 hover:shadow-md"
                      style={{
                        backgroundColor: brandColors.secondary + "10",
                        color: brandColors.secondary,
                      }}
                    >
                      <Mail size={24} className="mx-auto mb-2" />
                      <span className="text-sm font-medium">Email</span>
                    </button>
                  </div>
                </div>
              )}

              {showAnalyticsPanel && (
                <div className="space-y-6">
                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl">
                      <p className="text-xs text-gray-600 mb-1">
                        Total Contacts
                      </p>
                      <p
                        className="text-3xl font-bold"
                        style={{ color: brandColors.primary }}
                      >
                        {selectedPerson.analytics?.totalContacts}
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-xl">
                      <p className="text-xs text-gray-600 mb-1">Avg Response</p>
                      <p
                        className="text-3xl font-bold"
                        style={{ color: brandColors.yellow }}
                      >
                        {selectedPerson.analytics?.avgResponseTime}
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl">
                      <p className="text-xs text-gray-600 mb-1">
                        Responsiveness
                      </p>
                      <p className="text-3xl font-bold text-green-600">
                        {selectedPerson.analytics?.responsiveness}%
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl">
                      <p className="text-xs text-gray-600 mb-1">Health Score</p>
                      <p className="text-3xl font-bold text-purple-600">
                        {selectedPerson.healthScore}%
                      </p>
                    </div>
                  </div>

                  {/* Contact Frequency Chart */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <TrendingUp
                        size={16}
                        className="mr-2"
                        style={{ color: brandColors.primary }}
                      />
                      Contact Frequency (Last 5 Months)
                    </h4>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-end justify-between h-32 space-x-2">
                        {selectedPerson.analytics?.contactFrequency.map(
                          (data, index) => (
                            <div
                              key={index}
                              className="flex-1 flex flex-col items-center space-y-2"
                            >
                              <div
                                className="w-full rounded-t-lg transition-all duration-500 hover:opacity-80"
                                style={{
                                  height: `${Math.max(
                                    (data.contacts / 12) * 100,
                                    8
                                  )}%`,
                                  backgroundColor:
                                    data.contacts === 0
                                      ? brandColors.red
                                      : data.contacts < 4
                                      ? brandColors.yellow
                                      : brandColors.primary,
                                  minHeight: "8px",
                                }}
                              />
                              <span className="text-xs text-gray-600">
                                {data.month}
                              </span>
                              <span className="text-xs font-bold text-gray-900">
                                {data.contacts}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Communication Methods */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">
                      Communication Methods
                    </h4>
                    <div className="space-y-3">
                      {Object.entries(
                        selectedPerson.analytics?.methodBreakdown || {}
                      ).map(([method, percentage]) => (
                        <div
                          key={method}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center space-x-2">
                            {method === "calls" && (
                              <Phone
                                size={16}
                                style={{ color: brandColors.primary }}
                              />
                            )}
                            {method === "texts" && (
                              <MessageCircle
                                size={16}
                                style={{ color: brandColors.yellow }}
                              />
                            )}
                            {method === "social" && (
                              <Heart
                                size={16}
                                style={{ color: brandColors.red }}
                              />
                            )}
                            <span className="text-sm capitalize font-medium">
                              {method}
                            </span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="w-32 h-3 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full transition-all duration-500 rounded-full"
                                style={{
                                  width: `${percentage}%`,
                                  backgroundColor:
                                    method === "calls"
                                      ? brandColors.primary
                                      : method === "texts"
                                      ? brandColors.yellow
                                      : brandColors.red,
                                }}
                              />
                            </div>
                            <span className="text-sm font-bold w-10 text-right">
                              {percentage}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Insights */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <Lightbulb
                        size={16}
                        className="mr-2"
                        style={{ color: brandColors.yellow }}
                      />
                      Insights
                    </h4>
                    <div className="space-y-2">
                      {selectedPerson.analytics?.responsiveness < 50 && (
                        <div
                          className="p-3 rounded-lg border-l-4"
                          style={{
                            backgroundColor: brandColors.red + "10",
                            borderLeftColor: brandColors.red,
                          }}
                        >
                          <p className="text-sm font-medium text-red-800">
                            🚨 Low responsiveness - relationship needs attention
                          </p>
                        </div>
                      )}
                      {selectedPerson.analytics?.contactFrequency[0]
                        .contacts === 0 && (
                        <div
                          className="p-3 rounded-lg border-l-4"
                          style={{
                            backgroundColor: brandColors.yellow + "10",
                            borderLeftColor: brandColors.yellow,
                          }}
                        >
                          <p className="text-sm font-medium text-orange-800">
                            📉 No contact this month - reach out soon!
                          </p>
                        </div>
                      )}
                      <div
                        className="p-3 rounded-lg border-l-4"
                        style={{
                          backgroundColor: brandColors.primary + "10",
                          borderLeftColor: brandColors.primary,
                        }}
                      >
                        <p className="text-sm font-medium text-blue-800">
                          💡 {selectedPerson.name} prefers{" "}
                          {selectedPerson.analytics?.methodBreakdown.calls > 50
                            ? "phone calls"
                            : "text messages"}{" "}
                          and responds within{" "}
                          {selectedPerson.analytics?.avgResponseTime}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {showContactPanel && (
                <div className="space-y-4">
                  <div className="text-center mb-4">
                    <div
                      className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center"
                      style={{
                        backgroundColor:
                          selectedContactMethod === "call"
                            ? brandColors.primary + "20"
                            : selectedContactMethod === "text"
                            ? brandColors.yellow + "20"
                            : brandColors.secondary + "20",
                      }}
                    >
                      {selectedContactMethod === "call" && (
                        <Phone
                          size={32}
                          style={{ color: brandColors.primary }}
                        />
                      )}
                      {selectedContactMethod === "text" && (
                        <MessageCircle
                          size={32}
                          style={{ color: brandColors.yellow }}
                        />
                      )}
                      {selectedContactMethod === "email" && (
                        <Mail
                          size={32}
                          style={{ color: brandColors.secondary }}
                        />
                      )}
                    </div>
                    <h3 className="font-semibold text-lg text-gray-900">
                      {selectedContactMethod === "call"
                        ? "Call"
                        : selectedContactMethod === "text"
                        ? "Text Message"
                        : "Email"}{" "}
                      {selectedPerson.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {selectedContactMethod === "call"
                        ? selectedPerson.phoneNumber
                        : selectedContactMethod === "text"
                        ? selectedPerson.phoneNumber
                        : selectedPerson.email}
                    </p>
                  </div>

                  {selectedContactMethod !== "call" && (
                    <>
                      <textarea
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                        placeholder={`Type your ${
                          selectedContactMethod === "text" ? "message" : "email"
                        } here...`}
                        className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 resize-none"
                        style={{ focusRing: brandColors.primary }}
                        rows={6}
                      />

                      {selectedPerson.aiSuggestions && (
                        <div className="space-y-2">
                          <p className="text-xs text-gray-500 font-medium">
                            Quick suggestions:
                          </p>
                          {selectedPerson.aiSuggestions.map(
                            (suggestion, index) => (
                              <button
                                key={index}
                                onClick={() => handleUseSuggestion(suggestion)}
                                className="w-full text-left p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-sm text-gray-700 border border-gray-200"
                              >
                                {suggestion.icon} {suggestion.content}
                              </button>
                            )
                          )}
                        </div>
                      )}

                      <div className="flex space-x-3">
                        <button
                          onClick={handleSendMessage}
                          className="flex-1 py-3 rounded-xl text-white font-medium transition-all duration-200 hover:shadow-lg flex items-center justify-center space-x-2"
                          style={{ backgroundColor: brandColors.primary }}
                        >
                          <Send size={18} />
                          <span>
                            Send{" "}
                            {selectedContactMethod === "text"
                              ? "Message"
                              : "Email"}
                          </span>
                        </button>
                        <button
                          onClick={() => {
                            setShowContactPanel(false);
                            setSelectedContactMethod(null);
                            setContactMessage("");
                          }}
                          className="px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors duration-200 font-medium"
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  )}

                  {selectedContactMethod === "call" && (
                    <div className="space-y-3">
                      <button
                        onClick={() => {
                          window.location.href = `tel:${selectedPerson.phoneNumber}`;
                          handleSendMessage();
                        }}
                        className="w-full py-4 rounded-xl text-white font-medium transition-all duration-200 hover:shadow-lg flex items-center justify-center space-x-2 text-lg"
                        style={{ backgroundColor: brandColors.primary }}
                      >
                        <Phone size={24} />
                        <span>Start Call</span>
                      </button>
                      <button
                        onClick={() => {
                          setShowContactPanel(false);
                          setSelectedContactMethod(null);
                        }}
                        className="w-full py-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors duration-200 font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={handleScheduleReminder}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-white transition-all duration-200 hover:scale-110 hover:shadow-xl z-40"
        style={{ backgroundColor: brandColors.primary }}
        title="Schedule Reminder"
      >
        <Calendar size={24} />
      </button>

      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        @keyframes slide-down {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default CatchUpDashboard;
