import { prisma } from './src/lib/db.ts';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { calculateAPSScore, derivePopulationStats } from './src/lib/ranking/index.ts';

const creators = [
  {
    name: 'Elena Rostova',
    email: 'elena@artohie.com',
    specialty: 'Fluid digital forms, couture color, collectible light studies',
    location: 'Florence, Italy',
    followers: 128000,
    sales: 420000,
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAqgzW8g9vVev-WhVxsFTg0GBOtCmwxFJvPrQoekQ5Jx3_IKhwE_9VfKIVBlVeylflV4ZK5uCxB5PB7bJrZ2ClBti-JXhT4eXq4UVIwgNDz7iuMqnGkSadQJla_o9GsGzE1Sas0CjHWiVfqI8_f6bL0Zol1l4s_OTXhiRSD9OxRTRXF6dNRSTBzhB74aoJYhVR20dYarOPCCnRKquVyfcb4zSU8YVNwbRR43lV0Bzm4azbwv8bTr3XnNMes5QzYq39lzqUah3tQ2ak',
    signals: {
      likesReceived7d: 480,
      commentsReceived7d: 180,
      savesToCollections7d: 140,
      repostsAndShares7d: 90,
      profileVisitsUnique7d: 1950,
      storyViews7d: 4900,
      aiCompositionScore: 92,
      peerReviewAverage: 4.8,
      collectionPlacements: 42,
      editorialFeatures: 8,
      highResFidelityScore: 98,
      originalityScore: 96,
      artworksSold30d: 14,
      commissionRevenue30d: 8500,
      averageSalePriceTier: 4,
      repeatBuyers: 8,
      subscriptionMembers: 320,
      limitedDropPerformance: 95,
      uploadStreakDays: 45,
      uploadsLast30d: 8,
      blogPostsLast30d: 3,
      livestreamSessions30d: 4,
      commissionResponseRate: 98,
      collectorReviewAverage: 5.0,
      commissionCompletionRate: 100,
      verificationTier: 3,
      disputeResolutionRate: 100,
      reportCount30d: 0,
      followerQualityScore: 98,
      bioCompleteness: 90,
      portfolioSiteActive: true,
      socialLinksVerified: 4,
      customDomainActive: true,
      artistStatementFilled: true,
      exhibitionHistory: 18
    }
  },
  {
    name: 'Julian Chen',
    email: 'julian@artohie.com',
    specialty: 'Generative light artist, luxury abstracts, tactile visual fields',
    location: 'Tokyo, Japan',
    followers: 94000,
    sales: 310000,
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAIjBVm5Jd-JOCSrI1lCCvBabEssgkz25-QOzgnrSW81ECjPjfjOVfBygD6RhGHjoXZ1-DfD1FLvMvfuYadQfZsF1cYi5DL9S-Gsgxz_fI6sNVPOwLVcU2mry92aQtd19Jc-eR2gBvJ7yOZKmHBLoGVfway_SA3UtJoGKE06hA4KZ67_cQOpP2ELy3xeGTldekvB5ufk7RN13TW7OM5yO2E6uerKSWDO61QQ5H4WvMWk1dCl3jjSwnUE52e2OVH2iJ28Vw-aXzqhDQ',
    signals: {
      likesReceived7d: 420,
      commentsReceived7d: 150,
      savesToCollections7d: 110,
      repostsAndShares7d: 75,
      profileVisitsUnique7d: 1650,
      storyViews7d: 3800,
      aiCompositionScore: 89,
      peerReviewAverage: 4.6,
      collectionPlacements: 35,
      editorialFeatures: 6,
      highResFidelityScore: 95,
      originalityScore: 94,
      artworksSold30d: 10,
      commissionRevenue30d: 6800,
      averageSalePriceTier: 5,
      repeatBuyers: 6,
      subscriptionMembers: 210,
      limitedDropPerformance: 90,
      uploadStreakDays: 32,
      uploadsLast30d: 6,
      blogPostsLast30d: 2,
      livestreamSessions30d: 3,
      commissionResponseRate: 95,
      collectorReviewAverage: 4.9,
      commissionCompletionRate: 100,
      verificationTier: 2,
      disputeResolutionRate: 100,
      reportCount30d: 0,
      followerQualityScore: 95,
      bioCompleteness: 85,
      portfolioSiteActive: true,
      socialLinksVerified: 3,
      customDomainActive: false,
      artistStatementFilled: true,
      exhibitionHistory: 12
    }
  },
  {
    name: 'Amara Okafor',
    email: 'amara@artohie.com',
    specialty: 'Watercolor dynamics, organic curves, modern portrait studies',
    location: 'Lagos, Nigeria',
    followers: 76000,
    sales: 186000,
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDay0gp5_DamMWxxhvyAc4YRRgiFxtEDlwFflH1Q2ne1z9TF-xjfNpt3V58NOZvoMyWPalhv6u1NZTm8gl-HtLPfh0vWetLoXLEOvjxzsv269TsdpGP1Ikmvwg9gzPtIqY7gm_EL6LCocScfeTB2A2u2PuJ_WqyNuBQjhiedozo8-AHI6gDm73xBQAEhQPaerJ91fa5tPpzrWAe6BVUtWGEXVOk8LQ6IoTFg6czR5yYrAhrwau_lyloNo2lrTIhDqL7IG0fWJCrF8c',
    signals: {
      likesReceived7d: 310,
      commentsReceived7d: 90,
      savesToCollections7d: 85,
      repostsAndShares7d: 45,
      profileVisitsUnique7d: 1100,
      storyViews7d: 2500,
      aiCompositionScore: 82,
      peerReviewAverage: 4.3,
      collectionPlacements: 18,
      editorialFeatures: 3,
      highResFidelityScore: 90,
      originalityScore: 92,
      artworksSold30d: 7,
      commissionRevenue30d: 3400,
      averageSalePriceTier: 3,
      repeatBuyers: 4,
      subscriptionMembers: 110,
      limitedDropPerformance: 75,
      uploadStreakDays: 14,
      uploadsLast30d: 5,
      blogPostsLast30d: 1,
      livestreamSessions30d: 1,
      commissionResponseRate: 90,
      collectorReviewAverage: 4.8,
      commissionCompletionRate: 95,
      verificationTier: 1,
      disputeResolutionRate: 100,
      reportCount30d: 1,
      followerQualityScore: 92,
      bioCompleteness: 80,
      portfolioSiteActive: false,
      socialLinksVerified: 2,
      customDomainActive: false,
      artistStatementFilled: true,
      exhibitionHistory: 6
    }
  },
  {
    name: 'Sofia Laurent',
    email: 'sofia@artohie.com',
    specialty: 'Minimal line studies, Paris architectural prints, delicate visual flows',
    location: 'Paris, France',
    followers: 52000,
    sales: 112000,
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAE1zLD8_rGJFq2uk7FDI1Pi76VkMdo0YbRW5Opz36ZYdch2ctC01FVqSlM-puJzAY5jkBZRPwiL66m_8Fp0jqRTESkwsn3q5upamAY48p1kV9aASlayHcnpKGTo_BlcEC-xI3ZTjVnOX0-S90WBAFRcrXUXiU-6-_xD-YLCfBRvmZB6-toEXznxHMLVLaqksHxbUzxImy1Pb9dwO60ZxWlgom0h0dhInMQGFGH2STOmCIkLD04vhWUwCCcHQ8j1RuCAut7QyOuYxw',
    signals: {
      likesReceived7d: 190,
      commentsReceived7d: 60,
      savesToCollections7d: 40,
      repostsAndShares7d: 25,
      profileVisitsUnique7d: 820,
      storyViews7d: 1600,
      aiCompositionScore: 78,
      peerReviewAverage: 4.1,
      collectionPlacements: 12,
      editorialFeatures: 2,
      highResFidelityScore: 88,
      originalityScore: 90,
      artworksSold30d: 4,
      commissionRevenue30d: 1800,
      averageSalePriceTier: 2,
      repeatBuyers: 2,
      subscriptionMembers: 45,
      limitedDropPerformance: 60,
      uploadStreakDays: 8,
      uploadsLast30d: 4,
      blogPostsLast30d: 0,
      livestreamSessions30d: 1,
      commissionResponseRate: 85,
      collectorReviewAverage: 4.6,
      commissionCompletionRate: 90,
      verificationTier: 0,
      disputeResolutionRate: 100,
      reportCount30d: 0,
      followerQualityScore: 88,
      bioCompleteness: 70,
      portfolioSiteActive: false,
      socialLinksVerified: 1,
      customDomainActive: false,
      artistStatementFilled: false,
      exhibitionHistory: 3
    }
  }
];

const mockArtworks = [
  { title: 'Prism Echoes', category: 'digital-art', priceTier: 3, artistName: 'Elena Rostova' },
  { title: 'Ethereal Form I', category: 'digital-art', priceTier: 4, artistName: 'Elena Rostova' },
  { title: 'Obsidian Flux', category: 'abstract', priceTier: 5, artistName: 'Julian Chen' },
  { title: 'Shadow Geometry', category: 'abstract', priceTier: 3, artistName: 'Julian Chen' },
  { title: 'Translucent Layers', category: 'portraits', priceTier: 2, artistName: 'Amara Okafor' },
  { title: 'Silent Ascent', category: 'sketches', priceTier: 3, artistName: 'Sofia Laurent' }
];

const mockReviews = [
  { rating: 5.0, collector: 'Mira Al-Khalid', text: 'The piece transformed the room. It has presence without noise, which is exactly what I wanted.', artistName: 'Elena Rostova' },
  { rating: 5.0, collector: 'Theo Laurent', text: 'Elena handled the commission like an exhibition. Every draft felt considered and restraint.', artistName: 'Elena Rostova' },
  { rating: 4.9, collector: 'Ari Chen', text: 'Rare digital work that feels deeply physical. Impeccable certificate and delivery.', artistName: 'Elena Rostova' }
];

async function seed() {
  console.log('🧹 Wiping existing database tables...');
  
  // Wipe child and parent tables in correct order to avoid foreign key constraint violations
  const deleteActions = [
    prisma.ranking.deleteMany(),
    prisma.achievement.deleteMany(),
    prisma.artworkCategory.deleteMany(),
    prisma.artwork.deleteMany(),
    prisma.artistProfile.deleteMany(),
    prisma.category.deleteMany(),
    prisma.like.deleteMany(),
    prisma.comment.deleteMany(),
    prisma.save.deleteMany(),
    prisma.repost.deleteMany(),
    prisma.profileView.deleteMany(),
    prisma.storyView.deleteMany(),
    prisma.order.deleteMany(),
    prisma.subscription.deleteMany(),
    prisma.limitedDrop.deleteMany(),
    prisma.blogPost.deleteMany(),
    prisma.livestream.deleteMany(),
    prisma.commission.deleteMany(),
    prisma.review.deleteMany(),
    prisma.report.deleteMany(),
    prisma.dispute.deleteMany(),
    prisma.notification.deleteMany()
  ];

  for (const action of deleteActions) {
    await action;
  }

  console.log('🌱 Seeding Base Categories...');
  const categories = ['Paintings', 'Digital Art', 'Sketches', 'Anime', 'Luxury Art', 'Abstract', 'Portraits'];
  const categoryMap = new Map();
  
  for (const name of categories) {
    const slug = name.toLowerCase().replace(' ', '-');
    const cat = await prisma.category.create({
      data: { slug }
    });
    categoryMap.set(slug, cat.id);
  }

  console.log('🌱 Seeding Artist Profiles...');
  const artistMap = new Map();
  const passwordHash = await bcrypt.hash('password123', 10);

  for (const c of creators) {
    const artist = await prisma.artistProfile.create({
      data: {
        userId: crypto.randomUUID(),
        displayName: c.name,
        tagline: c.email, // store email in tagline
        bio: passwordHash, // store password in bio
        avatarUrl: c.avatar,
        websiteUrl: c.specialty,
        apsScore: 0,
        apsTier: 'novice',
        verificationTier: c.signals.verificationTier,
        followerQualityScore: c.signals.followerQualityScore,
        followerCount: c.followers,
        uploadStreakDays: c.signals.uploadStreakDays,
        lastUploadAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        lastEngagementAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        profileCompleteness: c.signals.bioCompleteness,
        bioCompleteness: c.signals.bioCompleteness,
        portfolioSiteActive: c.signals.portfolioSiteActive,
        socialLinksVerified: c.signals.socialLinksVerified,
        customDomainActive: c.signals.customDomainActive,
        artistStatementFilled: c.signals.artistStatementFilled,
        exhibitionCount: c.signals.exhibitionHistory,
        isVerified: c.signals.verificationTier >= 2,
        isFeaturedEditorial: c.signals.editorialFeatures > 4,
        hasSoldFirstArtwork: c.sales > 0,
        hasContentViolation: false,
        isActive: true
      }
    });

    artistMap.set(c.name, artist.id);

    // Seed historical reviews
    const reviews = mockReviews.filter(r => r.artistName === c.name);
    for (const r of reviews) {
      await prisma.review.create({
        data: {
          artistId: artist.id,
          rating: r.rating,
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
        }
      });
    }
  }

  console.log('🌱 Seeding Artworks & Linking Categories...');
  for (const art of mockArtworks) {
    const artistId = artistMap.get(art.artistName);
    if (!artistId) continue;

    const artwork = await prisma.artwork.create({
      data: {
        artistId,
        priceTier: art.priceTier,
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) // 10 days ago
      }
    });

    const categoryId = categoryMap.get(art.category);
    if (categoryId) {
      await prisma.artworkCategory.create({
        data: {
          artworkId: artwork.id,
          categoryId
        }
      });
    }

    // Seed mock likes for engagement signals
    for (let l = 0; l < 15; l++) {
      await prisma.like.create({
        data: {
          artworkId: artwork.id,
          createdAt: new Date(Date.now() - l * 6 * 60 * 60 * 1000) // spread out over the last few days
        }
      });
    }
  }

  console.log('🌱 Generating 7-day Historical rankings for beautiful charts...');
  
  // We calculate score history for each of the last 7 days to simulate nightly cron progression
  for (let daysAgo = 7; daysAgo >= 0; daysAgo--) {
    const rankDate = new Date();
    rankDate.setDate(rankDate.getDate() - daysAgo);

    const activeArtists = creators.map(c => {
      const id = artistMap.get(c.name);
      
      // Slightly lower raw scores for older historical days to show positive progress in charts!
      const progressFactor = (7 - daysAgo) / 7.0; // 0.0 to 1.0 multiplier
      const sigs = c.signals;

      const temporalUpload = new Date(rankDate);
      temporalUpload.setDate(temporalUpload.getDate() - 2);
      const temporalEngagement = new Date(rankDate);
      temporalEngagement.setDate(temporalEngagement.getDate() - 1);

      return {
        artistId: id,
        likesReceived7d: Math.round(sigs.likesReceived7d * (0.8 + 0.2 * progressFactor)),
        commentsReceived7d: Math.round(sigs.commentsReceived7d * (0.8 + 0.2 * progressFactor)),
        savesToCollections7d: Math.round(sigs.savesToCollections7d * (0.8 + 0.2 * progressFactor)),
        repostsAndShares7d: Math.round(sigs.repostsAndShares7d * (0.8 + 0.2 * progressFactor)),
        profileVisitsUnique7d: Math.round(sigs.profileVisitsUnique7d * (0.8 + 0.2 * progressFactor)),
        storyViews7d: Math.round(sigs.storyViews7d * (0.8 + 0.2 * progressFactor)),
        aiCompositionScore: sigs.aiCompositionScore,
        peerReviewAverage: sigs.peerReviewAverage,
        collectionPlacements: sigs.collectionPlacements,
        editorialFeatures: sigs.editorialFeatures,
        highResFidelityScore: sigs.highResFidelityScore,
        originalityScore: sigs.originalityScore,
        artworksSold30d: Math.round(sigs.artworksSold30d * (0.7 + 0.3 * progressFactor)),
        commissionRevenue30d: sigs.commissionRevenue30d * (0.7 + 0.3 * progressFactor),
        averageSalePriceTier: sigs.averageSalePriceTier,
        repeatBuyers: Math.round(sigs.repeatBuyers * (0.7 + 0.3 * progressFactor)),
        subscriptionMembers: Math.round(sigs.subscriptionMembers * (0.8 + 0.2 * progressFactor)),
        limitedDropPerformance: sigs.limitedDropPerformance,
        uploadStreakDays: Math.max(1, sigs.uploadStreakDays - daysAgo),
        uploadsLast30d: sigs.uploadsLast30d,
        blogPostsLast30d: sigs.blogPostsLast30d,
        livestreamSessions30d: sigs.livestreamSessions30d,
        commissionResponseRate: sigs.commissionResponseRate,
        collectorReviewAverage: sigs.collectorReviewAverage,
        commissionCompletionRate: sigs.commissionCompletionRate,
        verificationTier: sigs.verificationTier,
        disputeResolutionRate: sigs.disputeResolutionRate,
        reportCount30d: sigs.reportCount30d,
        followerQualityScore: sigs.followerQualityScore,
        bioCompleteness: sigs.bioCompleteness,
        profileCompleteness: sigs.bioCompleteness,
        portfolioSiteActive: sigs.portfolioSiteActive,
        socialLinksVerified: sigs.socialLinksVerified,
        customDomainActive: sigs.customDomainActive,
        artistStatementFilled: sigs.artistStatementFilled,
        exhibitionHistory: sigs.exhibitionHistory,
        lastUploadDate: temporalUpload,
        lastEngagementDate: temporalEngagement,
        accountCreatedDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
        hasContentViolation: false,
        isVerified: sigs.verificationTier >= 2,
        isFeaturedEditorial: sigs.editorialFeatures > 4,
        hasSoldFirstArtwork: true,
        currentStreakDays: Math.max(1, sigs.uploadStreakDays - daysAgo)
      };
    });

    // 1st Pass: Get base calculations
    const baseRankings = activeArtists.map(input => calculateAPSScore(input, 0));
    
    // Derive population statistics for percentiles
    const population = derivePopulationStats(baseRankings.map(r => r.totalScore));

    // 2nd Pass: Finalize calculations with percentiles
    const finalRankings = activeArtists.map(input => calculateAPSScore(input, 0, population));

    // Save rankings record
    for (const r of finalRankings) {
      await prisma.ranking.create({
        data: {
          artistId: r.artistId,
          rankingDate: rankDate,
          calculatedAt: new Date(rankDate),
          totalScore: r.totalScore,
          tier: r.tier,
          tierLabel: r.tierLabel,
          engagementScore: r.pillars.engagement.raw,
          qualityScore: r.pillars.quality.raw,
          salesScore: r.pillars.sales.raw,
          consistencyScore: r.pillars.consistency.raw,
          reputationScore: r.pillars.reputation.raw,
          profileStrengthScore: r.pillars.profileStrength.raw,
          decayFactor: r.totalDecayFactor,
          bonusMultiplier: r.totalBonusMultiplier,
          percentile: r.percentileEstimate,
          scoreDelta24h: daysAgo === 7 ? 0 : Math.round(15 * Math.random()), // mock positive progress
          momentum: daysAgo === 7 ? 'stable' : 'rising',
          pillarBreakdown: JSON.stringify(r.pillars),
          decayPenalties: JSON.stringify(r.decayPenalties),
          bonusMultipliers: JSON.stringify(r.bonusMultipliers)
        }
      });

      // Update artist profiles cache for the latest day (daysAgo = 0)
      if (daysAgo === 0) {
        await prisma.artistProfile.update({
          where: { id: r.artistId },
          data: {
            apsScore: r.totalScore,
            apsTier: r.tier,
            apsUpdatedAt: new Date()
          }
        });
      }
    }
  }

  console.log('\n=========================================');
  console.log('✅ DATABASE SUCCESSFULLY SEEDED WITH APS METRICS');
  console.log('Creators: 4 seeded');
  console.log('Artworks & Categories: Seeded & linked');
  console.log('Historical rankings: 7 days populated');
  console.log('=========================================\n');
}

seed()
  .catch((err) => {
    console.error('Fatal seeding error:', err);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
