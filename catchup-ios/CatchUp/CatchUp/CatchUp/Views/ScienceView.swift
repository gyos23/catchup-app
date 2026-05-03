import SwiftUI

// MARK: - Science / About sheet
// Ported from the React prototype's AboutView — transparent scoring + research citations.

struct ScienceView: View {
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        NavigationView {
            ScrollView {
                VStack(spacing: 16) {

                    // ── Science grounding ───────────────────────────────────
                    ScienceCard {
                        Label("Grounded in Relationship Science", systemImage: "brain.head.profile")
                            .font(.system(size: 14, weight: .semibold))
                            .foregroundStyle(Color(hex: "007AFF"))
                            .padding(.bottom, 2)

                        Text("The scoring draws on three decades of research into how humans maintain social bonds. The short version: **contact frequency and recency** are the strongest predictors of perceived closeness, and relationships that aren't actively maintained decay — sometimes faster than we expect.")
                            .font(.system(size: 14))
                            .foregroundStyle(.primary)
                            .padding(.bottom, 4)

                        Divider()

                        ForEach(researchers, id: \.who) { r in
                            HStack(alignment: .top, spacing: 10) {
                                Text("📖").font(.system(size: 16))
                                VStack(alignment: .leading, spacing: 2) {
                                    Group {
                                        Text(r.who).font(.system(size: 13, weight: .semibold))
                                        + Text(" · \(r.role)").font(.system(size: 13)).foregroundColor(.secondary)
                                    }
                                    Text(r.finding)
                                        .font(.system(size: 12))
                                        .foregroundStyle(.secondary)
                                }
                            }
                            .padding(.top, 8)
                        }
                    }

                    // ── Dunbar's layers ─────────────────────────────────────
                    ScienceCard {
                        SectionLabel("Dunbar's Inner Circle")

                        Text("Dunbar found that everyone's network naturally organises into layers by closeness — and each layer has an implied contact cadence to stay active. CatchUp is built to help you maintain your innermost circles.")
                            .font(.system(size: 13))
                            .foregroundStyle(.secondary)
                            .padding(.bottom, 4)

                        ForEach(dunbarLayers, id: \.layer) { d in
                            HStack(alignment: .top, spacing: 12) {
                                VStack(spacing: 2) {
                                    Text(d.layer)
                                        .font(.system(size: 12, weight: .bold))
                                        .foregroundStyle(d.color)
                                    Text(d.cadence)
                                        .font(.system(size: 10))
                                        .foregroundStyle(.secondary)
                                        .multilineTextAlignment(.center)
                                }
                                .frame(width: 72)

                                VStack(alignment: .leading, spacing: 2) {
                                    Text(d.label).font(.system(size: 15, weight: .semibold))
                                    Text(d.desc).font(.system(size: 12)).foregroundStyle(.secondary)
                                }
                            }
                            .padding(.vertical, 6)
                            Divider()
                        }
                    }

                    // ── Health Score breakdown ──────────────────────────────
                    ScienceCard {
                        SectionLabel("The Health Score")

                        Text("Every person gets a score from **0 to 100** based on four observable signals. No guessing, no black box — just patterns from your real contact history.")
                            .font(.system(size: 14))

                        // Score bar
                        GeometryReader { geo in
                            HStack(spacing: 0) {
                                ForEach(scoreSegments, id: \.label) { s in
                                    s.color.frame(width: geo.size.width * CGFloat(s.pts) / 100)
                                }
                            }
                            .clipShape(Capsule())
                        }
                        .frame(height: 10)
                        .padding(.vertical, 6)

                        HStack(spacing: 0) {
                            ForEach(scoreSegments, id: \.label) { s in
                                VStack(spacing: 2) {
                                    Text("\(s.pts)")
                                        .font(.system(size: 12, weight: .bold))
                                        .foregroundStyle(s.color)
                                    Text(s.label)
                                        .font(.system(size: 10))
                                        .foregroundStyle(.secondary)
                                }
                                .frame(maxWidth: .infinity)
                            }
                        }
                    }

                    // ── Each score component ────────────────────────────────
                    ForEach(scoreComponents, id: \.label) { c in
                        ScienceCard {
                            HStack {
                                Text(c.icon).font(.system(size: 22))
                                Text(c.label).font(.system(size: 17, weight: .semibold))
                                Spacer()
                                Text("up to \(c.max) pts")
                                    .font(.system(size: 12, weight: .bold))
                                    .padding(.horizontal, 10).padding(.vertical, 4)
                                    .background(c.color)
                                    .foregroundStyle(.white)
                                    .clipShape(Capsule())
                            }

                            Text(c.description)
                                .font(.system(size: 13))
                                .foregroundStyle(.secondary)
                                .padding(.vertical, 4)

                            ForEach(c.tiers, id: \.pts) { tier in
                                HStack(spacing: 10) {
                                    GeometryReader { geo in
                                        ZStack(alignment: .leading) {
                                            Capsule().fill(Color(.systemFill))
                                            Capsule()
                                                .fill(c.color.opacity(0.3 + 0.7 * Double(tier.pts) / Double(c.max)))
                                                .frame(width: geo.size.width * CGFloat(tier.pts) / CGFloat(c.max))
                                        }
                                    }
                                    .frame(height: 8)

                                    Text("\(tier.pts)")
                                        .font(.system(size: 12, weight: .semibold))
                                        .foregroundStyle(c.color)
                                        .frame(width: 22, alignment: .trailing)

                                    Text(tier.text)
                                        .font(.system(size: 12))
                                        .foregroundStyle(.secondary)
                                        .frame(width: 160, alignment: .leading)
                                }
                                .padding(.vertical, 2)
                            }

                            SciencePill(text: c.science)
                        }
                    }

                    // ── Why calls count more ────────────────────────────────
                    ScienceCard {
                        HStack(spacing: 8) {
                            Text("📞").font(.system(size: 22))
                            Text("Why Calls Count More").font(.system(size: 17, weight: .semibold))
                        }
                        Text("Each answered call counts as roughly **3 messages** in the score. Richer communication channels do more bonding work per minute than text.")
                            .font(.system(size: 13))
                            .foregroundStyle(.secondary)
                            .padding(.vertical, 4)

                        ForEach(callChannels, id: \.label) { row in
                            HStack(spacing: 12) {
                                Text(row.icon).font(.system(size: 20))
                                VStack(alignment: .leading, spacing: 2) {
                                    Text(row.label).font(.system(size: 14, weight: .medium))
                                    Text(row.note).font(.system(size: 12)).foregroundStyle(.secondary)
                                }
                            }
                            .padding(.vertical, 4)
                            Divider()
                        }

                        SciencePill(text: "Vlahovic, Roberts & Dunbar (2012, Journal of Computer-Mediated Communication) found that voice calls produce more subjective feelings of closeness than text-based communication. Dunbar's broader research on \"social grooming\" suggests a hierarchy: face-to-face > voice > text, in terms of bonding effectiveness per unit of time.")
                    }

                    // ── What the colors mean ────────────────────────────────
                    ScienceCard {
                        SectionLabel("What the Colors Mean")

                        ForEach(statusColors, id: \.label) { s in
                            HStack(alignment: .top, spacing: 12) {
                                Circle().fill(s.color).frame(width: 10, height: 10).padding(.top, 4)
                                VStack(alignment: .leading, spacing: 2) {
                                    Text(s.label)
                                        .font(.system(size: 14, weight: .semibold))
                                        .foregroundStyle(s.color)
                                    Text(s.desc)
                                        .font(.system(size: 13))
                                        .foregroundStyle(.secondary)
                                }
                            }
                            .padding(.vertical, 4)
                        }

                        SciencePill(text: "The 70/40 thresholds are design decisions, not published cutoffs. But the direction is grounded: Roberts & Dunbar (2011) found emotional closeness scores correlate strongly with contact frequency, and Dunbar's layer model implies different maintenance requirements for different relationship tiers.")
                    }

                    // ── Data privacy ────────────────────────────────────────
                    ScienceCard {
                        HStack(spacing: 8) {
                            Image(systemName: "lock.fill")
                                .foregroundStyle(Color(hex: "007AFF"))
                                .font(.system(size: 18))
                            Text("Your Data Stays on Your Device").font(.system(size: 17, weight: .semibold))
                        }
                        Text("CatchUp reads your contacts locally. Nothing is sent to external servers. Your relationship data is yours.")
                            .font(.system(size: 13))
                            .foregroundStyle(.secondary)
                            .padding(.top, 4)

                        HStack(spacing: 8) {
                            Label("On-device processing", systemImage: "iphone")
                            Spacer()
                            Label("No account required", systemImage: "person.slash")
                        }
                        .font(.system(size: 12, weight: .medium))
                        .foregroundStyle(Color(hex: "007AFF"))
                        .padding(.top, 6)
                    }

                    Spacer(minLength: 32)
                }
                .padding(.horizontal, 16)
                .padding(.top, 16)
            }
            .navigationTitle("How CatchUp Works")
            .navigationBarTitleDisplayMode(.large)
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button("Done") { dismiss() }
                        .fontWeight(.semibold)
                }
            }
            .background(Color(.systemGroupedBackground))
        }
    }
}

// MARK: - Helper Views

private struct ScienceCard<Content: View>: View {
    @ViewBuilder let content: Content
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            content
        }
        .padding(16)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(Color(.secondarySystemGroupedBackground))
        .clipShape(RoundedRectangle(cornerRadius: 16))
    }
}

private struct SectionLabel: View {
    let text: String
    init(_ text: String) { self.text = text }
    var body: some View {
        Text(text.uppercased())
            .font(.system(size: 12, weight: .semibold))
            .foregroundStyle(.secondary)
            .tracking(0.5)
            .padding(.bottom, 2)
    }
}

private struct SciencePill: View {
    let text: String
    var body: some View {
        HStack(alignment: .top, spacing: 6) {
            Text("🔬").font(.system(size: 12))
            Text(text)
                .font(.system(size: 11))
                .foregroundStyle(.secondary)
                .italic()
        }
        .padding(.top, 8)
        .overlay(alignment: .top) {
            Divider().padding(.bottom, 8)
        }
    }
}

// MARK: - Data

private struct Researcher {
    let who: String; let role: String; let finding: String
}
private let researchers: [Researcher] = [
    Researcher(who: "Robin Dunbar", role: "Oxford professor of evolutionary psychology",
               finding: "Humans have a hard cognitive limit of ~150 stable relationships, structured in layers — and each layer needs a specific contact frequency to stay active."),
    Researcher(who: "Jeffrey Hall", role: "University of Kansas, 2018",
               finding: "Casual friendships require ~50 hours of interaction to form; close friendships ~90 hours; best friends 200+. Hours accumulate through consistent, repeated contact."),
    Researcher(who: "Holt-Lunstad et al.", role: "Meta-analysis, PLOS Medicine 2010",
               finding: "Social relationships are among the strongest predictors of longevity — comparable to quitting smoking. Weak social ties increase mortality risk by ~29%."),
]

private struct DunbarLayer {
    let layer: String; let label: String; let cadence: String; let color: Color; let desc: String
}
private let dunbarLayers: [DunbarLayer] = [
    DunbarLayer(layer: "~5 people",   label: "Support Clique",  cadence: "Weekly",           color: Color(hex: "007AFF"), desc: "Your go-to people. Know your problems. Would lend you money."),
    DunbarLayer(layer: "~15 people",  label: "Sympathy Group",  cadence: "Monthly",           color: Color(hex: "7c3aed"), desc: "Close friends. You'd attend their wedding or funeral."),
    DunbarLayer(layer: "~50 people",  label: "Active Network",  cadence: "A few times a year", color: Color(hex: "FF9F0A"), desc: "Good friends. You pick up where you left off."),
    DunbarLayer(layer: "~150 people", label: "Dunbar's Number", cadence: "Occasional",         color: Color(hex: "34C759"), desc: "The outer limit of stable social relationships."),
]

private struct ScoreSegment {
    let label: String; let pts: Int; let color: Color
}
private let scoreSegments: [ScoreSegment] = [
    ScoreSegment(label: "Recency",   pts: 40, color: Color(hex: "007AFF")),
    ScoreSegment(label: "Frequency", pts: 30, color: Color(hex: "7c3aed")),
    ScoreSegment(label: "Balance",   pts: 20, color: Color(hex: "FF9F0A")),
    ScoreSegment(label: "Trend",     pts: 10, color: Color(hex: "34C759")),
]

private struct ScoreTier {
    let pts: Int; let text: String
}
private struct ScoreComponent {
    let label: String; let max: Int; let color: Color; let icon: String
    let description: String; let tiers: [ScoreTier]; let science: String
}
private let scoreComponents: [ScoreComponent] = [
    ScoreComponent(
        label: "Recency", max: 40, color: Color(hex: "007AFF"), icon: "⏱️",
        description: "How recently you last connected — by message, call, or FaceTime. The most recent contact wins, regardless of type.",
        tiers: [
            ScoreTier(pts: 40, text: "Today or yesterday"),
            ScoreTier(pts: 35, text: "Within 3 days"),
            ScoreTier(pts: 28, text: "Within a week"),
            ScoreTier(pts: 20, text: "Within 2 weeks"),
            ScoreTier(pts: 10, text: "Within a month"),
            ScoreTier(pts: 5,  text: "Within 2 months"),
            ScoreTier(pts: 2,  text: "More than 2 months ago"),
        ],
        science: "Roberts & Dunbar (2011, Personal Relationships) found that contact frequency is the primary predictor of emotional closeness — the less recently you've spoken, the more closeness decays. Recency gets the highest weight (40 pts) because it's the strongest single signal of an active relationship."
    ),
    ScoreComponent(
        label: "Frequency", max: 30, color: Color(hex: "7c3aed"), icon: "📈",
        description: "How often you exchange messages or calls on average per week, looking back 90 days.",
        tiers: [
            ScoreTier(pts: 30, text: "10+ times a week (daily)"),
            ScoreTier(pts: 24, text: "5–9 times a week"),
            ScoreTier(pts: 18, text: "2–4 times a week"),
            ScoreTier(pts: 12, text: "About once a week"),
            ScoreTier(pts: 6,  text: "A few times a month"),
            ScoreTier(pts: 2,  text: "Rarely"),
        ],
        science: "Dunbar's layered network model (Sutcliffe et al., 2012, British Journal of Psychology) shows humans maintain ~5 \"support clique\" friends (needing weekly contact), ~15 \"sympathy group\" friends (monthly), and ~50 active friends (a few times a year). The frequency tiers here map directly to those layers. Separately, Hall (2018) found it takes ~50 hours of interaction to form a casual friendship and ~200 hours for a best friend — consistent contact is how those hours accumulate."
    ),
    ScoreComponent(
        label: "Balance", max: 20, color: Color(hex: "FF9F0A"), icon: "🤝",
        description: "Whether you're the one reaching out, not just responding. Healthy relationships flow both ways.",
        tiers: [
            ScoreTier(pts: 20, text: "You start 30%+ of conversations"),
            ScoreTier(pts: 14, text: "You start 15–29%"),
            ScoreTier(pts: 8,  text: "You start 5–14%"),
            ScoreTier(pts: 3,  text: "Almost always them initiating"),
        ],
        science: "Equity theory (Adams, 1965) established that perceived imbalance in any relationship creates dissatisfaction over time. Relational maintenance research (Stafford & Canary, 1991, Communication Monographs) identifies mutual \"assurance\" and \"positivity\" behaviors as core to keeping relationships stable. You don't need perfect 50/50, but consistently being the passive party is a warning sign."
    ),
    ScoreComponent(
        label: "Trend", max: 10, color: Color(hex: "34C759"), icon: "📊",
        description: "Whether the relationship is warming up or cooling down compared to last month.",
        tiers: [
            ScoreTier(pts: 10, text: "This month ≥ last month"),
            ScoreTier(pts: 5,  text: "Slightly less active than last month"),
            ScoreTier(pts: 0,  text: "Significantly quieter than last month"),
        ],
        science: "Declining contact is an early warning of relationship dissolution. Dunbar's group studied temporal communication patterns in phone networks and found that the volume of calls between two people is a leading indicator of relationship strength — a consistent drop tends to precede the relationship going dormant."
    ),
]

private struct CallChannel {
    let icon: String; let label: String; let note: String
}
private let callChannels: [CallChannel] = [
    CallChannel(icon: "📹", label: "FaceTime Video",       note: "Closest to in-person — facial cues, tone, laughter"),
    CallChannel(icon: "🎙️", label: "FaceTime Audio / Phone", note: "Tone of voice carries emotional nuance texts can't"),
    CallChannel(icon: "💬", label: "iMessage",              note: "High volume, lower bonding depth per exchange"),
]

private struct StatusColorItem {
    let color: Color; let label: String; let desc: String
}
private let statusColors: [StatusColorItem] = [
    StatusColorItem(color: Color(hex: "34C759"), label: "Healthy  70–100",           desc: "You're in consistent touch. This relationship is actively maintained."),
    StatusColorItem(color: Color(hex: "FF9F0A"), label: "Needs Attention  40–69",    desc: "It's been a while. A quick message can reset the clock significantly."),
    StatusColorItem(color: Color(hex: "FF453A"), label: "Priority  below 40",        desc: "This relationship is going dormant. The longer you wait, the harder it gets to restart."),
]
