// CatchUp - Personal Relationship Assistant
// Complete React Application

import React, { useState } from 'react';
import { User, Phone, MessageCircle, Calendar, Search, Heart, AlertTriangle, CheckCircle, Sparkles, ArrowRight, Clock, Lightbulb, X, BarChart3, TrendingUp, Activity, Send, Zap } from 'lucide-react';

const CatchUpDashboard = () => {
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [showAnalyticsPanel, setShowAnalyticsPanel] = useState(false);
  const [showContactPanel, setShowContactPanel] = useState(false);
  const [selectedContactMethod, setSelectedContactMethod] = useState(null);

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
        { type: "topic", content: "Ask about her new yoga instructor she mentioned", priority: "high", icon: "💪" },
        { type: "activity", content: "Suggest trying that new brunch place downtown", priority: "medium", icon: "🥐" }
      ],
      recentContext: ["Started yoga classes", "Job interview last week", "Loves trying new restaurants"],
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
          { month: "May", contacts: 8 }
        ],
        methodBreakdown: { calls: 65, texts: 25, social: 10 },
        responsiveness: 95
      }
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
        { type: "congratulations", content: "Congratulate on his promotion to Senior Developer", priority: "high", icon: "🎉" },
        { type: "topic", content: "Ask about his new team and responsibilities", priority: "medium", icon: "👥" }
      ],
      recentContext: ["Got promoted to Senior Developer", "Working with new team"],
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
          { month: "May", contacts: 8 }
        ],
        methodBreakdown: { calls: 20, texts: 70, social: 10 },
        responsiveness: 70
      }
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
        { type: "urgent", content: "Congratulate on engagement (6 weeks overdue!)", priority: "critical", icon: "💍" },
        { type: "apology", content: "Acknowledge you've been out of touch", priority: "high", icon: "🙏" }
      ],
      recentContext: ["Got engaged to longtime boyfriend", "Planning wedding for next year"],
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
          { month: "May", contacts: 8 }
        ],
        methodBreakdown: { calls: 30, texts: 40, social: 30 },
        responsiveness: 35
      }
    }
  ];

  // Brand colors
  const brandColors = {
    primary: '#0969b8',
    secondary: '#6c6870', 
    white: '#ffffff',
    warning: '#e6961e',
    background: '#f4f4f3',
    black: '#000000',
    darkBlue: '#0c2340',
    blue: '#003087',
    red: '#e4002c',
    gray: '#c4ced3',
    yellow: '#f2a900'
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'green': return brandColors.primary;
      case 'yellow': return brandColors.yellow;
      case 'red': return brandColors.red;
      default: return brandColors.secondary;
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'green': return <CheckCircle size={16} color={brandColors.primary} />;
      case 'yellow': return <AlertTriangle size={16} color={brandColors.yellow} />;
      case 'red': return <AlertTriangle size={16} color={brandColors.red} />;
      default: return null;
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'critical': return brandColors.red;
      case 'high': return brandColors.yellow;
      case 'medium': return brandColors.primary;
      case 'low': return brandColors.secondary;
      default: return brandColors.secondary;
    }
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

  const generateAIMessage = (person) => {
    const firstName = person.name.split(' ')[0];
    if (person.mood === 'excited') return `Hey ${firstName}! Hope you're doing great! Thinking of you and wanted to catch up 😊`;
    if (person.mood.includes('stressed')) return `Hi ${firstName}! I know things have been hectic for you lately. Hope you're doing okay! 💙`;
    if (person.mood.includes('hurt')) return `Hi ${firstName}! I've been thinking about you and realized it's been too long since we talked. Hope you're well! ❤️`;
    return `Hey ${firstName}! Hope you're having a great day! Would love to catch up soon 😊`;
  };

  const initiateContact = (person, method, message = '') => {
    const encodedMessage = encodeURIComponent(message);
    
    switch(method) {
      case 'call':
        window.open(`tel:${person.phoneNumber}`, '_self');
        break;
      case 'text':
        if (/iPhone|iPad|iPod|Mac/.test(navigator.userAgent)) {
          window.open(`sms:${person.phoneNumber}&body=${encodedMessage}`, '_self');
        } else {
          window.open(`sms:${person.phoneNumber}?body=${encodedMessage}`, '_self');
        }
        break;
      case 'email':
        const subject = encodeURIComponent(`Let's catch up!`);
        window.open(`mailto:${person.email}?subject=${subject}&body=${encodedMessage}`, '_self');
        break;
      default:
        initiateContact(person, person.preferredMethod, message);
    }
    
    setShowContactPanel(false);
  };

  const getBestContactMethod = (person) => {
    const methods = person.analytics?.methodBreakdown || {};
    if (methods.calls > 50) return 'call';
    if (methods.texts > 40) return 'text';
    return person.preferredMethod;
  };

  const filteredRelationships = relationships.filter(person => {
    const matchesFilter = filterStatus === 'all' || person.status === filterStatus;
    const matchesSearch = person.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const statusCounts = {
    all: relationships.length,
    green: relationships.filter(r => r.status === 'green').length,
    yellow: relationships.filter(r => r.status === 'yellow').length,
    red: relationships.filter(r => r.status === 'red').length
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: brandColors.background }}>
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
          </div>
        </div>

        {/* Status Summary Cards */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            { key: 'all', label: 'Total', color: brandColors.white, textColor: brandColors.primary },
            { key: 'green', label: 'Healthy', color: brandColors.primary, textColor: brandColors.white },
            { key: 'yellow', label: 'Attention', color: brandColors.yellow, textColor: brandColors.white },
            { key: 'red', label: 'Priority', color: brandColors.red, textColor: brandColors.white }
          ].map(item => (
            <button
              key={item.key}
              onClick={() => setFilterStatus(item.key)}
              className="p-3 rounded-xl transition-all duration-200 transform hover:scale-105"
              style={{ 
                backgroundColor: filterStatus === item.key ? item.color : 'rgba(255,255,255,0.2)',
                color: filterStatus === item.key ? item.textColor : brandColors.white,
                border: `2px solid ${filterStatus === item.key ? item.color : 'rgba(255,255,255,0.3)'}`
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
            style={{ backgroundColor: 'rgba(255,255,255,0.9)' }}
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
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                  style={{ backgroundColor: getStatusColor(person.status) }}
                >
                  {person.avatar}
                </div>

                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-gray-900">{person.name}</h3>
                    {getStatusIcon(person.status)}
                  </div>
                  <p className="text-sm text-gray-500">{person.relationship}</p>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-xs text-gray-400">Last: {person.lastContact}</span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-400">Next: {person.nextSuggested}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-xs text-gray-500">Health</span>
                  <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full transition-all duration-500 rounded-full"
                      style={{
                        width: `${person.healthScore}%`,
                        backgroundColor: getStatusColor(person.status)
                      }}
                    />
                  </div>
                  <span className="text-xs font-medium" style={{ color: getStatusColor(person.status) }}>
                    {person.healthScore}%
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => openAnalyticsPanel(person)}
                    className="p-2 rounded-lg transition-all duration-200 hover:bg-green-50 hover:scale-105"
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
                    style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
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
                  Based on their patterns, {selectedPerson.name} responds best to{' '}
                  <span className="font-medium" style={{ color: brandColors.primary }}>
                    {getBestContactMethod(selectedPerson)}s
                  </span>{' '}
                  during <span className="font-medium">{selectedPerson.bestTimeToContact.toLowerCase()}</span>
                </p>
              </div>

              <h3 className="font-semibold text-gray-900 mb-3">Choose Contact Method</h3>
              <div className="space-y-3">
                <button
                  onClick={() => initiateContact(selectedPerson, 'call')}
                  className="w-full p-4 rounded-xl border-2 flex items-center justify-between transition-all duration-200 hover:scale-105 hover:shadow-lg"
                  style={{ 
                    borderColor: getBestContactMethod(selectedPerson) === 'call' ? brandColors.primary : '#e5e7eb',
                    backgroundColor: getBestContactMethod(selectedPerson) === 'call' ? '#f0f8ff' : 'transparent'
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <Phone size={20} style={{ color: brandColors.primary }} />
                    <div className="text-left">
                      <p className="font-medium text-gray-900">Call Now</p>
                      <p className="text-sm text-gray-500">Direct phone call</p>
                    </div>
                  </div>
                  {getBestContactMethod(selectedPerson) === 'call' && (
                    <span className="text-xs px-2 py-1 rounded-full text-white" style={{ backgroundColor: brandColors.primary }}>
                      RECOMMENDED
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setSelectedContactMethod('text')}
                  className="w-full p-4 rounded-xl border-2 flex items-center justify-between transition-all duration-200 hover:scale-105 hover:shadow-lg"
                  style={{ 
                    borderColor: selectedContactMethod === 'text' ? brandColors.primary : '#e5e7eb',
                    backgroundColor: selectedContactMethod === 'text' ? '#f0f8ff' : 'transparent'
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <MessageCircle size={20} style={{ color: brandColors.primary }} />
                    <div className="text-left">
                      <p className="font-medium text-gray-900">Send Message</p>
                      <p className="text-sm text-gray-500">AI-crafted text message</p>
                    </div>
                  </div>
                  <ArrowRight size={16} className="text-gray-400" />
                </button>

                <button
                  onClick={() => setSelectedContactMethod('email')}
                  className="w-full p-4 rounded-xl border-2 flex items-center justify-between transition-all duration-200 hover:scale-105 hover:shadow-lg"
                  style={{ 
                    borderColor: selectedContactMethod === 'email' ? brandColors.primary : '#e5e7eb',
                    backgroundColor: selectedContactMethod === 'email' ? '#f0f8ff' : 'transparent'
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <Send size={20} style={{ color: brandColors.primary }} />
                    <div className="text-left">
                      <p className="font-medium text-gray-900">Email</p>
                      <p className="text-sm text-gray-500">Send an email</p>
                    </div>
                  </div>
                  <ArrowRight size={16} className="text-gray-400" />
                </button>
              </div>

              {selectedContactMethod && selectedContactMethod !== 'call' && (
                <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                    <Lightbulb size={16} className="mr-2" style={{ color: brandColors.yellow }} />
                    AI-Generated Message
                  </h4>
                  <div className="mb-3 p-3 bg-white rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-700 italic">
                      "{generateAIMessage(selectedPerson)}"
                    </p>
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
                <button
                  onClick={() => setShowAIPanel(false)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                >
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
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: brandColors.primary }}></div>
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
                          <span className="text-xs font-medium px-2 py-1 rounded-full text-white"
                                style={{ backgroundColor: getPriorityColor(suggestion.priority) }}>
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
                  onClick={() => openContactPanel(selectedPerson)}
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
                <button
                  onClick={() => setShowAnalyticsPanel(false)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                >
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
                    <p className="text-2xl font-bold" style={{ color: brandColors.primary }}>
                      {selectedPerson.analytics?.totalContacts}
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded-xl">
                    <p className="text-xs text-gray-500">Avg Response</p>
                    <p className="text-2xl font-bold" style={{ color: brandColors.yellow }}>
                      {selectedPerson.analytics?.avgResponseTime}
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded-xl">
                    <p className="text-xs text-gray-500">Responsiveness</p>
                    <p className="text-2xl font-bold" style={{ color: getStatusColor(selectedPerson.status) }}>
                      {selectedPerson.analytics?.responsiveness}%
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded-xl">
                    <p className="text-xs text-gray-500">Health Score</p>
                    <p className="text-2xl font-bold" style={{ color: brandColors.secondary }}>
                      {selectedPerson.healthScore}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Frequency Chart */}
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
                            backgroundColor: data.contacts === 0 ? brandColors.red : 
                                           data.contacts < 4 ? brandColors.yellow : brandColors.primary,
                            minHeight: '8px'
                          }}
                        />
                        <span className="text-xs text-gray-600">{data.month}</span>
                        <span className="text-xs font-medium text-gray-900">{data.contacts}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Communication Breakdown */}
              <div className="px-6 py-4">
                <h3 className="font-semibold text-gray-900 mb-3">Communication Methods</h3>
                <div className="space-y-3">
                  {Object.entries(selectedPerson.analytics?.methodBreakdown || {}).map(([method, percentage]) => (
                    <div key={method} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {method === 'calls' && <Phone size={14} />}
                        {method === 'texts' && <MessageCircle size={14} />}
                        {method === 'social' && <Heart size={14} />}
                        <span className="text-sm capitalize">{method}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full transition-all duration-500 rounded-full"
                            style={{
                              width: `${percentage}%`,
                              backgroundColor: method === 'calls' ? brandColors.primary : 
                                             method === 'texts' ? brandColors.yellow : brandColors.red
                            }}
                          />
                        </div>
                        <span className="text-sm font-medium w-8">{percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Data Insights */}
              <div className="px-6 py-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Lightbulb size={16} className="mr-2" style={{ color: brandColors.yellow }} />
                  Data Insights
                </h3>
                <div className="space-y-3">
                  {selectedPerson.analytics?.responsiveness < 50 && (
                    <div className="p-3 bg-red-50 rounded-lg border-l-4" style={{ borderLeftColor: brandColors.red }}>
                      <p className="text-sm text-red-800">
                        🚨 Low responsiveness detected. This relationship may need more attention.
                      </p>
                    </div>
                  )}
                  
                  {selectedPerson.analytics?.contactFrequency[0].contacts === 0 && (
                    <div className="p-3 bg-orange-50 rounded-lg border-l-4" style={{ borderLeftColor: brandColors.yellow }}>
                      <p className="text-sm text-orange-800">
                        📉 No contact this month. Consider reaching out soon.
                      </p>
                    </div>
                  )}

                  <div className="p-3 bg-blue-50 rounded-lg border-l-4" style={{ borderLeftColor: brandColors.primary }}>
                    <p className="text-sm text-blue-800">
                      💡 {selectedPerson.name} prefers {selectedPerson.analytics?.methodBreakdown.calls > 50 ? 'phone calls' : 'text messages'} and responds within {selectedPerson.analytics?.avgResponseTime} on average.
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
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default CatchUpDashboard;
