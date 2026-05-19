// ============================================================
// Artohie Prestige System — Database-Agnostic Signal Collector
// ============================================================
// Aggregates raw ranking signals from any database (SQLite/Postgres)
// Called nightly by the ranking cron job
// ============================================================

import type { RankingInput } from './types'

// Type alias for Prisma client (database agnostic)
type PrismaClient = any;

// ── Raw DB Row Types ───────────────────────────────────────

interface EngagementRow {
  likes_received_7d: number
  comments_received_7d: number
  saves_7d: number
  reposts_7d: number
  profile_visits_7d: number
  story_views_7d: number
}

interface SalesRow {
  artworks_sold_30d: number
  commission_revenue_30d: number
  avg_sale_price_tier: number
  repeat_buyers: number
  subscription_members: number
  drop_sell_through: number
}

interface ConsistencyRow {
  upload_streak_days: number
  uploads_30d: number
  blog_posts_30d: number
  livestream_sessions_30d: number
  commission_response_rate: number
}

interface ReputationRow {
  review_average: string
  commission_completion_rate: number
  report_count_30d: number
  dispute_resolution_rate: number
  follower_quality_score: number
}

interface ArtistProfileRow {
  aiCompositionScore: number
  peerReviewAverage: number | null
  collectionPlacements: number
  editorialFeatures: number
  highResFidelityScore: number
  originalityScore: number
  verificationTier: number
  profileCompleteness: number
  bioCompleteness: number
  portfolioSiteActive: boolean
  socialLinksVerified: number
  customDomainActive: boolean
  artistStatementFilled: boolean
  exhibitionCount: number
  lastUploadAt: Date | null
  lastEngagementAt: Date | null
  createdAt: Date
  hasContentViolation: boolean
  isVerified: boolean
  isFeaturedEditorial: boolean
  hasSoldFirstArtwork: boolean
  uploadStreakDays: number
}

// ── Main Collector ─────────────────────────────────────────

/**
 * Collect all ranking signals for a given artist from the database.
 * Designed for nightly batch execution. Fully database-agnostic.
 */
export async function collectRankingSignals(
  prisma: PrismaClient,
  artistId: string,
): Promise<RankingInput> {
  const [engagement, sales, consistency, reputation, profile] = await Promise.all([
    fetchEngagementSignals(prisma, artistId),
    fetchSalesSignals(prisma, artistId),
    fetchConsistencySignals(prisma, artistId),
    fetchReputationSignals(prisma, artistId),
    fetchArtistProfile(prisma, artistId),
  ])

  const now = new Date()

  return {
    artistId,

    // Engagement
    likesReceived7d:           engagement.likes_received_7d,
    commentsReceived7d:        engagement.comments_received_7d,
    savesToCollections7d:      engagement.saves_7d,
    repostsAndShares7d:        engagement.reposts_7d,
    profileVisitsUnique7d:     engagement.profile_visits_7d,
    storyViews7d:              engagement.story_views_7d,

    // Quality
    aiCompositionScore:        profile.aiCompositionScore ?? 0,
    peerReviewAverage:         profile.peerReviewAverage ?? 0,
    collectionPlacements:      profile.collectionPlacements ?? 0,
    editorialFeatures:         profile.editorialFeatures ?? 0,
    highResFidelityScore:      profile.highResFidelityScore ?? 0,
    originalityScore:          profile.originalityScore ?? 100,

    // Sales
    artworksSold30d:           sales.artworks_sold_30d,
    commissionRevenue30d:      sales.commission_revenue_30d,
    averageSalePriceTier:      sales.avg_sale_price_tier,
    repeatBuyers:              sales.repeat_buyers,
    subscriptionMembers:       sales.subscription_members,
    limitedDropPerformance:    sales.drop_sell_through,

    // Consistency
    uploadStreakDays:           consistency.upload_streak_days ?? 0,
    uploadsLast30d:             consistency.uploads_30d,
    blogPostsLast30d:           consistency.blog_posts_30d,
    livestreamSessions30d:      consistency.livestream_sessions_30d,
    commissionResponseRate:     consistency.commission_response_rate ?? 0,
    profileCompleteness:        profile.profileCompleteness ?? 0,

    // Reputation
    collectorReviewAverage:     parseFloat(reputation.review_average ?? '0'),
    commissionCompletionRate:   reputation.commission_completion_rate ?? 100,
    verificationTier:           profile.verificationTier ?? 0,
    disputeResolutionRate:      reputation.dispute_resolution_rate ?? 100,
    reportCount30d:             reputation.report_count_30d,
    followerQualityScore:       reputation.follower_quality_score ?? 100,

    // Profile Strength
    bioCompleteness:            profile.bioCompleteness ?? 0,
    portfolioSiteActive:        profile.portfolioSiteActive ?? false,
    socialLinksVerified:        profile.socialLinksVerified ?? 0,
    customDomainActive:         profile.customDomainActive ?? false,
    artistStatementFilled:      profile.artistStatementFilled ?? false,
    exhibitionHistory:          profile.exhibitionCount ?? 0,

    // Temporal metadata
    lastUploadDate:             profile.lastUploadAt ?? now,
    lastEngagementDate:         profile.lastEngagementAt ?? now,
    accountCreatedDate:         profile.createdAt ?? now,
    hasContentViolation:        profile.hasContentViolation ?? false,
    isVerified:                 profile.isVerified ?? false,
    isFeaturedEditorial:        profile.isFeaturedEditorial ?? false,
    hasSoldFirstArtwork:        profile.hasSoldFirstArtwork ?? false,
    currentStreakDays:           profile.uploadStreakDays ?? 0,
  }
}

// ── Signal Fetch Helpers ───────────────────────────────────

async function fetchEngagementSignals(
  prisma: PrismaClient,
  artistId: string,
): Promise<EngagementRow> {
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  // Fetch all artworks for this artist
  const artworks = await prisma.artwork.findMany({
    where: { artistId },
    select: { id: true }
  })
  const artworkIds = artworks.map((a: any) => a.id)

  const [likes, comments, saves, reposts, profileViews, storyViews] = await Promise.all([
    artworkIds.length > 0 ? prisma.like.count({
      where: {
        artworkId: { in: artworkIds },
        createdAt: { gte: sevenDaysAgo }
      }
    }) : 0,
    artworkIds.length > 0 ? prisma.comment.count({
      where: {
        artworkId: { in: artworkIds },
        createdAt: { gte: sevenDaysAgo }
      }
    }) : 0,
    artworkIds.length > 0 ? prisma.save.count({
      where: {
        artworkId: { in: artworkIds },
        createdAt: { gte: sevenDaysAgo }
      }
    }) : 0,
    artworkIds.length > 0 ? prisma.repost.count({
      where: {
        artworkId: { in: artworkIds },
        createdAt: { gte: sevenDaysAgo }
      }
    }) : 0,
    prisma.profileView.count({
      where: {
        artistId,
        createdAt: { gte: sevenDaysAgo }
      }
    }),
    prisma.storyView.count({
      where: {
        artistId,
        createdAt: { gte: sevenDaysAgo }
      }
    })
  ])

  return {
    likes_received_7d: likes,
    comments_received_7d: comments,
    saves_7d: saves,
    reposts_7d: reposts,
    profile_visits_7d: profileViews,
    story_views_7d: storyViews
  }
}

async function fetchSalesSignals(
  prisma: PrismaClient,
  artistId: string,
): Promise<SalesRow> {
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const [artworksSold, commissions, subscriptionsCount, drops] = await Promise.all([
    prisma.order.count({
      where: {
        artistId,
        orderType: 'artwork',
        createdAt: { gte: thirtyDaysAgo }
      }
    }),
    prisma.order.findMany({
      where: {
        artistId,
        orderType: 'commission',
        createdAt: { gte: thirtyDaysAgo }
      },
      select: { amountUsd: true }
    }),
    prisma.subscription.count({
      where: {
        artistId,
        status: 'active'
      }
    }),
    prisma.limitedDrop.aggregate({
      where: {
        artistId,
        endedAt: { gte: thirtyDaysAgo }
      },
      _avg: {
        sellThroughPct: true
      }
    })
  ])

  const commissionRevenue = commissions.reduce((sum: number, c: any) => sum + c.amountUsd, 0)

  // Repeat buyers calculation: find all buyers with > 1 order from this artist
  const allOrders = await prisma.order.findMany({
    where: { artistId },
    select: { buyerId: true }
  })
  const buyerCounts = new Map<string, number>()
  for (const o of allOrders) {
    buyerCounts.set(o.buyerId, (buyerCounts.get(o.buyerId) ?? 0) + 1)
  }
  let repeatBuyers = 0
  for (const count of buyerCounts.values()) {
    if (count > 1) repeatBuyers++
  }

  // Average sold artwork price tier calculation
  const soldOrders = await prisma.order.findMany({
    where: {
      artistId,
      orderType: 'artwork',
      artworkId: { not: null }
    },
    select: { artworkId: true }
  })
  const soldArtworkIds = soldOrders.map((o: any) => o.artworkId).filter(Boolean)
  let avgPriceTier = 1
  if (soldArtworkIds.length > 0) {
    const artworkAgg = await prisma.artwork.aggregate({
      where: { id: { in: soldArtworkIds } },
      _avg: { priceTier: true }
    })
    avgPriceTier = artworkAgg._avg.priceTier ?? 1
  }

  return {
    artworks_sold_30d: artworksSold,
    commission_revenue_30d: commissionRevenue,
    avg_sale_price_tier: avgPriceTier,
    repeat_buyers: repeatBuyers,
    subscription_members: subscriptionsCount,
    drop_sell_through: drops._avg.sellThroughPct ?? 0
  }
}

async function fetchConsistencySignals(
  prisma: PrismaClient,
  artistId: string,
): Promise<ConsistencyRow> {
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const [uploadsCount, blogPostsCount, livestreamsCount, commissions] = await Promise.all([
    prisma.artwork.count({
      where: {
        artistId,
        createdAt: { gte: thirtyDaysAgo }
      }
    }),
    prisma.blogPost.count({
      where: {
        artistId,
        createdAt: { gte: thirtyDaysAgo }
      }
    }),
    prisma.livestream.count({
      where: {
        artistId,
        startedAt: { gte: thirtyDaysAgo }
      }
    }),
    prisma.commission.findMany({
      where: {
        artistId,
        createdAt: { gte: thirtyDaysAgo }
      },
      select: { respondedWithin24h: true }
    })
  ])

  let commissionResponseRate = 100
  if (commissions.length > 0) {
    const responded = commissions.filter((c: any) => c.respondedWithin24h).length
    commissionResponseRate = (responded / commissions.length) * 100
  }

  const profile = await prisma.artistProfile.findUnique({
    where: { id: artistId },
    select: { uploadStreakDays: true }
  })

  return {
    upload_streak_days: profile?.uploadStreakDays ?? 0,
    uploads_30d: uploadsCount,
    blog_posts_30d: blogPostsCount,
    livestream_sessions_30d: livestreamsCount,
    commission_response_rate: commissionResponseRate
  }
}

async function fetchReputationSignals(
  prisma: PrismaClient,
  artistId: string,
): Promise<ReputationRow> {
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const ninetyDaysAgo = new Date()
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)

  const [reviewsAvg, commissions90d, reportsCount, disputes] = await Promise.all([
    prisma.review.aggregate({
      where: { artistId },
      _avg: { rating: true }
    }),
    prisma.commission.findMany({
      where: {
        artistId,
        createdAt: { gte: ninetyDaysAgo }
      },
      select: { status: true }
    }),
    prisma.report.count({
      where: {
        targetId: artistId,
        createdAt: { gte: thirtyDaysAgo }
      }
    }),
    prisma.dispute.findMany({
      where: { artistId },
      select: { resolution: true }
    })
  ])

  let commissionCompletionRate = 100
  if (commissions90d.length > 0) {
    const completed = commissions90d.filter((c: any) => c.status === 'completed').length
    commissionCompletionRate = (completed / commissions90d.length) * 100
  }

  let disputeResolutionRate = 100
  if (disputes.length > 0) {
    const resolved = disputes.filter((d: any) => d.resolution === 'resolved').length
    disputeResolutionRate = (resolved / disputes.length) * 100
  }

  const profile = await prisma.artistProfile.findUnique({
    where: { id: artistId },
    select: { followerQualityScore: true }
  })

  return {
    review_average: String(reviewsAvg._avg.rating ?? 0),
    commission_completion_rate: commissionCompletionRate,
    report_count_30d: reportsCount,
    dispute_resolution_rate: disputeResolutionRate,
    follower_quality_score: profile?.followerQualityScore ?? 100
  }
}

async function fetchArtistProfile(
  prisma: PrismaClient,
  artistId: string,
): Promise<ArtistProfileRow> {
  const row = await prisma.artistProfile.findUnique({
    where: { id: artistId }
  })
  if (!row) {
    throw new Error(`ArtistProfile not found for ID: ${artistId}`)
  }
  return row as unknown as ArtistProfileRow
}

// ── Batch collector ────────────────────────────────────────

/**
 * Collect signals for all active artists in parallel batches.
 * Used by the nightly ranking cron job. Database-agnostic.
 */
export async function collectAllArtistSignals(
  prisma: PrismaClient,
  batchSize = 50,
): Promise<RankingInput[]> {
  const oneDayAgo = new Date()
  oneDayAgo.setDate(oneDayAgo.getDate() - 1)

  // Fetch all active artist profiles whose account has been active
  const artists = await prisma.artistProfile.findMany({
    where: {
      isActive: true,
      createdAt: { lt: oneDayAgo }
    },
    select: { id: true },
    orderBy: { id: 'asc' }
  })

  const results: RankingInput[] = []

  // Process in batches to avoid overwhelming the DB
  for (let i = 0; i < artists.length; i += batchSize) {
    const batch = artists.slice(i, i + batchSize)
    const batchResults = await Promise.all(
      batch.map((a: any) => collectRankingSignals(prisma, a.id)),
    )
    results.push(...batchResults)
  }

  return results
}
