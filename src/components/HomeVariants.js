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
  Zap, Clock, CheckCircle, AlertTriangle, X,
} from "lucide-react";

const brand = {
  primary:   "#0969b8",
  dark:      "#0c2340",
  yellow:    "#f2a900",
  red:       "#e4002c",
  green:     "#0969b8",
  bg:        "#f4f4f3",
  white:     "#ffffff",
  secondary: "#6c6870",
};

// ─── Shared helpers ───────────────────────────────────────────────────────────
function statusColor(status) {
  return status === "green" ? brand.primary : status === "yellow" ? brand.yellow : brand.red;
}

function HealthRing({ score, size = 60, strokeWidth = 4 }) {
  const r = (size - strokeWidth * 2) / 2;
  const c = 2 * Math.PI * r;
  const dash = (score / 100) * c;
  const color = score >= 70 ? brand.primary : score >= 40 ? brand.yellow : brand.red;
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
  }, [delay]); // eslint-disable-line react-hooks/exhaustive-deps

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
          backgroundColor: "#ffffff",
          paddingTop: "max(1.5rem, env(safe-area-inset-top))",
          boxShadow: "0 1px 0 rgba(0,0,0,0.07)",
        }}
        className="px-5 pb-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Heart size={18} style={{ color: "#0969b8" }} />
            <span
              className="font-bold text-lg"
              style={{ color: "#0c2340", letterSpacing: "-0.02em" }}
            >
              CatchUp
            </span>
          </div>

          {/* Tribe health ring + number */}
          <div className="flex items-center space-x-2">
            <div style={{ width: 32, height: 32 }}>
              <AnimatedRing score={avgHealth} size={32} strokeWidth={3} delay={700} />
            </div>
            <div className="text-right leading-none">
              <p
                className="font-black text-base"
                style={{
                  color: avgHealth >= 70 ? "#0969b8" : avgHealth >= 40 ? "#f2a900" : "#e4002c",
                  letterSpacing: "-0.02em",
                }}
              >
                {avgHealth}%
              </p>
              <p className="mt-0.5" style={{ color: "#9ca3af", fontSize: "10px" }}>tribe health</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Hero card ───────────────────────────────────────────────────────── */}
      {hero && (
        <div className="mx-4 mt-4">
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: "linear-gradient(145deg, #0969b8 0%, #0b1f40 100%)",
              boxShadow: "0 8px 30px rgba(9,105,184,0.28)",
            }}
          >
            <div className="px-5 pt-4 flex items-center space-x-1.5">
              <Zap size={11} style={{ color: "#fbbf24" }} />
              <span style={{ color: "#fbbf24", fontSize: "11px", fontWeight: 700, letterSpacing: "0.09em" }}>
                YOUR MOVE TODAY
              </span>
            </div>

            <div className="px-5 pt-3 pb-5">
              <div className="flex items-center space-x-4">

                {/* Large animated ring + avatar */}
                <div className="relative flex-shrink-0" style={{ width: 76, height: 76 }}>
                  <div style={{ position: "absolute", inset: 0 }}>
                    <AnimatedRing score={hero.healthScore} size={76} strokeWidth={5} delay={200} dark={true} />
                  </div>
                  <div
                    className="absolute rounded-full flex items-center justify-center font-bold text-white"
                    style={{
                      inset: "6px",
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
                  <p className="mt-0.5 text-sm" style={{ color: "rgba(255,255,255,0.58)" }}>
                    {hero.lastContact} &middot; {hero.healthScore}%
                  </p>

                  <div className="flex space-x-2 mt-3">
                    <button
                      onClick={() => onOpenContact(hero)}
                      className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold"
                      style={{ backgroundColor: "#fff", color: "#0969b8" }}
                    >
                      <MessageCircle size={13} />
                      <span>Message</span>
                    </button>
                    <button
                      onClick={() => window.open(`tel:${hero.phoneNumber}`, "_self")}
                      className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold"
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
        </div>
      )}

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

                  <div className="ml-3 flex-shrink-0">
                    {section.key !== "good" ? (
                      <button
                        onClick={() => onOpenContact(r)}
                        className="text-xs font-semibold px-3 py-1.5 rounded-full"
                        style={{ backgroundColor: section.color + "12", color: section.color }}
                      >
                        {r.isGroup ? "Message" : "Reach out"}
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
