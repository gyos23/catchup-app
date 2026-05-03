/**
 * CatchUp — Home page design variants
 * A: Coach    — one hero action card, compact roster
 * B: Orbit    — avatar ring grid, whole tribe at a glance
 * C: Pulse    — section-based (Today / This Week / Good)
 * D: Focus    — ADA candidate: animated rings + hero + clean sections
 */

import React, { useState, useEffect } from "react";
import {
  Heart, Phone, MessageCircle, Search, ChevronRight,
  Zap, Clock, CheckCircle, AlertTriangle, X, Plus,
} from "lucide-react";

const brand = {
  primary:   "#007AFF",  // blue — reserved for "Your move today" / focus
  dark:      "#0c2340",
  orange:    "#FF9F0A",  // attention / needs work
  red:       "#FF453A",  // overdue / priority
  green:     "#34C759",  // healthy / good
  yellow:    "#FF9F0A",  // alias for orange (legacy refs)
  bg:        "#f4f4f3",
  white:     "#ffffff",
  secondary: "#6c6870",
};

// ─── Shared helpers ───────────────────────────────────────────────────────────
function statusColor(status) {
  return status === "green" ? brand.green : status === "yellow" ? brand.orange : brand.red;
}

function HealthRing({ score, size = 60, strokeWidth = 4 }) {
  const r = (size - strokeWidth * 2) / 2;
  const c = 2 * Math.PI * r;
  const dash = (score / 100) * c;
  const color = score >= 70 ? brand.green : score >= 40 ? brand.orange : brand.red;
  return (
    <svg width={size} height={size} style={{ position: "absolute", top: 0, left: 0 }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth={strokeWidth} />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke={color} strokeWidth={strokeWidth}
        strokeDasharray={`${dash} ${c}`} strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </svg>
  );
}

function HealthRingLight({ score, size = 60, strokeWidth = 4 }) {
  const r = (size - strokeWidth * 2) / 2;
  const c = 2 * Math.PI * r;
  const dash = (score / 100) * c;
  const color = score >= 70 ? brand.primary : score >= 40 ? brand.yellow : brand.red;
  return (
    <svg width={size} height={size} style={{ position: "absolute", top: 0, left: 0 }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e5e7eb" strokeWidth={strokeWidth} />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke={color} strokeWidth={strokeWidth}
        strokeDasharray={`${dash} ${c}`} strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </svg>
  );
}

// ─── DESIGN A — Coach ────────────────────────────────────────────────────────
export function DesignA({ relationships, onOpenDetail, onOpenContact, dataSource, lastSynced }) {
  const [search, setSearch] = useState("");

  const individuals = relationships.filter(r => !r.isGroup);
  const allSorted   = [...relationships].sort((a, b) => a.healthScore - b.healthScore);

  // Most urgent: lowest health, individual first
  const hero = allSorted.find(r => !r.isGroup) || allSorted[0];

  const avgHealth = Math.round(
    relationships.reduce((s, r) => s + r.healthScore, 0) / Math.max(relationships.length, 1)
  );

  const roster = relationships
    .filter(r => r.id !== hero?.id)
    .filter(r => !search || r.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => a.healthScore - b.healthScore);

  const syncedMins = lastSynced
    ? Math.round((Date.now() - new Date(lastSynced).getTime()) / 60000)
    : null;

  return (
    <div className="min-h-screen" style={{ backgroundColor: brand.bg, fontFamily: "system-ui, -apple-system, sans-serif" }}>

      {/* Top bar */}
      <div style={{ backgroundColor: brand.dark, paddingTop: "max(1.5rem, env(safe-area-inset-top))" }}
           className="px-5 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Heart size={20} className="text-white" />
            <span className="text-white font-bold text-lg tracking-tight">CatchUp</span>
          </div>
          <div className="text-right">
            <p className="text-white font-bold text-lg leading-none">{avgHealth}%</p>
            <p className="text-blue-300 text-xs mt-0.5">tribe health</p>
          </div>
        </div>
      </div>

      {/* Hero action card */}
      {hero && (
        <div className="mx-4 -mt-1 rounded-2xl overflow-hidden shadow-xl"
             style={{ background: `linear-gradient(135deg, ${brand.primary} 0%, #054a8a 100%)` }}>
          <div className="px-5 pt-4 pb-3">
            <div className="flex items-center space-x-1 mb-4">
              <Zap size={12} className="text-yellow-300" />
              <span className="text-yellow-300 text-xs font-semibold tracking-widest uppercase">Your move today</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative flex-shrink-0">
                <div className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg text-white"
                     style={{ backgroundColor: "rgba(255,255,255,0.2)" }}>
                  {hero.avatar}
                </div>
                <HealthRing score={hero.healthScore} size={60} strokeWidth={3} />
              </div>
              <div className="flex-1 min-w-0">
                <button onClick={() => onOpenDetail(hero)} className="text-left">
                  <p className="text-white font-bold text-xl leading-tight">{hero.name}</p>
                </button>
                <p className="text-blue-200 text-sm mt-0.5">
                  {hero.lastContact} · {hero.healthScore}% health
                </p>
              </div>
            </div>
          </div>

          <div className="px-5 pb-4 flex space-x-2">
            <button
              onClick={() => onOpenContact(hero)}
              className="flex-1 py-2.5 rounded-xl flex items-center justify-center space-x-1.5 font-semibold text-sm"
              style={{ backgroundColor: "rgba(255,255,255,0.95)", color: brand.primary }}>
              <MessageCircle size={15} />
              <span>Message</span>
            </button>
            <button
              onClick={() => { window.open(`tel:${hero.phoneNumber}`, "_self"); }}
              className="flex-1 py-2.5 rounded-xl flex items-center justify-center space-x-1.5 font-semibold text-sm"
              style={{ backgroundColor: "rgba(255,255,255,0.15)", color: "#fff" }}>
              <Phone size={15} />
              <span>Call</span>
            </button>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="px-4 mt-4">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search your tribe…"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm border-0 outline-none"
            style={{ backgroundColor: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}
          />
        </div>
      </div>

      {/* Roster */}
      <div className="mt-3 mx-4 bg-white rounded-2xl overflow-hidden shadow-sm">
        <div className="px-4 pt-3 pb-1 flex items-center justify-between">
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Your Tribe</span>
          <span className="text-xs text-gray-400">{relationships.length} contacts</span>
        </div>
        {roster.map((r, i) => (
          <button
            key={r.id}
            onClick={() => onOpenDetail(r)}
            className="w-full flex items-center px-4 py-3 hover:bg-gray-50 transition-colors text-left"
            style={{ borderTop: i > 0 ? "1px solid #f3f4f6" : "none" }}>
            <div className="relative mr-3 flex-shrink-0">
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold"
                   style={{ backgroundColor: statusColor(r.status) + "22", color: statusColor(r.status) }}>
                {r.avatar}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{r.name}</p>
              <p className="text-xs text-gray-400">{r.lastContact}</p>
            </div>
            <div className="flex items-center space-x-2 flex-shrink-0">
              <span className="text-sm font-bold" style={{ color: statusColor(r.status) }}>
                {r.healthScore}%
              </span>
              <ChevronRight size={14} className="text-gray-300" />
            </div>
          </button>
        ))}
      </div>

      {syncedMins !== null && (
        <p className="text-center text-xs text-gray-400 mt-4 pb-6">
          Synced {syncedMins < 1 ? "just now" : syncedMins < 60 ? `${syncedMins}m ago` : `${Math.round(syncedMins / 60)}h ago`}
        </p>
      )}
    </div>
  );
}


// ─── DESIGN B — Orbit ────────────────────────────────────────────────────────
export function DesignB({ relationships, onOpenDetail, onOpenContact, dataSource, lastSynced }) {
  const avgHealth = Math.round(
    relationships.reduce((s, r) => s + r.healthScore, 0) / Math.max(relationships.length, 1)
  );

  // Show up to 6 in the orbit grid (rest appear in the list below)
  const orbitSlots = relationships.slice(0, 6);
  const rest = relationships.slice(6);
  const needsAttention = relationships.filter(r => r.status !== "green")
    .sort((a, b) => a.healthScore - b.healthScore);

  const c = 2 * Math.PI * 52; // circumference for the big ring

  return (
    <div className="min-h-screen" style={{ backgroundColor: brand.dark, fontFamily: "system-ui,-apple-system,sans-serif" }}>

      {/* Header */}
      <div className="px-5 pt-12 pb-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Heart size={18} className="text-white" />
          <span className="text-white font-bold text-base">CatchUp</span>
        </div>
        <div className="relative w-16 h-16 flex items-center justify-center">
          <svg width={64} height={64} className="absolute inset-0">
            <circle cx={32} cy={32} r={26} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={5} />
            <circle
              cx={32} cy={32} r={26}
              fill="none" stroke={avgHealth >= 70 ? "#4ade80" : avgHealth >= 40 ? brand.yellow : brand.red}
              strokeWidth={5}
              strokeDasharray={`${(avgHealth / 100) * c} ${c}`}
              strokeLinecap="round"
              transform="rotate(-90 32 32)"
            />
          </svg>
          <span className="text-white font-bold text-sm z-10">{avgHealth}%</span>
        </div>
      </div>

      {/* Orbit grid */}
      <div className="px-5 mb-1">
        <p className="text-gray-400 text-xs uppercase tracking-widest mb-4 font-semibold">Your Tribe</p>
        <div className="grid grid-cols-3 gap-4">
          {orbitSlots.map(r => {
            const sz = 72;
            return (
              <button
                key={r.id}
                onClick={() => onOpenDetail(r)}
                className="flex flex-col items-center space-y-1.5">
                <div className="relative" style={{ width: sz, height: sz }}>
                  <HealthRing score={r.healthScore} size={sz} strokeWidth={4} />
                  <div className="absolute inset-2 rounded-full flex items-center justify-center font-bold text-base text-white"
                       style={{ backgroundColor: "rgba(255,255,255,0.12)" }}>
                    {r.avatar}
                  </div>
                </div>
                <p className="text-white text-xs font-medium truncate w-full text-center leading-tight">
                  {r.name.split(" ")[0]}
                </p>
                <p className="text-xs font-semibold" style={{ color: statusColor(r.status) }}>
                  {r.healthScore}%
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Needs attention */}
      {needsAttention.length > 0 && (
        <div className="mx-4 mt-5 rounded-2xl overflow-hidden"
             style={{ backgroundColor: "rgba(255,255,255,0.06)" }}>
          <div className="px-4 pt-3 pb-1">
            <p className="text-gray-400 text-xs uppercase tracking-widest font-semibold">Needs attention</p>
          </div>
          {needsAttention.map((r, i) => (
            <div key={r.id}
                 className="px-4 py-3 flex items-center justify-between"
                 style={{ borderTop: i > 0 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                     style={{ backgroundColor: statusColor(r.status) + "33", color: statusColor(r.status) }}>
                  {r.avatar}
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{r.name}</p>
                  <p className="text-gray-400 text-xs">{r.lastContact}</p>
                </div>
              </div>
              <button
                onClick={() => onOpenContact(r)}
                className="px-3 py-1.5 rounded-full text-xs font-semibold"
                style={{ backgroundColor: statusColor(r.status) + "22", color: statusColor(r.status) }}>
                Reach out
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Rest (if any beyond 6) */}
      {rest.length > 0 && (
        <div className="mx-4 mt-3 rounded-2xl overflow-hidden mb-6"
             style={{ backgroundColor: "rgba(255,255,255,0.06)" }}>
          {rest.map((r, i) => (
            <button key={r.id}
                    onClick={() => onOpenDetail(r)}
                    className="w-full px-4 py-3 flex items-center justify-between"
                    style={{ borderTop: i > 0 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
              <span className="text-white text-sm">{r.name}</span>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold" style={{ color: statusColor(r.status) }}>{r.healthScore}%</span>
                <ChevronRight size={14} className="text-gray-600" />
              </div>
            </button>
          ))}
        </div>
      )}
      <div className="h-6" />
    </div>
  );
}


// ─── DESIGN D — Focus (ADA candidate) ────────────────────────────────────────
// Hybrid: Pulse sections + Coach hero card + animated SVG rings on load.
// Every ring fills from 0 → target with a spring-like cubic-bezier, staggered
// by position so the page "comes alive" as it loads.

function AnimatedRing({ score, size = 44, strokeWidth = 3.5, delay = 0, dark = false }) {
  const [filled, setFilled] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setFilled(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  const r    = (size - strokeWidth * 2) / 2;
  const circ = 2 * Math.PI * r;
  const targetOffset = circ - (score / 100) * circ;
  const color = score >= 70 ? "#0969b8" : score >= 40 ? "#f2a900" : "#e4002c";
  const track = dark ? "rgba(255,255,255,0.18)" : "#ebebeb";

  return (
    <svg width={size} height={size} style={{ display: "block" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={strokeWidth} />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke={color} strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={filled ? targetOffset : circ}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{
          transition: filled ? "stroke-dashoffset 1.1s cubic-bezier(0.22, 1, 0.36, 1) 0ms" : "none",
        }}
      />
    </svg>
  );
}

export function DesignD({ relationships, onOpenDetail, onOpenContact, dataSource, lastSynced }) {
  const [search, setSearch]       = useState("");
  const [collapsed, setCollapsed] = useState({ good: true });

  const avgHealth = Math.round(
    relationships.reduce((s, r) => s + r.healthScore, 0) / Math.max(relationships.length, 1)
  );

  // Most-urgent individual = hero
  const hero = [...relationships]
    .sort((a, b) => a.healthScore - b.healthScore)
    .find(r => !r.isGroup) || relationships[0];

  const filtered = search
    ? relationships.filter(r => r.name.toLowerCase().includes(search.toLowerCase()))
    : relationships;

  const priority  = filtered.filter(r => r.status === "red"    && r.id !== hero?.id).sort((a, b) => a.healthScore - b.healthScore);
  const attention = filtered.filter(r => r.status === "yellow").sort((a, b) => a.healthScore - b.healthScore);
  const good      = filtered.filter(r => r.status === "green" ).sort((a, b) => b.healthScore - a.healthScore);

  const sections = [
    { key: "priority",  label: "Priority",  emoji: "🔴", color: "#e4002c", items: priority  },
    { key: "attention", label: "This week", emoji: "🟡", color: "#f2a900", items: attention },
    { key: "good",      label: "Healthy",   emoji: "🟢", color: "#0969b8", items: good      },
  ].filter(s => s.items.length > 0);

  const syncedMins = lastSynced
    ? Math.round((Date.now() - new Date(lastSynced).getTime()) / 60000)
    : null;

  const sColor = s => s === "red" ? "#e4002c" : s === "yellow" ? "#f2a900" : "#0969b8";

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "#f7f8fa", fontFamily: "system-ui,-apple-system,BlinkMacSystemFont,'SF Pro Text',sans-serif" }}
    >

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div
        style={{
          background: "linear-gradient(135deg, #007AFF 0%, #0055CC 100%)",
          paddingTop: "max(1.5rem, env(safe-area-inset-top))",
        }}
        className="px-5 pb-5"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Heart size={20} style={{ color: "rgba(255,255,255,0.9)" }} />
            <span
              className="font-bold text-xl"
              style={{ color: "#ffffff", letterSpacing: "-0.02em" }}
            >
              CatchUp
            </span>
          </div>

          {/* Tribe health ring + number */}
          <div className="flex items-center space-x-2">
            <div style={{ width: 40, height: 40 }}>
              <AnimatedRing score={avgHealth} size={40} strokeWidth={3.5} delay={700} />
            </div>
            <div className="text-right leading-none">
              <p
                className="font-black text-base"
                style={{ color: "#ffffff", letterSpacing: "-0.02em" }}
              >
                {avgHealth}%
              </p>
              <p className="mt-0.5" style={{ color: "rgba(255,255,255,0.65)", fontSize: "10px" }}>tribe health</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Hero card (fix 1: breathing room, fix 2: empty state, fix 5: gradient) ── */}
      <div className="mx-4 mt-4">
        {hero && (priority.length > 0 || attention.length > 0 || hero.status !== "green") ? (
          /* Urgent contact — "Your move today" */
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              /* fix 5: warmer dark blue — hint of indigo in the shadow end */
              background: "linear-gradient(150deg, #1473e6 0%, #0f1d3d 100%)",
              boxShadow: "0 10px 36px rgba(14,115,230,0.30)",
            }}
          >
            <div className="px-5 pt-5 flex items-center space-x-1.5">
              <Zap size={11} style={{ color: "#fbbf24" }} />
              <span style={{ color: "#fbbf24", fontSize: "11px", fontWeight: 700, letterSpacing: "0.09em" }}>
                YOUR MOVE TODAY
              </span>
            </div>

            {/* fix 1: more breathing room — pt-4 pb-6, space-x-5 */}
            <div className="px-5 pt-4 pb-6">
              <div className="flex items-center space-x-5">

                {/* Large animated ring + avatar */}
                <div className="relative flex-shrink-0" style={{ width: 80, height: 80 }}>
                  <div style={{ position: "absolute", inset: 0 }}>
                    <AnimatedRing score={hero.healthScore} size={80} strokeWidth={5} delay={200} dark={true} />
                  </div>
                  <div
                    className="absolute rounded-full flex items-center justify-center font-bold text-white"
                    style={{
                      inset: "7px",
                      backgroundColor: "rgba(255,255,255,0.14)",
                      fontSize: "20px",
                    }}
                  >
                    {hero.avatar}
                  </div>
                </div>

                {/* Name + meta + buttons */}
                <div className="flex-1 min-w-0">
                  <button onClick={() => onOpenDetail(hero)} className="text-left block">
                    <p
                      className="font-bold leading-tight"
                      style={{ color: "#fff", fontSize: "20px", letterSpacing: "-0.01em" }}
                    >
                      {hero.name}
                    </p>
                  </button>
                  <p className="mt-1 text-sm" style={{ color: "rgba(255,255,255,0.55)" }}>
                    {hero.lastContact} &middot; {hero.healthScore}%
                  </p>

                  <div className="flex space-x-2 mt-3">
                    <button
                      onClick={() => onOpenContact(hero)}
                      className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold"
                      style={{ backgroundColor: "#fff", color: "#1473e6" }}
                    >
                      <MessageCircle size={13} />
                      <span>Message</span>
                    </button>
                    <button
                      onClick={() => window.open(`tel:${hero.phoneNumber}`, "_self")}
                      className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold"
                      style={{ backgroundColor: "rgba(255,255,255,0.14)", color: "#fff" }}
                    >
                      <Phone size={13} />
                      <span>Call</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* fix 2: empty / all-healthy state — a delightful celebratory card */
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: "linear-gradient(150deg, #0969b8 0%, #064a8a 100%)",
              boxShadow: "0 8px 28px rgba(9,105,184,0.22)",
            }}
          >
            <div className="px-6 py-5 flex items-center space-x-5">
              <div className="relative flex-shrink-0" style={{ width: 64, height: 64 }}>
                <AnimatedRing score={avgHealth} size={64} strokeWidth={4.5} delay={200} dark={true} />
                <div
                  className="absolute inset-0 flex items-center justify-center font-black"
                  style={{ color: "#fff", fontSize: "15px", letterSpacing: "-0.02em" }}
                >
                  {avgHealth}%
                </div>
              </div>
              <div>
                <p className="font-bold text-white text-lg leading-tight" style={{ letterSpacing: "-0.01em" }}>
                  You're on top of it
                </p>
                <p className="mt-1 text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>
                  All {relationships.length} relationships are healthy
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Search ──────────────────────────────────────────────────────────── */}
      <div className="px-4 mt-4">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#9ca3af" }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search your tribe…"
            className="w-full rounded-xl text-sm outline-none border-0"
            style={{
              padding: "0.55rem 2rem",
              backgroundColor: "#fff",
              boxShadow: "0 1px 3px rgba(0,0,0,0.07)",
            }}
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X size={14} style={{ color: "#9ca3af" }} />
            </button>
          )}
        </div>
      </div>

      {/* ── Sections ────────────────────────────────────────────────────────── */}
      <div className="px-4 mt-4 space-y-3" style={{ paddingBottom: "7rem" }}>
        {sections.map(section => {
          const isCollapsed  = collapsed[section.key];
          const visibleItems = isCollapsed ? section.items.slice(0, 3) : section.items;

          return (
            <div
              key={section.key}
              className="bg-white rounded-2xl overflow-hidden"
              style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}
            >
              {/* Section header */}
              <button
                onClick={() => setCollapsed(c => ({ ...c, [section.key]: !c[section.key] }))}
                className="w-full px-4 py-3 flex items-center justify-between"
              >
                <div className="flex items-center space-x-2">
                  <span style={{ fontSize: "13px", lineHeight: 1 }}>{section.emoji}</span>
                  <span className="text-sm font-semibold" style={{ color: "#1a1a2e" }}>{section.label}</span>
                  <span
                    className="text-xs font-semibold px-1.5 py-0.5 rounded-full"
                    style={{ backgroundColor: section.color + "15", color: section.color }}
                  >
                    {section.items.length}
                  </span>
                </div>
                <ChevronRight
                  size={15}
                  style={{
                    color: "#d1d5db",
                    transform: isCollapsed ? "rotate(0deg)" : "rotate(90deg)",
                    transition: "transform 0.22s cubic-bezier(0.4,0,0.2,1)",
                  }}
                />
              </button>

              {/* Rows */}
              {visibleItems.map((r, i) => (
                <div
                  key={r.id}
                  className="flex items-center px-4 py-3"
                  style={{ borderTop: "1px solid #f3f4f6" }}
                >
                  {/* Animated mini ring */}
                  <div className="relative mr-3 flex-shrink-0" style={{ width: 44, height: 44 }}>
                    <AnimatedRing score={r.healthScore} size={44} strokeWidth={3} delay={350 + i * 65} />
                    <div
                      className="absolute rounded-full flex items-center justify-center font-bold"
                      style={{
                        inset: "5px",
                        backgroundColor: sColor(r.status) + "18",
                        color: sColor(r.status),
                        fontSize: "11px",
                      }}
                    >
                      {r.avatar}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0 cursor-pointer" onClick={() => onOpenDetail(r)}>
                    <p className="text-sm font-semibold truncate" style={{ color: "#1a1a2e" }}>{r.name}</p>
                    <p className="text-xs mt-0.5 truncate" style={{ color: "#9ca3af" }}>
                      {r.lastContact}{r.nextSuggested ? ` · ${r.nextSuggested}` : ""}
                    </p>
                  </div>

                  {/* fix 4: "Reach out" pill — more visual weight + chevron */}
                  <div className="ml-3 flex-shrink-0">
                    {section.key !== "good" ? (
                      <button
                        onClick={() => onOpenContact(r)}
                        className="flex items-center space-x-1 text-xs font-bold px-3.5 py-2 rounded-full"
                        style={{
                          backgroundColor: section.color + "18",
                          color: section.color,
                          border: `1px solid ${section.color}30`,
                        }}
                      >
                        <span>{r.isGroup ? "Message" : "Reach out"}</span>
                        <ChevronRight size={11} style={{ marginLeft: 1 }} />
                      </button>
                    ) : (
                      <span className="text-sm font-bold" style={{ color: "#0969b8" }}>{r.healthScore}%</span>
                    )}
                  </div>
                </div>
              ))}

              {/* Show more */}
              {isCollapsed && section.items.length > 3 && (
                <button
                  onClick={() => setCollapsed(c => ({ ...c, [section.key]: false }))}
                  className="w-full py-2.5 text-xs font-medium text-center"
                  style={{ borderTop: "1px solid #f3f4f6", color: "#0969b8" }}
                >
                  Show {section.items.length - 3} more
                </button>
              )}
            </div>
          );
        })}

        {syncedMins !== null && (
          <p className="text-center text-xs py-1" style={{ color: "#d1d5db" }}>
            {syncedMins < 1 ? "Live" : syncedMins < 60 ? `Synced ${syncedMins}m ago` : `Synced ${Math.round(syncedMins / 60)}h ago`}
          </p>
        )}
      </div>
    </div>
  );
}


// ─── DESIGN C — Pulse ────────────────────────────────────────────────────────
export function DesignC({ relationships, onOpenDetail, onOpenContact, dataSource, lastSynced }) {
  const [search, setSearch] = useState("");

  const avgHealth = Math.round(
    relationships.reduce((s, r) => s + r.healthScore, 0) / Math.max(relationships.length, 1)
  );

  const filtered = search
    ? relationships.filter(r => r.name.toLowerCase().includes(search.toLowerCase()))
    : relationships;

  const overdue    = filtered.filter(r => r.status === "red").sort((a, b) => a.healthScore - b.healthScore);
  const attention  = filtered.filter(r => r.status === "yellow").sort((a, b) => a.healthScore - b.healthScore);
  const good       = filtered.filter(r => r.status === "green").sort((a, b) => b.healthScore - a.healthScore);

  const sections = [
    { key: "overdue",   label: "Reach out now", color: brand.red,    icon: "🔴", items: overdue },
    { key: "attention", label: "This week",      color: brand.yellow, icon: "🟡", items: attention },
    { key: "good",      label: "In good shape",  color: brand.primary, icon: "🟢", items: good },
  ].filter(s => s.items.length > 0);

  const [collapsed, setCollapsed] = useState({ good: true });

  const syncedMins = lastSynced
    ? Math.round((Date.now() - new Date(lastSynced).getTime()) / 60000)
    : null;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f7f8fa", fontFamily: "system-ui,-apple-system,sans-serif" }}>

      {/* Header */}
      <div className="px-5 pb-5"
           style={{ backgroundColor: brand.white, paddingTop: "max(1.5rem, env(safe-area-inset-top))",
                    boxShadow: "0 1px 0 #e5e7eb" }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Heart size={20} style={{ color: brand.primary }} />
            <span className="font-bold text-lg" style={{ color: brand.dark }}>CatchUp</span>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black" style={{ color: avgHealth >= 70 ? brand.primary : avgHealth >= 40 ? brand.yellow : brand.red }}>
              {avgHealth}%
            </span>
          </div>
        </div>

        {/* Health bar */}
        <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: "#e5e7eb" }}>
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${avgHealth}%`,
              background: `linear-gradient(90deg, ${brand.primary}, ${avgHealth >= 70 ? "#4ade80" : avgHealth >= 40 ? brand.yellow : brand.red})`,
            }}
          />
        </div>
        <div className="flex justify-between mt-1.5">
          <span className="text-xs text-gray-400">
            {good.length} healthy · {attention.length} attention · {overdue.length} priority
          </span>
          {syncedMins !== null && (
            <span className="text-xs text-gray-400">
              {syncedMins < 1 ? "Live" : syncedMins < 60 ? `${syncedMins}m ago` : `${Math.round(syncedMins/60)}h ago`}
            </span>
          )}
        </div>

        {/* Search */}
        <div className="relative mt-3">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search…"
            className="w-full pl-8 pr-8 py-2 rounded-xl text-sm border outline-none"
            style={{ borderColor: "#e5e7eb", backgroundColor: "#f7f8fa" }}
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X size={14} className="text-gray-400" />
            </button>
          )}
        </div>
      </div>

      {/* Sections */}
      <div className="px-4 py-4 space-y-3">
        {sections.map(section => {
          const isCollapsed = collapsed[section.key];
          const visibleItems = isCollapsed ? section.items.slice(0, 2) : section.items;
          return (
            <div key={section.key} className="bg-white rounded-2xl overflow-hidden shadow-sm">
              {/* Section header */}
              <button
                onClick={() => setCollapsed(c => ({ ...c, [section.key]: !c[section.key] }))}
                className="w-full px-4 py-3 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-base leading-none">{section.icon}</span>
                  <span className="text-sm font-semibold text-gray-800">{section.label}</span>
                  <span className="text-xs font-medium px-1.5 py-0.5 rounded-full"
                        style={{ backgroundColor: section.color + "18", color: section.color }}>
                    {section.items.length}
                  </span>
                </div>
                <ChevronRight
                  size={16} className="text-gray-300 transition-transform"
                  style={{ transform: isCollapsed ? "rotate(0deg)" : "rotate(90deg)" }}
                />
              </button>

              {/* Rows */}
              {visibleItems.map((r, i) => (
                <div
                  key={r.id}
                  className="flex items-center px-4 py-3"
                  style={{ borderTop: "1px solid #f3f4f6" }}>
                  {/* Mini ring */}
                  <div className="relative mr-3 flex-shrink-0" style={{ width: 40, height: 40 }}>
                    <HealthRingLight score={r.healthScore} size={40} strokeWidth={3} />
                    <div className="absolute inset-1.5 rounded-full flex items-center justify-center text-xs font-bold"
                         style={{ backgroundColor: statusColor(r.status) + "18", color: statusColor(r.status) }}>
                      {r.avatar}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0" onClick={() => onOpenDetail(r)}>
                    <p className="text-sm font-semibold text-gray-900 truncate">{r.name}</p>
                    <p className="text-xs text-gray-400">{r.lastContact} · {r.nextSuggested}</p>
                  </div>

                  <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
                    {section.key !== "good" && (
                      <button
                        onClick={() => onOpenContact(r)}
                        className="px-3 py-1.5 rounded-full text-xs font-semibold"
                        style={{ backgroundColor: section.color + "15", color: section.color }}>
                        {r.isGroup ? "Message" : "Reach out"}
                      </button>
                    )}
                    {section.key === "good" && (
                      <span className="text-sm font-bold" style={{ color: section.color }}>
                        {r.healthScore}%
                      </span>
                    )}
                  </div>
                </div>
              ))}

              {/* Show more */}
              {isCollapsed && section.items.length > 2 && (
                <button
                  onClick={() => setCollapsed(c => ({ ...c, [section.key]: false }))}
                  className="w-full py-2.5 text-xs font-medium text-center"
                  style={{ borderTop: "1px solid #f3f4f6", color: brand.primary }}>
                  Show {section.items.length - 2} more
                </button>
              )}
            </div>
          );
        })}
      </div>
      <div className="h-6" />
    </div>
  );
}

// ─── DESIGN E — Native (iOS Contacts reimagined) ─────────────────────────────
// Looks and feels like iPhone Contacts.app with relationship intelligence
// woven into the avatar layer. Acquisition-ready: could ship as iOS 21 Contacts.

const ios = {
  blue:      "#007AFF",
  green:     "#34C759",
  orange:    "#FF9F0A",
  red:       "#FF453A",
  label:     "#000000",
  label2:    "rgba(60,60,67,0.6)",
  label3:    "rgba(60,60,67,0.3)",
  fill:      "#F2F2F7",
  fill2:     "#E5E5EA",
  separator: "rgba(60,60,67,0.29)",
  card:      "#FFFFFF",
  tint:      "#007AFF",
};

function iosHealthColor(score) {
  return score >= 70 ? ios.green : score >= 40 ? ios.orange : ios.red;
}

// The key innovation: health ring IS the avatar ring — not bolted on
function NativeAvatar({ contact, size = 44, strokeWidth = 2.5, delay = 0 }) {
  const [filled, setFilled] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setFilled(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  const score  = contact.healthScore || 0;
  const inner  = size - strokeWidth * 2 - 4;
  const r      = (size - strokeWidth * 2) / 2;
  const circ   = 2 * Math.PI * r;
  const target = circ - (score / 100) * circ;
  const color  = iosHealthColor(score);

  const avatarColors = [
    ["#FF6B6B","#C0392B"],["#4ECDC4","#16A085"],["#45B7D1","#2980B9"],
    ["#96CEB4","#27AE60"],["#DDA0DD","#8E44AD"],["#F7DC6F","#D4AC0D"],
    ["#F0A500","#E67E22"],["#85C1E9","#1A5276"],
  ];
  const idx = contact.name ? contact.name.charCodeAt(0) % avatarColors.length : 0;
  const [bg1, bg2] = avatarColors[idx];
  const initials = contact.name
    ? contact.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ position: "absolute", top: 0, left: 0 }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none"
          stroke={ios.fill2} strokeWidth={strokeWidth} />
        <circle cx={size/2} cy={size/2} r={r} fill="none"
          stroke={color} strokeWidth={strokeWidth}
          strokeLinecap="round" strokeDasharray={circ}
          strokeDashoffset={filled ? target : circ}
          transform={`rotate(-90 ${size/2} ${size/2})`}
          style={{ transition: filled ? "stroke-dashoffset 1.1s cubic-bezier(0.22,1,0.36,1)" : "none" }}
        />
      </svg>
      <div style={{
        position: "absolute",
        top: strokeWidth + 2,
        left: strokeWidth + 2,
        width: inner,
        height: inner,
        borderRadius: "50%",
        background: `linear-gradient(135deg, ${bg1}, ${bg2})`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: inner * 0.36,
        fontWeight: "600",
        color: "#fff",
        letterSpacing: "-0.3px",
        fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
      }}>
        {initials}
      </div>
    </div>
  );
}

function NativeAvatarLarge({ contact, size = 64, strokeWidth = 3, delay = 0 }) {
  const [filled, setFilled] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setFilled(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  const score  = contact.healthScore || 0;
  const inner  = size - strokeWidth * 2 - 4;
  const r      = (size - strokeWidth * 2) / 2;
  const circ   = 2 * Math.PI * r;
  const target = circ - (score / 100) * circ;
  const color  = iosHealthColor(score);

  const avatarColors = [
    ["#FF6B6B","#C0392B"],["#4ECDC4","#16A085"],["#45B7D1","#2980B9"],
    ["#96CEB4","#27AE60"],["#DDA0DD","#8E44AD"],["#F7DC6F","#D4AC0D"],
    ["#F0A500","#E67E22"],["#85C1E9","#1A5276"],
  ];
  const idx = contact.name ? contact.name.charCodeAt(0) % avatarColors.length : 0;
  const [bg1, bg2] = avatarColors[idx];
  const initials = contact.name
    ? contact.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ position: "absolute", top: 0, left: 0 }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={ios.fill2} strokeWidth={strokeWidth} />
        <circle cx={size/2} cy={size/2} r={r} fill="none"
          stroke={color} strokeWidth={strokeWidth}
          strokeLinecap="round" strokeDasharray={circ}
          strokeDashoffset={filled ? target : circ}
          transform={`rotate(-90 ${size/2} ${size/2})`}
          style={{ transition: filled ? "stroke-dashoffset 1.1s cubic-bezier(0.22,1,0.36,1)" : "none" }}
        />
      </svg>
      <div style={{
        position: "absolute",
        top: strokeWidth + 2,
        left: strokeWidth + 2,
        width: inner,
        height: inner,
        borderRadius: "50%",
        background: `linear-gradient(135deg, ${bg1}, ${bg2})`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: inner * 0.34,
        fontWeight: "600",
        color: "#fff",
        letterSpacing: "-0.4px",
        fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif",
      }}>
        {initials}
      </div>
    </div>
  );
}

function daysSinceContact(contact) {
  const raw = contact.lastContactDate || contact.lastContact;
  if (!raw) return null;
  const ms = Date.now() - new Date(raw).getTime();
  if (isNaN(ms) || ms < 0) return null;
  return Math.floor(ms / 86400000);
}

function daysLabel(days) {
  if (days === null) return "never contacted";
  if (days === 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

function urgencyLabel(contact) {
  const days = daysSinceContact(contact);
  const score = contact.healthScore || 0;
  if (score < 30 || (days !== null && days > 60)) return { text: "Overdue", color: ios.red };
  if (score < 60 || (days !== null && days > 30)) return { text: "Check in", color: ios.orange };
  return null;
}

const nativeSf = "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'SF Pro Display', system-ui, sans-serif";

function InsightsRing({ score, size = 72, strokeWidth = 5 }) {
  const [filled, setFilled] = useState(false);
  useEffect(() => { const t = setTimeout(() => setFilled(true), 120); return () => clearTimeout(t); }, []);
  const r = (size - strokeWidth * 2) / 2;
  const circ = 2 * Math.PI * r;
  const color = score >= 70 ? ios.green : score >= 40 ? ios.orange : ios.red;
  const offset = circ - (score / 100) * circ;
  return (
    <svg width={size} height={size}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={ios.fill2} strokeWidth={strokeWidth}/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={strokeWidth}
        strokeLinecap="round" strokeDasharray={circ}
        strokeDashoffset={filled ? offset : circ}
        transform={`rotate(-90 ${size/2} ${size/2})`}
        style={{ transition: filled ? "stroke-dashoffset 1.1s cubic-bezier(0.22,1,0.36,1)" : "none" }}
      />
      <text x={size/2} y={size/2 + 6} textAnchor="middle"
        style={{ fontSize: 18, fontWeight: "700", fill: ios.label, fontFamily: nativeSf }}>
        {score}
      </text>
    </svg>
  );
}

export function DesignE({ relationships, onOpenDetail, onOpenContact, dataSource, lastSynced }) {
  const [activeTab, setActiveTab] = useState("contacts");
  const [searchQuery, setSearchQuery] = useState("");

  const individuals = relationships.filter(r => !r.isGroup);

  const favorites = [...individuals]
    .sort((a, b) => b.healthScore - a.healthScore)
    .slice(0, 6);

  // "Your move" = most overdue person who isn't already at 100% and wasn't contacted today
  const yourMove = [...individuals]
    .filter(r => r.healthScore < 100 && daysSinceContact(r) !== 0)
    .sort((a, b) => a.healthScore - b.healthScore)[0] || individuals[0] || null;

  const filtered = individuals.filter(r =>
    !searchQuery || r.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const alphaSections = {};
  filtered.forEach(r => {
    const letter = r.name ? r.name[0].toUpperCase() : "#";
    if (!alphaSections[letter]) alphaSections[letter] = [];
    alphaSections[letter].push(r);
  });
  const letters = Object.keys(alphaSections).sort();

  const priority = filtered
    .filter(r => r.healthScore < 60)
    .sort((a, b) => a.healthScore - b.healthScore)
    .slice(0, 3);

  const avgHealth = Math.round(
    individuals.reduce((s, r) => s + r.healthScore, 0) / Math.max(individuals.length, 1)
  );

  const InsightsTab = () => (
    <div style={{ padding: "0 0 100px", background: ios.fill }}>
      <div style={{ margin: "16px 16px 0", background: ios.card, borderRadius: 16, overflow: "hidden" }}>
        <div style={{ padding: "16px 16px 4px", borderBottom: `1px solid ${ios.separator}` }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: ios.label2, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 12 }}>
            Relationship Health
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, paddingBottom: 16 }}>
            <div style={{ flexShrink: 0 }}>
              <InsightsRing score={avgHealth} />
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: "700", color: ios.label, letterSpacing: "-0.4px" }}>
                {avgHealth >= 70 ? "Strong" : avgHealth >= 40 ? "Drifting" : "Needs work"}
              </div>
              <div style={{ fontSize: 14, color: ios.label2, marginTop: 2 }}>
                across {individuals.length} relationships
              </div>
            </div>
          </div>
        </div>
        {[
          { label: "Healthy",  count: individuals.filter(r => r.healthScore >= 70).length, color: ios.green },
          { label: "Drifting", count: individuals.filter(r => r.healthScore >= 40 && r.healthScore < 70).length, color: ios.orange },
          { label: "Overdue",  count: individuals.filter(r => r.healthScore < 40).length, color: ios.red },
        ].map((row, i, arr) => (
          <div key={row.label} style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "13px 16px",
            borderBottom: i < arr.length - 1 ? `1px solid ${ios.separator}` : "none",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: row.color }} />
              <span style={{ fontSize: 16, color: ios.label }}>{row.label}</span>
            </div>
            <span style={{ fontSize: 16, fontWeight: "600", color: ios.label2 }}>{row.count}</span>
          </div>
        ))}
      </div>

      <div style={{ margin: "20px 16px 0" }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: ios.label2, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8, paddingLeft: 4 }}>
          Action Items
        </div>
        <div style={{ background: ios.card, borderRadius: 16, overflow: "hidden" }}>
          {priority.map((contact, i) => {
            const days = daysSinceContact(contact);
            const urgency = urgencyLabel(contact);
            return (
              <div key={contact.id} style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "12px 16px",
                borderBottom: i < priority.length - 1 ? `1px solid ${ios.separator}` : "none",
                cursor: "pointer",
              }} onClick={() => onOpenContact && onOpenContact(contact)}>
                <NativeAvatar contact={contact} size={44} delay={200 + i * 80} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 16, color: ios.label }}>{contact.name}</div>
                  <div style={{ fontSize: 13, color: urgency ? urgency.color : ios.label2, marginTop: 1 }}>
                    {urgency ? urgency.text + " · " : ""}{daysLabel(days)}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: ios.fill, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <MessageCircle size={16} color={ios.blue} />
                  </div>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: ios.fill, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Phone size={16} color={ios.blue} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ margin: "20px 16px 0" }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: ios.label2, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8, paddingLeft: 4 }}>
          This Month
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {[
            { label: "Reached out", value: individuals.filter(r => { const d = daysSinceContact(r); return d !== null && d < 30; }).length, unit: "people" },
            { label: "Avg. health", value: avgHealth, unit: "/ 100" },
          ].map(stat => (
            <div key={stat.label} style={{ background: ios.card, borderRadius: 16, padding: "16px" }}>
              <div style={{ fontSize: 32, fontWeight: "700", color: ios.label, letterSpacing: "-1px" }}>{stat.value}</div>
              <div style={{ fontSize: 13, color: ios.label2, marginTop: 2 }}>{stat.unit}</div>
              <div style={{ fontSize: 12, fontWeight: "500", color: ios.label3, marginTop: 6, textTransform: "uppercase", letterSpacing: "0.3px" }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const FavoritesTab = () => (
    <div style={{ padding: "0 0 100px", background: ios.fill }}>
      <div style={{ padding: "8px 16px 0" }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: ios.label2, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 12 }}>
          Favorites
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {favorites.map((contact, i) => {
            const urgency = urgencyLabel(contact);
            return (
              <div key={contact.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, cursor: "pointer" }}
                onClick={() => onOpenContact && onOpenContact(contact)}>
                <NativeAvatarLarge contact={contact} size={64} delay={100 + i * 60} />
                <div style={{ fontSize: 12, color: ios.label, textAlign: "center", fontWeight: "400", maxWidth: 72, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {contact.name?.split(" ")[0]}
                </div>
                {urgency && (
                  <div style={{ fontSize: 10, fontWeight: "600", color: urgency.color, textTransform: "uppercase", letterSpacing: "0.3px", marginTop: -4 }}>
                    {urgency.text}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ margin: "24px 16px 0" }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: ios.label2, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8, paddingLeft: 4 }}>
          Suggested
        </div>
        <div style={{ background: ios.card, borderRadius: 16, overflow: "hidden" }}>
          {individuals.filter(r => !favorites.find(f => f.id === r.id)).slice(0, 4).map((contact, i, arr) => {
            const days = daysSinceContact(contact);
            return (
              <div key={contact.id} style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "10px 16px",
                borderBottom: i < arr.length - 1 ? `1px solid ${ios.separator}` : "none",
                cursor: "pointer",
              }} onClick={() => onOpenContact && onOpenContact(contact)}>
                <NativeAvatar contact={contact} size={44} delay={300 + i * 60} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 16, color: ios.label }}>{contact.name}</div>
                  <div style={{ fontSize: 13, color: ios.label2 }}>{daysLabel(days)}</div>
                </div>
                <Phone size={20} color={ios.blue} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const ContactsTab = () => (
    <div style={{ display: "flex", position: "relative" }}>
      <div style={{ flex: 1, paddingBottom: 100 }}>
        {!searchQuery && yourMove && (
          <div style={{ margin: "8px 16px 0" }}>
            <div style={{
              background: ios.card, borderRadius: 16, padding: "14px 16px",
              display: "flex", alignItems: "center", gap: 12,
              boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
              cursor: "pointer",
            }} onClick={() => onOpenContact && onOpenContact(yourMove)}>
              <div style={{
                width: 36, height: 36, borderRadius: "50%",
                background: "linear-gradient(135deg, #007AFF, #5AC8FA)",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <Zap size={18} color="#fff" fill="#fff" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: "600", color: ios.blue, textTransform: "uppercase", letterSpacing: "0.4px" }}>
                  Your move today
                </div>
                <div style={{ fontSize: 15, color: ios.label, fontWeight: "500", marginTop: 1 }}>
                  Reach out to {yourMove.name?.split(" ")[0]}
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(0,122,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <MessageCircle size={16} color={ios.blue} />
                </div>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(52,199,89,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Phone size={16} color={ios.green} />
                </div>
              </div>
            </div>
          </div>
        )}

        {!searchQuery && priority.length > 0 && (
          <div style={{ marginTop: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: ios.label2, textTransform: "uppercase", letterSpacing: "0.5px", padding: "0 16px 6px" }}>
              Needs attention
            </div>
            <div style={{ background: ios.card }}>
              {priority.map((contact, i) => {
                const days = daysSinceContact(contact);
                const urgency = urgencyLabel(contact);
                return (
                  <div key={contact.id} style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "10px 16px",
                    borderBottom: `1px solid ${ios.separator}`,
                    cursor: "pointer",
                  }} onClick={() => onOpenContact && onOpenContact(contact)}>
                    <NativeAvatar contact={contact} size={44} delay={100 + i * 65} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 16, color: ios.label }}>{contact.name}</div>
                      <div style={{ fontSize: 13, color: urgency ? urgency.color : ios.label2, marginTop: 1 }}>
                        {urgency ? urgency.text + " · " : ""}{daysLabel(days)}
                      </div>
                    </div>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(0,122,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Phone size={15} color={ios.blue} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {letters.map(letter => (
          <div key={letter}>
            <div style={{ padding: "6px 16px 2px", background: ios.fill, fontSize: 14, fontWeight: "600", color: ios.label, marginTop: 8 }}>
              {letter}
            </div>
            <div style={{ background: ios.card }}>
              {alphaSections[letter].map((contact, i) => {
                const days = daysSinceContact(contact);
                const urgency = urgencyLabel(contact);
                return (
                  <div key={contact.id} style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "8px 16px",
                    borderBottom: i < alphaSections[letter].length - 1 ? `1px solid ${ios.separator}` : "none",
                    cursor: "pointer",
                  }} onClick={() => onOpenContact && onOpenContact(contact)}>
                    <NativeAvatar contact={contact} size={40} delay={0} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 16, color: ios.label }}>{contact.name}</div>
                      {urgency && (
                        <div style={{ fontSize: 12, color: urgency.color, marginTop: 1, fontWeight: "500" }}>
                          {urgency.text} · {daysLabel(days)}
                        </div>
                      )}
                    </div>
                    <Phone size={20} color={ios.blue} style={{ flexShrink: 0, opacity: 0.8 }} />
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 20px", color: ios.label2 }}>
            <div style={{ fontSize: 17 }}>No results for "{searchQuery}"</div>
          </div>
        )}
      </div>

      {!searchQuery && (
        <div style={{
          position: "fixed", right: 4, top: "50%", transform: "translateY(-50%)",
          display: "flex", flexDirection: "column", gap: 1, zIndex: 10,
        }}>
          {letters.map(l => (
            <div key={l} style={{ fontSize: 10, fontWeight: "600", color: ios.blue, lineHeight: 1.5, textAlign: "center", width: 16, cursor: "pointer" }}>
              {l}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const overdueCount = individuals.filter(r => r.healthScore < 40).length;

  return (
    <div style={{
      minHeight: "100svh",
      background: ios.fill,
      fontFamily: nativeSf,
      display: "flex",
      flexDirection: "column",
      WebkitFontSmoothing: "antialiased",
      MozOsxFontSmoothing: "grayscale",
    }}>

      {/* Status bar */}
      <div style={{
        paddingTop: "max(14px, env(safe-area-inset-top))",
        padding: "max(14px, env(safe-area-inset-top)) 20px 0",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: ios.fill,
      }}>
        <span style={{ fontSize: 15, fontWeight: "600", color: ios.label }}>9:41</span>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <svg width={17} height={12} viewBox="0 0 17 12">
            {[0,1,2,3].map(i => (
              <rect key={i} x={i*4.5} y={12-(i+1)*3} width={3} height={(i+1)*3} rx={0.5}
                fill={i < 3 ? ios.label : ios.label3} />
            ))}
          </svg>
          <svg width={16} height={12} viewBox="0 0 16 12">
            <path d="M8 9.5 L9.2 8.3 A2 2 0 0 0 6.8 8.3 Z" fill={ios.label}/>
            <path d="M8 7 L11 4 A5 5 0 0 0 5 4 Z" fill={ios.label} opacity="0.5"/>
            <path d="M8 4.5 L13.5 -1 A8 8 0 0 0 2.5 -1 Z" fill={ios.label} opacity="0.25"/>
          </svg>
          <svg width={25} height={12} viewBox="0 0 25 12">
            <rect x={0} y={1} width={21} height={10} rx={2.5} stroke={ios.label} strokeWidth={1} fill="none"/>
            <rect x={21.5} y={3.5} width={2} height={5} rx={1} fill={ios.label}/>
            <rect x={1.5} y={2.5} width={15} height={7} rx={1.5} fill={ios.green}/>
          </svg>
        </div>
      </div>

      {/* Navigation bar */}
      <div style={{ padding: "8px 16px 0", background: ios.fill }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 8 }}>
          <div style={{ fontSize: 34, fontWeight: "700", color: ios.label, letterSpacing: "-0.4px", lineHeight: 1 }}>
            {activeTab === "contacts" ? "Contacts" :
             activeTab === "favorites" ? "Favorites" :
             activeTab === "insights" ? "Insights" : "Recents"}
          </div>
          {activeTab === "contacts" && (
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: ios.fill2, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", marginBottom: 4 }}>
              <Plus size={18} color={ios.blue} />
            </div>
          )}
        </div>

        {(activeTab === "contacts" || activeTab === "favorites") && (
          <div style={{ background: ios.fill2, borderRadius: 10, padding: "7px 10px", display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
            <Search size={16} color={ios.label2} />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ flex: 1, background: "transparent", border: "none", outline: "none", fontSize: 16, color: ios.label, fontFamily: nativeSf }}
            />
            {searchQuery && (
              <X size={14} color={ios.label3} style={{ cursor: "pointer" }} onClick={() => setSearchQuery("")} />
            )}
          </div>
        )}
      </div>

      {/* Tab content */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {activeTab === "contacts"  && <ContactsTab />}
        {activeTab === "favorites" && <FavoritesTab />}
        {activeTab === "insights"  && <InsightsTab />}
        {activeTab === "recents" && (
          <div style={{ padding: "40px 16px", textAlign: "center", color: ios.label2 }}>
            <Clock size={40} color={ios.label3} style={{ margin: "0 auto 12px" }} />
            <div style={{ fontSize: 17, fontWeight: "500" }}>Recents</div>
            <div style={{ fontSize: 14, marginTop: 6 }}>Synced from your call history.</div>
          </div>
        )}
      </div>

      {/* Tab bar */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0,
        background: "rgba(242,242,247,0.9)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderTop: `0.5px solid ${ios.separator}`,
        paddingBottom: "max(20px, env(safe-area-inset-bottom))",
        paddingTop: 8,
        display: "flex",
        justifyContent: "space-around",
        zIndex: 50,
      }}>
        {[
          { key: "favorites", IconEl: Heart,          label: "Favorites" },
          { key: "recents",   IconEl: Clock,          label: "Recents" },
          { key: "contacts",  IconEl: Phone,          label: "Contacts" },
          { key: "insights",  IconEl: Zap,            label: "Insights", badge: overdueCount > 0 },
        ].map(({ key, IconEl, label, badge }) => {
          const active = activeTab === key;
          return (
            <button key={key} onClick={() => setActiveTab(key)}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, background: "none", border: "none", cursor: "pointer", padding: "2px 14px", minWidth: 56, position: "relative" }}
            >
              <IconEl size={24} color={active ? ios.blue : ios.label2}
                fill={active && key === "favorites" ? ios.blue : "none"}
                strokeWidth={active ? 2 : 1.8}
              />
              <span style={{ fontSize: 10, fontWeight: "500", color: active ? ios.blue : ios.label2, fontFamily: nativeSf }}>
                {label}
              </span>
              {badge && !active && (
                <div style={{ position: "absolute", top: 2, right: "calc(50% - 18px)", width: 8, height: 8, borderRadius: "50%", background: ios.red, border: "1.5px solid rgba(242,242,247,0.9)" }} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
