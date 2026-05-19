// ============================================================
// Artohie Prestige System (APS) — Constants & Configuration
// ============================================================

import type { TierDefinition, PillarKey } from './types'

// ── Prestige Tier Definitions ──────────────────────────────

export const TIER_DEFINITIONS: TierDefinition[] = [
  {
    tier: 'novice',
    label: 'Novice',
    emoji: '⬛',
    minScore: 0,
    maxScore: 199,
    color: '#888780',
    perks: [
      'Basic artwork listing',
      'Community feed access',
      'Standard search visibility',
    ],
  },
  {
    tier: 'emerging',
    label: 'Emerging',
    emoji: '🥉',
    minScore: 200,
    maxScore: 399,
    color: '#CD7F32',
    perks: [
      '10% search ranking boost',
      'Basic analytics dashboard',
      'Commission request eligibility',
    ],
  },
  {
    tier: 'rising',
    label: 'Rising',
    emoji: '🥈',
    minScore: 400,
    maxScore: 599,
    color: '#A8A9AD',
    perks: [
      '25% search ranking boost',
      'Collection spotlight eligibility',
      'Priority customer support',
      'Advanced analytics',
    ],
  },
  {
    tier: 'established',
    label: 'Established',
    emoji: '🥇',
    minScore: 600,
    maxScore: 749,
    color: '#C8A96B',
    perks: [
      '50% search ranking boost',
      'Editorial submission access',
      'Commission priority queue',
      'Reduced platform fee (12% → 10%)',
    ],
  },
  {
    tier: 'elite',
    label: 'Elite',
    emoji: '💎',
    minScore: 750,
    maxScore: 899,
    color: '#6EA8D4',
    perks: [
      '75% search ranking boost',
      'Verified badge on profile',
      'Homepage carousel eligibility',
      'Reduced platform fee (10% → 8%)',
      'Early access to platform features',
    ],
  },
  {
    tier: 'prestige',
    label: 'Prestige',
    emoji: '👑',
    minScore: 900,
    maxScore: 1000,
    color: '#C8A96B',
    perks: [
      '100% search ranking boost',
      'Flagship exhibition eligibility',
      'Brand partnership programme',
      'Dedicated account manager',
      'Reduced platform fee (8% → 5%)',
      'Artohie Prestige annual retrospective',
    ],
  },
]

// ── Pillar Weights (must sum to 1.0) ──────────────────────

export const PILLAR_WEIGHTS: Record<PillarKey, number> = {
  engagement:      0.25,
  quality:         0.22,
  sales:           0.20,
  consistency:     0.15,
  reputation:      0.12,
  profileStrength: 0.06,
}

// ── Intra-Pillar Signal Weights ────────────────────────────
// Each pillar has named sub-signals with weights summing to 1.0

export const SIGNAL_WEIGHTS = {
  engagement: {
    likesReceived7d:         0.25,
    commentsReceived7d:      0.20,
    savesToCollections7d:    0.20,
    repostsAndShares7d:      0.15,
    profileVisitsUnique7d:   0.12,
    storyViews7d:            0.08,
  },
  quality: {
    aiCompositionScore:      0.30,
    peerReviewAverage:       0.25,
    collectionPlacements:    0.18,
    editorialFeatures:       0.15,
    highResFidelityScore:    0.07,
    originalityScore:        0.05,
  },
  sales: {
    artworksSold30d:          0.28,
    commissionRevenue30d:     0.25,
    averageSalePriceTier:     0.18,
    repeatBuyers:             0.15,
    subscriptionMembers:      0.08,
    limitedDropPerformance:   0.06,
  },
  consistency: {
    uploadStreakDays:          0.25,
    uploadsLast30d:           0.22,
    blogPostsLast30d:         0.15,
    livestreamSessions30d:    0.15,
    commissionResponseRate:   0.13,
    profileCompleteness:      0.10,
  },
  reputation: {
    collectorReviewAverage:    0.28,
    commissionCompletionRate:  0.22,
    verificationTier:          0.18,
    disputeResolutionRate:     0.15,
    reportCount30d:            0.10, // inverted — higher = worse
    followerQualityScore:      0.07,
  },
  profileStrength: {
    bioCompleteness:           0.25,
    portfolioSiteActive:       0.22,
    socialLinksVerified:       0.18,
    customDomainActive:        0.15,
    artistStatementFilled:     0.12,
    exhibitionHistory:         0.08,
  },
} as const

// ── Normalisation Caps (max expected real-world value → 100) ──

export const NORMALISATION_CAPS = {
  // Engagement
  likesReceived7d:           500,
  commentsReceived7d:        200,
  savesToCollections7d:      150,
  repostsAndShares7d:        100,
  profileVisitsUnique7d:     2000,
  storyViews7d:              5000,

  // Quality (already 0–100 from AI)
  aiCompositionScore:        100,
  peerReviewAverage:         5.0,   // will be ×20 to → 100
  collectionPlacements:      50,
  editorialFeatures:         10,
  highResFidelityScore:      100,
  originalityScore:          100,

  // Sales
  artworksSold30d:           50,
  commissionRevenue30d:      10000,  // USD
  averageSalePriceTier:      5,      // ×20 to → 100
  repeatBuyers:              30,
  subscriptionMembers:       500,
  limitedDropPerformance:    100,    // already %

  // Consistency
  uploadStreakDays:           365,
  uploadsLast30d:             30,
  blogPostsLast30d:           8,
  livestreamSessions30d:      12,
  commissionResponseRate:     100,
  profileCompleteness:        100,

  // Reputation
  collectorReviewAverage:     5.0,   // ×20 to → 100
  commissionCompletionRate:   100,
  verificationTier:           3,     // ×33.3 to → 100
  disputeResolutionRate:      100,
  reportCount30d:             20,    // inversely normalised
  followerQualityScore:       100,

  // Profile Strength
  bioCompleteness:            100,
  portfolioSiteActive:        1,     // boolean
  socialLinksVerified:        5,     // ×20 to → 100
  customDomainActive:         1,     // boolean
  artistStatementFilled:      1,     // boolean
  exhibitionHistory:          20,
} as const

// ── Decay Rules ────────────────────────────────────────────

export const DECAY_RULES = [
  {
    id: 'no_uploads_30d',
    reason: 'No uploads in 30 days',
    multiplier: 0.85,
    check: (input: { lastUploadDate: Date }) =>
      daysSince(input.lastUploadDate) > 30,
  },
  {
    id: 'no_engagement_14d',
    reason: 'No engagement activity in 14 days',
    multiplier: 0.90,
    check: (input: { lastEngagementDate: Date }) =>
      daysSince(input.lastEngagementDate) > 14,
  },
  {
    id: 'content_violation',
    reason: 'Active content policy violation',
    multiplier: 0.80,
    check: (input: { hasContentViolation: boolean }) =>
      input.hasContentViolation,
  },
  {
    id: 'incomplete_profile',
    reason: 'Profile completeness below 50%',
    multiplier: 0.95,
    check: (input: { profileCompleteness: number }) =>
      input.profileCompleteness < 50,
  },
] as const

// ── Bonus Multiplier Rules ─────────────────────────────────

export const BONUS_RULES = [
  {
    id: 'verified_artist',
    reason: 'Verified artist badge',
    multiplier: 1.30,
    check: (input: { isVerified: boolean }) => input.isVerified,
  },
  {
    id: 'editorial_feature',
    reason: 'Featured in Artohie editorial',
    multiplier: 1.20,
    check: (input: { isFeaturedEditorial: boolean }) => input.isFeaturedEditorial,
  },
  {
    id: 'first_sale',
    reason: 'First sale milestone reached',
    multiplier: 1.15,
    check: (input: { hasSoldFirstArtwork: boolean }) => input.hasSoldFirstArtwork,
  },
  {
    id: 'streak_30',
    reason: 'Upload streak ≥ 30 days',
    multiplier: 1.10,
    check: (input: { currentStreakDays: number }) => input.currentStreakDays >= 30,
  },
] as const

// Maximum bonus multiplier cap (prevents runaway stacking)
export const MAX_BONUS_MULTIPLIER = 1.35

// ── Helper ─────────────────────────────────────────────────

function daysSince(date: Date): number {
  return (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24)
}
