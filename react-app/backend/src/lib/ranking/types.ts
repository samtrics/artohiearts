// ============================================================
// Artohie Prestige System (APS) — Type Definitions
// ============================================================

export type PillarKey = 'engagement' | 'quality' | 'sales' | 'consistency' | 'reputation' | 'profileStrength'

export type PrestigeTier =
  | 'novice'
  | 'emerging'
  | 'rising'
  | 'established'
  | 'elite'
  | 'prestige'

export interface PillarScore {
  raw: number        // 0–100: normalised signal value before weighting
  weighted: number   // raw × pillar weight
  signals: SignalBreakdown[]
  decayFactor: number // 0.0–1.0 multiplier applied to this pillar
}

export interface SignalBreakdown {
  name: string
  value: number      // raw input value
  normalised: number // 0–100 after normalisation
  weight: number     // intra-pillar weight
  contribution: number // normalised × weight
}

export interface RankingInput {
  artistId: string

  // ── Engagement signals
  likesReceived7d: number
  commentsReceived7d: number
  savesToCollections7d: number
  repostsAndShares7d: number
  profileVisitsUnique7d: number
  storyViews7d: number

  // ── Quality signals
  aiCompositionScore: number   // 0–100 from Python AI service
  peerReviewAverage: number    // 0–5.0
  collectionPlacements: number // times added to curated collections
  editorialFeatures: number    // featured by editors
  highResFidelityScore: number // 0–100 from upload analyser
  originalityScore: number     // 0–100 plagiarism inverse

  // ── Sales signals
  artworksSold30d: number
  commissionRevenue30d: number   // USD
  averageSalePriceTier: number   // 1–5 tier
  repeatBuyers: number
  subscriptionMembers: number
  limitedDropPerformance: number // 0–100 sell-through %

  // ── Consistency signals
  uploadStreakDays: number
  uploadsLast30d: number
  blogPostsLast30d: number
  livestreamSessions30d: number
  commissionResponseRate: number // 0–100 %
  profileCompleteness: number    // 0–100 %

  // ── Reputation signals
  collectorReviewAverage: number  // 0–5.0
  commissionCompletionRate: number // 0–100 %
  verificationTier: number         // 0=none 1=basic 2=verified 3=featured
  disputeResolutionRate: number    // 0–100 %
  reportCount30d: number           // negative signal
  followerQualityScore: number     // 0–100, real vs bot ratio

  // ── Profile Strength signals
  bioCompleteness: number          // 0–100 %
  portfolioSiteActive: boolean
  socialLinksVerified: number      // count (0–5)
  customDomainActive: boolean
  artistStatementFilled: boolean
  exhibitionHistory: number        // count of listed exhibitions

  // ── Temporal metadata
  lastUploadDate: Date
  lastEngagementDate: Date
  accountCreatedDate: Date
  hasContentViolation: boolean
  isVerified: boolean
  isFeaturedEditorial: boolean
  hasSoldFirstArtwork: boolean
  currentStreakDays: number
}

export interface APSResult {
  artistId: string
  calculatedAt: Date

  // Final score
  totalScore: number        // 0–1000
  tier: PrestigeTier
  tierLabel: string
  tierEmoji: string

  // Pillar breakdown
  pillars: Record<PillarKey, PillarScore>

  // Modifiers applied
  decayPenalties: DecayPenalty[]
  bonusMultipliers: BonusMultiplier[]
  totalDecayFactor: number   // product of all decay factors
  totalBonusMultiplier: number // product of all bonus multipliers

  // Ranking metadata
  percentileEstimate: number  // 0–100, requires population stats
  scoreDelta24h: number       // change from previous day
  momentum: 'rising' | 'stable' | 'falling'

  // Next tier info
  nextTier: PrestigeTier | null
  pointsToNextTier: number | null
}

export interface DecayPenalty {
  reason: string
  multiplier: number   // < 1.0, e.g. 0.85 = −15%
}

export interface BonusMultiplier {
  reason: string
  multiplier: number   // > 1.0, e.g. 1.30 = +30%
}

export interface TierDefinition {
  tier: PrestigeTier
  label: string
  emoji: string
  minScore: number
  maxScore: number
  color: string
  perks: string[]
}

export interface PopulationStats {
  mean: number
  stdDev: number
  p25: number
  p50: number
  p75: number
  p90: number
  p95: number
  p99: number
  totalArtists: number
}
