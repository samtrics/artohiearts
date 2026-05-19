// ============================================================
// Artohie Prestige System (APS) — Core Ranking Engine
// ============================================================
// 
// Architecture:
//   1. Normalise raw signals → 0–100 per signal
//   2. Weight signals within each pillar → pillar raw score (0–100)
//   3. Weight pillars → composite score (0–100)
//   4. Apply decay penalties (multiplicative, < 1.0)
//   5. Apply bonus multipliers (multiplicative, > 1.0, capped)
//   6. Scale to APS points (0–1000)
//   7. Map to prestige tier
// ============================================================

import type {
  RankingInput,
  APSResult,
  PillarScore,
  PillarKey,
  SignalBreakdown,
  DecayPenalty,
  BonusMultiplier,
  PrestigeTier,
  PopulationStats,
} from './types'

import {
  PILLAR_WEIGHTS,
  SIGNAL_WEIGHTS,
  NORMALISATION_CAPS,
  DECAY_RULES,
  BONUS_RULES,
  TIER_DEFINITIONS,
  MAX_BONUS_MULTIPLIER,
} from './constants'

// ── Public API ─────────────────────────────────────────────

/**
 * Calculate the Artohie Prestige Score for a given artist.
 *
 * @param input        - Raw signal values collected from the database
 * @param previousScore - Yesterday's total score (for delta/momentum)
 * @param population   - Optional platform-wide stats for percentile
 */
export function calculateAPSScore(
  input: RankingInput,
  previousScore: number = 0,
  population?: PopulationStats,
): APSResult {
  // Step 1–2: Compute each pillar
  const pillars: Record<PillarKey, PillarScore> = {
    engagement:      computeEngagementPillar(input),
    quality:         computeQualityPillar(input),
    sales:           computeSalesPillar(input),
    consistency:     computeConsistencyPillar(input),
    reputation:      computeReputationPillar(input),
    profileStrength: computeProfileStrengthPillar(input),
  }

  // Step 3: Weighted composite (0–100)
  const compositeRaw = (Object.keys(pillars) as PillarKey[]).reduce(
    (sum, key) => sum + pillars[key].weighted,
    0,
  )

  // Step 4: Decay penalties
  const { decayPenalties, totalDecayFactor } = computeDecay(input)

  // Step 5: Bonus multipliers
  const { bonusMultipliers, totalBonusMultiplier } = computeBonuses(input)

  // Step 6: Final score 0–1000
  const totalScore = Math.round(
    Math.min(1000, compositeRaw * 10 * totalDecayFactor * totalBonusMultiplier),
  )

  // Step 7: Tier lookup
  const tierDef = getTierForScore(totalScore)

  // Momentum
  const scoreDelta24h = totalScore - previousScore
  const momentum: APSResult['momentum'] =
    scoreDelta24h > 5 ? 'rising' : scoreDelta24h < -5 ? 'falling' : 'stable'

  // Next tier
  const nextTierDef = TIER_DEFINITIONS.find(t => t.minScore > totalScore) ?? null
  const pointsToNextTier = nextTierDef ? nextTierDef.minScore - totalScore : null

  // Percentile (requires population data)
  const percentileEstimate = population
    ? estimatePercentile(totalScore, population)
    : 50

  return {
    artistId: input.artistId,
    calculatedAt: new Date(),
    totalScore,
    tier: tierDef.tier,
    tierLabel: tierDef.label,
    tierEmoji: tierDef.emoji,
    pillars,
    decayPenalties,
    bonusMultipliers,
    totalDecayFactor,
    totalBonusMultiplier,
    percentileEstimate,
    scoreDelta24h,
    momentum,
    nextTier: nextTierDef?.tier ?? null,
    pointsToNextTier,
  }
}

// ── Pillar Computations ────────────────────────────────────

function computeEngagementPillar(input: RankingInput): PillarScore {
  const signals: Array<[string, number, number]> = [
    ['Likes received (7d)',        input.likesReceived7d,        SIGNAL_WEIGHTS.engagement.likesReceived7d],
    ['Comments received (7d)',     input.commentsReceived7d,     SIGNAL_WEIGHTS.engagement.commentsReceived7d],
    ['Saves to collections (7d)',  input.savesToCollections7d,   SIGNAL_WEIGHTS.engagement.savesToCollections7d],
    ['Reposts & shares (7d)',      input.repostsAndShares7d,     SIGNAL_WEIGHTS.engagement.repostsAndShares7d],
    ['Unique profile visits (7d)', input.profileVisitsUnique7d,  SIGNAL_WEIGHTS.engagement.profileVisitsUnique7d],
    ['Story views (7d)',           input.storyViews7d,           SIGNAL_WEIGHTS.engagement.storyViews7d],
  ]

  const caps = [
    NORMALISATION_CAPS.likesReceived7d,
    NORMALISATION_CAPS.commentsReceived7d,
    NORMALISATION_CAPS.savesToCollections7d,
    NORMALISATION_CAPS.repostsAndShares7d,
    NORMALISATION_CAPS.profileVisitsUnique7d,
    NORMALISATION_CAPS.storyViews7d,
  ]

  return buildPillar('engagement', signals, caps, input)
}

function computeQualityPillar(input: RankingInput): PillarScore {
  const signals: Array<[string, number, number]> = [
    ['AI composition score',     input.aiCompositionScore,           SIGNAL_WEIGHTS.quality.aiCompositionScore],
    ['Peer review average',      input.peerReviewAverage * 20,       SIGNAL_WEIGHTS.quality.peerReviewAverage],   // 0–5 → 0–100
    ['Collection placements',    input.collectionPlacements,         SIGNAL_WEIGHTS.quality.collectionPlacements],
    ['Editorial features',       input.editorialFeatures,            SIGNAL_WEIGHTS.quality.editorialFeatures],
    ['High-res fidelity',        input.highResFidelityScore,         SIGNAL_WEIGHTS.quality.highResFidelityScore],
    ['Originality score',        input.originalityScore,             SIGNAL_WEIGHTS.quality.originalityScore],
  ]

  const caps = [
    NORMALISATION_CAPS.aiCompositionScore,
    100,  // already scaled
    NORMALISATION_CAPS.collectionPlacements,
    NORMALISATION_CAPS.editorialFeatures,
    NORMALISATION_CAPS.highResFidelityScore,
    NORMALISATION_CAPS.originalityScore,
  ]

  return buildPillar('quality', signals, caps, input)
}

function computeSalesPillar(input: RankingInput): PillarScore {
  const signals: Array<[string, number, number]> = [
    ['Artworks sold (30d)',          input.artworksSold30d,                SIGNAL_WEIGHTS.sales.artworksSold30d],
    ['Commission revenue (30d USD)', input.commissionRevenue30d,           SIGNAL_WEIGHTS.sales.commissionRevenue30d],
    ['Avg. sale price tier',         input.averageSalePriceTier * 20,      SIGNAL_WEIGHTS.sales.averageSalePriceTier], // 1–5 → 20–100
    ['Repeat buyers',                input.repeatBuyers,                   SIGNAL_WEIGHTS.sales.repeatBuyers],
    ['Subscription members',         input.subscriptionMembers,            SIGNAL_WEIGHTS.sales.subscriptionMembers],
    ['Limited drop sell-through %',  input.limitedDropPerformance,         SIGNAL_WEIGHTS.sales.limitedDropPerformance],
  ]

  const caps = [
    NORMALISATION_CAPS.artworksSold30d,
    NORMALISATION_CAPS.commissionRevenue30d,
    100,
    NORMALISATION_CAPS.repeatBuyers,
    NORMALISATION_CAPS.subscriptionMembers,
    NORMALISATION_CAPS.limitedDropPerformance,
  ]

  return buildPillar('sales', signals, caps, input)
}

function computeConsistencyPillar(input: RankingInput): PillarScore {
  const signals: Array<[string, number, number]> = [
    ['Upload streak (days)',         input.uploadStreakDays,          SIGNAL_WEIGHTS.consistency.uploadStreakDays],
    ['Uploads last 30 days',         input.uploadsLast30d,           SIGNAL_WEIGHTS.consistency.uploadsLast30d],
    ['Blog posts last 30 days',      input.blogPostsLast30d,         SIGNAL_WEIGHTS.consistency.blogPostsLast30d],
    ['Livestream sessions (30d)',     input.livestreamSessions30d,    SIGNAL_WEIGHTS.consistency.livestreamSessions30d],
    ['Commission response rate %',   input.commissionResponseRate,   SIGNAL_WEIGHTS.consistency.commissionResponseRate],
    ['Profile completeness %',       input.profileCompleteness,      SIGNAL_WEIGHTS.consistency.profileCompleteness],
  ]

  const caps = [
    NORMALISATION_CAPS.uploadStreakDays,
    NORMALISATION_CAPS.uploadsLast30d,
    NORMALISATION_CAPS.blogPostsLast30d,
    NORMALISATION_CAPS.livestreamSessions30d,
    NORMALISATION_CAPS.commissionResponseRate,
    NORMALISATION_CAPS.profileCompleteness,
  ]

  return buildPillar('consistency', signals, caps, input)
}

function computeReputationPillar(input: RankingInput): PillarScore {
  // reportCount30d is an *inverse* signal: more reports = lower score
  const reportSignalValue = Math.max(
    0,
    100 - normalise(input.reportCount30d, NORMALISATION_CAPS.reportCount30d),
  )

  const signals: Array<[string, number, number]> = [
    ['Collector review avg.',        input.collectorReviewAverage * 20,   SIGNAL_WEIGHTS.reputation.collectorReviewAverage],
    ['Commission completion rate %', input.commissionCompletionRate,      SIGNAL_WEIGHTS.reputation.commissionCompletionRate],
    ['Verification tier',            (input.verificationTier / 3) * 100,  SIGNAL_WEIGHTS.reputation.verificationTier],
    ['Dispute resolution rate %',    input.disputeResolutionRate,         SIGNAL_WEIGHTS.reputation.disputeResolutionRate],
    ['Report-free score',            reportSignalValue,                   SIGNAL_WEIGHTS.reputation.reportCount30d],
    ['Follower quality score',       input.followerQualityScore,          SIGNAL_WEIGHTS.reputation.followerQualityScore],
  ]

  const caps = [100, 100, 100, 100, 100, 100] // all already 0–100

  return buildPillar('reputation', signals, caps, input)
}

function computeProfileStrengthPillar(input: RankingInput): PillarScore {
  const signals: Array<[string, number, number]> = [
    ['Bio completeness %',       input.bioCompleteness,                    SIGNAL_WEIGHTS.profileStrength.bioCompleteness],
    ['Portfolio site active',    input.portfolioSiteActive ? 100 : 0,      SIGNAL_WEIGHTS.profileStrength.portfolioSiteActive],
    ['Social links verified',    (input.socialLinksVerified / 5) * 100,    SIGNAL_WEIGHTS.profileStrength.socialLinksVerified],
    ['Custom domain active',     input.customDomainActive ? 100 : 0,       SIGNAL_WEIGHTS.profileStrength.customDomainActive],
    ['Artist statement filled',  input.artistStatementFilled ? 100 : 0,    SIGNAL_WEIGHTS.profileStrength.artistStatementFilled],
    ['Exhibition history',       input.exhibitionHistory,                  SIGNAL_WEIGHTS.profileStrength.exhibitionHistory],
  ]

  const caps = [100, 100, 100, 100, 100, NORMALISATION_CAPS.exhibitionHistory]

  return buildPillar('profileStrength', signals, caps, input)
}

// ── Pillar Builder ─────────────────────────────────────────

function buildPillar(
  key: PillarKey,
  signals: Array<[string, number, number]>,
  caps: number[],
  _input: RankingInput,
): PillarScore {
  const breakdowns: SignalBreakdown[] = signals.map(([name, value, weight], i) => {
    const capped = Math.min(value, caps[i])
    const norm = normalise(capped, caps[i])
    return {
      name,
      value,
      normalised: norm,
      weight,
      contribution: norm * weight,
    }
  })

  const raw = clamp(breakdowns.reduce((s, b) => s + b.contribution, 0), 0, 100)
  const weighted = raw * PILLAR_WEIGHTS[key]

  return {
    raw,
    weighted,
    signals: breakdowns,
    decayFactor: 1.0, // pillar-level decay not used; global decay applies
  }
}

// ── Decay & Bonus ──────────────────────────────────────────

function computeDecay(input: RankingInput): {
  decayPenalties: DecayPenalty[]
  totalDecayFactor: number
} {
  const decayPenalties: DecayPenalty[] = []
  let totalDecayFactor = 1.0

  for (const rule of DECAY_RULES) {
    if ((rule.check as (i: typeof input) => boolean)(input)) {
      decayPenalties.push({ reason: rule.reason, multiplier: rule.multiplier })
      totalDecayFactor *= rule.multiplier
    }
  }

  // Clamp to never go below 0.5 (artists can always recover)
  totalDecayFactor = Math.max(0.5, totalDecayFactor)

  return { decayPenalties, totalDecayFactor }
}

function computeBonuses(input: RankingInput): {
  bonusMultipliers: BonusMultiplier[]
  totalBonusMultiplier: number
} {
  const bonusMultipliers: BonusMultiplier[] = []
  let totalBonusMultiplier = 1.0

  for (const rule of BONUS_RULES) {
    if ((rule.check as (i: typeof input) => boolean)(input)) {
      bonusMultipliers.push({ reason: rule.reason, multiplier: rule.multiplier })
      totalBonusMultiplier *= rule.multiplier
    }
  }

  // Cap stacking
  totalBonusMultiplier = Math.min(MAX_BONUS_MULTIPLIER, totalBonusMultiplier)

  return { bonusMultipliers, totalBonusMultiplier }
}

// ── Tier Lookup ────────────────────────────────────────────

function getTierForScore(score: number) {
  const sorted = [...TIER_DEFINITIONS].sort((a, b) => b.minScore - a.minScore)
  return sorted.find(t => score >= t.minScore) ?? TIER_DEFINITIONS[0]
}

// ── Percentile Estimation ──────────────────────────────────

function estimatePercentile(score: number, pop: PopulationStats): number {
  // Simple piecewise linear interpolation between known quantiles
  const points: [number, number][] = [
    [0,        0],
    [pop.p25,  25],
    [pop.p50,  50],
    [pop.p75,  75],
    [pop.p90,  90],
    [pop.p95,  95],
    [pop.p99,  99],
    [1000,    100],
  ]

  for (let i = 1; i < points.length; i++) {
    const [x0, y0] = points[i - 1]
    const [x1, y1] = points[i]
    if (score <= x1) {
      const t = (score - x0) / (x1 - x0)
      return Math.round(y0 + t * (y1 - y0))
    }
  }
  return 100
}

// ── Utilities ──────────────────────────────────────────────

/** Normalise a value between 0 and cap, returning 0–100 */
function normalise(value: number, cap: number): number {
  if (cap === 0) return 0
  return clamp((value / cap) * 100, 0, 100)
}

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n))
}

// ── Batch Processing ───────────────────────────────────────

/**
 * Batch-calculate APS scores for many artists.
 * Returns results sorted by totalScore descending (leaderboard order).
 */
export async function batchCalculateAPS(
  inputs: RankingInput[],
  previousScores: Map<string, number> = new Map(),
  population?: PopulationStats,
): Promise<APSResult[]> {
  const results = inputs.map(input =>
    calculateAPSScore(
      input,
      previousScores.get(input.artistId) ?? 0,
      population,
    ),
  )

  return results.sort((a, b) => b.totalScore - a.totalScore)
}

/**
 * Derive PopulationStats from a set of raw scores.
 * Call this once after batch-calculating to feed back into the next run.
 */
export function derivePopulationStats(scores: number[]): PopulationStats {
  const sorted = [...scores].sort((a, b) => a - b)
  const n = sorted.length

  const pct = (p: number) => sorted[Math.floor((p / 100) * n)] ?? 0
  const mean = scores.reduce((s, v) => s + v, 0) / n
  const variance = scores.reduce((s, v) => s + (v - mean) ** 2, 0) / n

  return {
    mean,
    stdDev: Math.sqrt(variance),
    p25: pct(25),
    p50: pct(50),
    p75: pct(75),
    p90: pct(90),
    p95: pct(95),
    p99: pct(99),
    totalArtists: n,
  }
}
