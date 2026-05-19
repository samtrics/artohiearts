import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { prisma } from './src/lib/db.ts';

// APS Ranking Engine imports
import { collectAllArtistSignals, batchCalculateAPS, derivePopulationStats } from './src/lib/ranking/index.ts';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-artohie-key-2026';

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// ── JWT Authenticate Middleware ───────────────────────────
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  const supabaseSecret = process.env.SUPABASE_JWT_SECRET || 'super-secret-supabase-jwt-key-2026-placeholder';

  // Try verifying with Supabase JWT Secret first
  jwt.verify(token, supabaseSecret, (err, decoded) => {
    if (!err && decoded) {
      req.user = {
        id: decoded.sub || decoded.id,
        userId: decoded.sub || decoded.userId,
        email: decoded.email
      };
      return next();
    }

    // Fallback to local JWT secret for local tests / seed scripts
    jwt.verify(token, JWT_SECRET, (fallbackErr, localDecoded) => {
      if (fallbackErr) {
        return res.status(403).json({ error: 'Invalid or expired token' });
      }
      req.user = {
        id: localDecoded.id,
        userId: localDecoded.userId,
        email: localDecoded.email
      };
      next();
    });
  });
}

// ── Auth Endpoints ────────────────────────────────────────

// Register a new Creator Profile
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, displayName, tagline, specialty, role, userId } = req.body;
    if (!email || !displayName) {
      return res.status(400).json({ error: 'Email and display name are required' });
    }

    // Check if user already exists
    const existing = await prisma.artistProfile.findFirst({
      where: {
        OR: [
          { tagline: email },
          ...(userId ? [{ userId }] : []),
          ...(userId ? [{ id: userId }] : [])
        ]
      }
    });
    if (existing) {
      return res.status(400).json({ error: 'Creator with this email or identity already exists' });
    }

    let hashedPassword = 'supabase-authenticated';
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }
    const finalUserId = userId || crypto.randomUUID();
    const finalId = userId || crypto.randomUUID();

    const artist = await prisma.artistProfile.create({
      data: {
        id: finalId,
        userId: finalUserId,
        displayName,
        tagline: email, // Store email here for authentication
        bio: hashedPassword, // Store hashed password in bio for credentials
        websiteUrl: specialty || 'Digital Visual Creator',
        role: role || 'artist', // Save user role
        apsScore: 0,
        apsTier: 'novice',
        verificationTier: 0,
        followerQualityScore: 100,
        profileCompleteness: 15,
        bioCompleteness: 10,
        isActive: true,
        isVerified: false,
        isFeaturedEditorial: false,
        hasSoldFirstArtwork: false,
        hasContentViolation: false,
      }
    });

    const token = jwt.sign({ id: artist.id, userId: finalUserId, email }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, artist: { id: artist.id, displayName: artist.displayName, apsScore: artist.apsScore, apsTier: artist.apsTier } });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed', details: error.message });
  }
});

// Login Creator
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const artist = await prisma.artistProfile.findFirst({
      where: { tagline: email }
    });

    if (!artist || !artist.bio) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const valid = await bcrypt.compare(password, artist.bio);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: artist.id, userId: artist.userId, email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({
      token,
      artist: {
        id: artist.id,
        displayName: artist.displayName,
        apsScore: artist.apsScore,
        apsTier: artist.apsTier,
        avatarUrl: artist.avatarUrl
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed', details: error.message });
  }
});

// Get Current User Profile
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const artist = await prisma.artistProfile.findUnique({
      where: { id: req.user.id }
    });
    if (!artist) {
      return res.status(404).json({ error: 'Creator profile not found' });
    }
    res.json(artist);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch current profile details' });
  }
});

// ── Rankings Endpoints ────────────────────────────────────

// Global Rankings Leaderboard (Database-Agnostic)
app.get('/api/rankings', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page ?? '1'));
    const limit = Math.min(100, Math.max(10, parseInt(req.query.limit ?? '20')));
    const tier = req.query.tier;
    const offset = (page - 1) * limit;

    // Find the latest calculated date in database in database-agnostic way
    const latestRanking = await prisma.ranking.findFirst({
      orderBy: { rankingDate: 'desc' },
      select: { rankingDate: true }
    });

    const latestDate = latestRanking?.rankingDate;

    if (!latestDate) {
      return res.json({ data: [], pagination: { page, limit, total: 0, pages: 0 } });
    }

    const targetDate = new Date(latestDate).toISOString().slice(0, 10);
    
    // Fetch rankings and join profile details
    const rankings = await prisma.ranking.findMany({
      where: {
        rankingDate: new Date(targetDate),
        ...(tier ? { tier } : {})
      },
      orderBy: { totalScore: 'desc' },
      include: {
        artist: {
          select: {
            displayName: true,
            avatarUrl: true,
            tagline: true,
            websiteUrl: true,
            followerCount: true
          }
        }
      },
      skip: offset,
      take: limit
    });

    const total = await prisma.ranking.count({
      where: {
        rankingDate: new Date(targetDate),
        ...(tier ? { tier } : {})
      }
    });

    const data = rankings.map((r, index) => ({
      artist_id: r.artistId,
      total_score: r.totalScore,
      tier: r.tier,
      tier_label: r.tierLabel,
      momentum: r.momentum,
      score_delta_24h: r.scoreDelta24h,
      percentile: r.percentile,
      engagement_score: r.engagementScore,
      quality_score: r.qualityScore,
      sales_score: r.salesScore,
      display_name: r.artist.displayName,
      avatar_url: r.artist.avatarUrl,
      tagline: r.artist.tagline,
      specialty: r.artist.websiteUrl,
      follower_count: r.artist.followerCount,
      global_rank: offset + index + 1
    }));

    res.json({
      data,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Fetch rankings error:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard rankings', details: error.message });
  }
});

// Trending Artists (Database-Agnostic)
app.get('/api/rankings/trending', async (req, res) => {
  try {
    const limit = Math.min(50, parseInt(req.query.limit ?? '20'));

    const latestRanking = await prisma.ranking.findFirst({
      orderBy: { rankingDate: 'desc' },
      select: { rankingDate: true }
    });
    const latestDate = latestRanking?.rankingDate;
    if (!latestDate) return res.json({ data: [] });
    const targetDate = new Date(latestDate).toISOString().slice(0, 10);

    const sevenDaysAgoDate = new Date(targetDate);
    sevenDaysAgoDate.setDate(sevenDaysAgoDate.getDate() - 7);

    // Fetch both datasets to do in-memory join
    const todayRankings = await prisma.ranking.findMany({
      where: { rankingDate: new Date(targetDate) },
      include: {
        artist: {
          select: {
            displayName: true,
            avatarUrl: true,
            tagline: true
          }
        }
      }
    });

    const pastRankings = await prisma.ranking.findMany({
      where: { rankingDate: { gte: sevenDaysAgoDate, lte: sevenDaysAgoDate } }
    });

    const pastMap = new Map(pastRankings.map(r => [r.artistId, r.totalScore]));
    const trending = todayRankings.map(r => {
      const scoreToday = r.totalScore;
      const score7dAgo = pastMap.get(r.artistId) ?? 0;
      const delta7d = scoreToday - score7dAgo;
      const pctChange7d = score7dAgo === 0 ? 100 : Math.round((delta7d / score7dAgo) * 100 * 10) / 10;
      return {
        artist_id: r.artistId,
        display_name: r.artist.displayName,
        avatar_url: r.artist.avatarUrl,
        tagline: r.artist.tagline,
        score_today: scoreToday,
        score_7d_ago: score7dAgo,
        current_tier: r.tier,
        delta_7d: delta7d,
        pct_change_7d: pctChange7d
      };
    })
    .filter(item => item.delta_7d > 0)
    .sort((a, b) => b.delta_7d - a.delta_7d)
    .slice(0, limit);

    res.json({ data: trending });
  } catch (error) {
    console.error('Fetch trending error:', error);
    res.status(500).json({ error: 'Failed to fetch trending artists', details: error.message });
  }
});

// Category Rankings (Database-Agnostic)
app.get('/api/rankings/category/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const limit = Math.min(50, parseInt(req.query.limit ?? '20'));

    const latestRanking = await prisma.ranking.findFirst({
      orderBy: { rankingDate: 'desc' },
      select: { rankingDate: true }
    });
    const latestDate = latestRanking?.rankingDate;
    if (!latestDate) return res.json({ category: slug, data: [] });
    const targetDate = new Date(latestDate).toISOString().slice(0, 10);

    const category = await prisma.category.findUnique({
      where: { slug }
    });
    if (!category) return res.json({ category: slug, data: [] });

    const artworkCategories = await prisma.artworkCategory.findMany({
      where: { categoryId: category.id }
    });
    const artworkIds = artworkCategories.map(ac => ac.artworkId);

    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const artworks = await prisma.artwork.findMany({
      where: {
        id: { in: artworkIds },
        createdAt: { gte: ninetyDaysAgo }
      },
      select: { artistId: true }
    });

    const artistIds = Array.from(new Set(artworks.map(a => a.artistId)));
    if (artistIds.length === 0) return res.json({ category: slug, data: [] });

    const rankings = await prisma.ranking.findMany({
      where: {
        rankingDate: new Date(targetDate),
        artistId: { in: artistIds }
      },
      include: {
        artist: {
          select: {
            displayName: true,
            avatarUrl: true
          }
        }
      }
    });

    const data = rankings.map(r => {
      const categoryScore = r.qualityScore * 0.35 +
                            r.salesScore * 0.30 +
                            r.engagementScore * 0.20 +
                            ((r.consistencyScore + r.reputationScore + r.profileStrengthScore) / 3.0) * 0.15;
      return {
        artist_id: r.artistId,
        display_name: r.artist.displayName,
        avatar_url: r.artist.avatarUrl,
        total_score: r.totalScore,
        quality_score: r.qualityScore,
        sales_score: r.salesScore,
        tier: r.tier,
        momentum: r.momentum,
        category_score: Math.round(categoryScore * 100) / 100
      };
    })
    .sort((a, b) => b.category_score - a.category_score)
    .slice(0, limit)
    .map((item, index) => ({
      ...item,
      category_rank: index + 1
    }));

    res.json({ category: slug, data });
  } catch (error) {
    console.error('Fetch category rankings error:', error);
    res.status(500).json({ error: 'Failed to fetch category rankings', details: error.message });
  }
});

// Single Artist Score Breakdown + History (Database-Agnostic)
app.get('/api/rankings/:artistId', async (req, res) => {
  try {
    const { artistId } = req.params;

    const latestRanking = await prisma.ranking.findFirst({
      orderBy: { rankingDate: 'desc' },
      select: { rankingDate: true }
    });
    const latestDate = latestRanking?.rankingDate;
    if (!latestDate) return res.status(404).json({ error: 'No rankings calculated yet' });
    const targetDate = new Date(latestDate).toISOString().slice(0, 10);

    const currentRanking = await prisma.ranking.findUnique({
      where: {
        artistId_rankingDate: {
          artistId,
          rankingDate: new Date(targetDate)
        }
      }
    });

    if (!currentRanking) {
      // Return a basic placeholder structure for yesterday's scores to avoid crashes on brand new registers
      const artist = await prisma.artistProfile.findUnique({ where: { id: artistId } });
      if (!artist) return res.status(404).json({ error: 'Artist not found' });
      
      return res.json({
        current: {
          artist_id: artistId,
          total_score: artist.apsScore,
          tier: artist.apsTier,
          tier_label: artist.apsTier.toUpperCase(),
          global_rank: 0,
          tier_artist_count: 1,
          percentile: 50,
          score_delta_24h: 0,
          momentum: 'stable',
          pillarBreakdown: {},
          decayPenalties: [],
          bonusMultipliers: []
        },
        history: []
      });
    }

    const globalRank = await prisma.ranking.count({
      where: {
        rankingDate: new Date(targetDate),
        totalScore: { gt: currentRanking.totalScore }
      }
    }) + 1;

    const tierArtistCount = await prisma.ranking.count({
      where: {
        rankingDate: new Date(targetDate),
        tier: currentRanking.tier
      }
    });

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const historyRows = await prisma.ranking.findMany({
      where: {
        artistId,
        rankingDate: { gte: thirtyDaysAgo }
      },
      select: {
        rankingDate: true,
        totalScore: true,
        tier: true,
        scoreDelta24h: true,
        momentum: true,
        engagementScore: true,
        qualityScore: true,
        salesScore: true
      },
      orderBy: { rankingDate: 'asc' }
    });

    const current = {
      id: currentRanking.id,
      artist_id: currentRanking.artistId,
      ranking_date: currentRanking.rankingDate,
      total_score: currentRanking.totalScore,
      tier: currentRanking.tier,
      tier_label: currentRanking.tierLabel,
      engagement_score: currentRanking.engagementScore,
      quality_score: currentRanking.qualityScore,
      sales_score: currentRanking.salesScore,
      consistency_score: currentRanking.consistencyScore,
      reputation_score: currentRanking.reputationScore,
      profile_strength_score: currentRanking.profileStrengthScore,
      decay_factor: currentRanking.decayFactor,
      bonus_multiplier: currentRanking.bonusMultiplier,
      percentile: currentRanking.percentile,
      score_delta_24h: currentRanking.scoreDelta24h,
      momentum: currentRanking.momentum,
      global_rank: globalRank,
      tier_artist_count: tierArtistCount,
      pillarBreakdown: typeof currentRanking.pillarBreakdown === 'string' ? JSON.parse(currentRanking.pillarBreakdown) : currentRanking.pillarBreakdown,
      decayPenalties: typeof currentRanking.decayPenalties === 'string' ? JSON.parse(currentRanking.decayPenalties) : currentRanking.decayPenalties,
      bonusMultipliers: typeof currentRanking.bonusMultipliers === 'string' ? JSON.parse(currentRanking.bonusMultipliers) : currentRanking.bonusMultipliers
    };

    const history = historyRows.map(h => ({
      ranking_date: h.rankingDate,
      total_score: h.totalScore,
      tier: h.tier,
      score_delta_24h: h.scoreDelta24h,
      momentum: h.momentum,
      engagement_score: h.engagementScore,
      quality_score: h.qualityScore,
      sales_score: h.salesScore
    }));

    res.json({ current, history });
  } catch (error) {
    console.error('Fetch artist ranking details error:', error);
    res.status(500).json({ error: 'Failed to fetch artist ranking details', details: error.message });
  }
});

// ── Artist & Profiles Endpoints ───────────────────────────

// Get all active artists
app.get('/api/artists', async (req, res) => {
  try {
    const artists = await prisma.artistProfile.findMany({
      where: { isActive: true },
      orderBy: { apsScore: 'desc' }
    });
    res.json(artists);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch creators' });
  }
});

// Get single artist details (Database-Agnostic)
app.get('/api/artists/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const artist = await prisma.artistProfile.findUnique({
      where: { id },
      include: {
        artworks: true,
        achievements: true
      }
    });

    if (!artist) {
      return res.status(404).json({ error: 'Creator not found' });
    }

    const reviews = await prisma.review.findMany({
      where: { artistId: id },
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    const blogPosts = await prisma.blogPost.findMany({
      where: { artistId: id },
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    res.json({
      ...artist,
      reviews,
      blogPosts
    });
  } catch (error) {
    console.error('Fetch artist details error:', error);
    res.status(500).json({ error: 'Failed to fetch creator profile details', details: error.message });
  }
});

// Update profile details (calculates completeness metric!)
app.put('/api/artists/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    if (req.user.id !== id) {
      return res.status(403).json({ error: 'Unauthorised to update this profile' });
    }

    const { displayName, bio, websiteUrl, customDomainActive, portfolioSiteActive, exhibitionCount } = req.body;

    // Calculate dynamic completeness score
    let completeness = 20; // base value
    if (bio && bio.length > 50) completeness += 20;
    if (websiteUrl) completeness += 15;
    if (customDomainActive) completeness += 15;
    if (portfolioSiteActive) completeness += 15;
    if (exhibitionCount > 0) completeness += 15;
    completeness = Math.min(100, completeness);

    const updated = await prisma.artistProfile.update({
      where: { id },
      data: {
        displayName,
        websiteUrl,
        customDomainActive: !!customDomainActive,
        portfolioSiteActive: !!portfolioSiteActive,
        exhibitionCount: exhibitionCount ? parseInt(exhibitionCount) : 0,
        profileCompleteness: completeness,
        bioCompleteness: bio ? Math.min(100, Math.floor(bio.length / 2)) : 0,
        lastEngagementAt: new Date()
      }
    });

    res.json(updated);
  } catch (error) {
    console.error('Update profile details error:', error);
    res.status(500).json({ error: 'Failed to update creator profile' });
  }
});

// ── Artwork Marketplace Endpoints ──────────────────────────

// Browse all artworks with filters (Database-Agnostic)
app.get('/api/artworks', async (req, res) => {
  try {
    const { category } = req.query;
    let whereClause = {};

    if (category) {
      const cat = await prisma.category.findUnique({
        where: { slug: category }
      });
      if (cat) {
        const artworkCategories = await prisma.artworkCategory.findMany({
          where: { categoryId: cat.id }
        });
        const artworkIds = artworkCategories.map(ac => ac.artworkId);
        whereClause.id = { in: artworkIds };
      } else {
        return res.json([]);
      }
    }

    const artworks = await prisma.artwork.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      include: {
        artist: {
          select: {
            displayName: true,
            avatarUrl: true
          }
        }
      }
    });

    const rows = artworks.map(aw => ({
      id: aw.id,
      artist_id: aw.artistId,
      price_tier: aw.priceTier,
      created_at: aw.createdAt,
      artist_name: aw.artist.displayName,
      artist_avatar: aw.artist.avatarUrl
    }));

    res.json(rows);
  } catch (error) {
    console.error('Browse artworks error:', error);
    res.status(500).json({ error: 'Failed to fetch artworks', details: error.message });
  }
});

// Create an Artwork Listing
app.post('/api/artworks', authenticateToken, async (req, res) => {
  try {
    const artistId = req.user.id;
    const { priceTier, categorySlug } = req.body;

    // Verify user has the artist role
    const profile = await prisma.artistProfile.findUnique({
      where: { id: artistId }
    });

    if (!profile || profile.role !== 'artist') {
      return res.status(403).json({ error: 'Only accounts with the "artist" role can publish artworks' });
    }

    const artwork = await prisma.artwork.create({
      data: {
        artistId,
        priceTier: priceTier ? parseInt(priceTier) : 1,
        createdAt: new Date()
      }
    });

    // Increment Uploads metrics & streaks
    await prisma.artistProfile.update({
      where: { id: artistId },
      data: {
        lastUploadAt: new Date(),
        uploadStreakDays: { increment: 1 }
      }
    });

    // Map Category if specified
    if (categorySlug) {
      let category = await prisma.category.findUnique({ where: { slug: categorySlug } });
      if (!category) {
        category = await prisma.category.create({ data: { slug: categorySlug } });
      }
      await prisma.artworkCategory.create({
        data: {
          artworkId: artwork.id,
          categoryId: category.id
        }
      });
    }

    res.status(201).json(artwork);
  } catch (error) {
    console.error('Create artwork listing error:', error);
    res.status(500).json({ error: 'Failed to list new artwork' });
  }
});

// Record a purchase order
app.post('/api/orders', authenticateToken, async (req, res) => {
  try {
    const buyerId = req.user.id;
    const { artistId, artworkId, amountUsd, orderType } = req.body;

    if (!artistId || !amountUsd) {
      return res.status(400).json({ error: 'Artist ID and amount are required' });
    }

    const order = await prisma.order.create({
      data: {
        buyerId,
        artistId,
        artworkId,
        amountUsd: parseFloat(amountUsd),
        orderType: orderType || 'artwork',
        createdAt: new Date()
      }
    });

    // Update first sale state for the artist
    await prisma.artistProfile.update({
      where: { id: artistId },
      data: {
        hasSoldFirstArtwork: true
      }
    });

    res.status(201).json(order);
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Failed to record purchase order' });
  }
});

// ── Commissions Endpoints ─────────────────────────────────

// Create custom commission request
app.post('/api/commissions', authenticateToken, async (req, res) => {
  try {
    const buyerId = req.user.id;
    const { artistId } = req.body;

    if (!artistId) {
      return res.status(400).json({ error: 'Artist ID is required' });
    }

    const commission = await prisma.commission.create({
      data: {
        artistId,
        status: 'pending',
        respondedWithin24h: false,
        createdAt: new Date()
      }
    });

    res.status(201).json(commission);
  } catch (error) {
    res.status(500).json({ error: 'Failed to file commission request' });
  }
});

// Update Commission status (accepted/completed)
app.put('/api/commissions/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, respondedWithin24h } = req.body;

    const updated = await prisma.commission.update({
      where: { id },
      data: {
        status,
        respondedWithin24h: !!respondedWithin24h
      }
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update commission request status' });
  }
});

// ── Community Feed Endpoints ──────────────────────────────

// Fetch feed items
app.get('/api/feed', async (req, res) => {
  try {
    const activePulse = [
      'Elena Rostova uploaded Prism Echoes.',
      'Julian Chen cross-checked follower statistics.',
      'Amara Okafor reached Emerging Tier milestone.',
      'Sofia Laurent listed a traditional sketchbook.',
      'Julian Chen completed Obsidian Flux commission.'
    ];
    res.json({ pulse: activePulse });
  } catch (error) {
    res.status(500).json({ error: 'Failed to load community feed pulses' });
  }
});

// Like artwork / feed posts
app.post('/api/feed/like', authenticateToken, async (req, res) => {
  try {
    const { artworkId } = req.body;
    if (!artworkId) return res.status(400).json({ error: 'Artwork ID is required' });

    const like = await prisma.like.create({
      data: {
        artworkId,
        createdAt: new Date()
      }
    });

    res.status(201).json(like);
  } catch (error) {
    res.status(500).json({ error: 'Failed to record engagement like' });
  }
});

// ── Nightly APS Cron Calculations ──────────────────────────

app.get('/api/cron/ranking', async (req, res) => {
  const auth = req.headers['authorization'];
  const cronSecret = process.env.CRON_SECRET || 'artohie_cron_secret_token_123';
  
  if (process.env.NODE_ENV === 'production' && auth !== `Bearer ${cronSecret}`) {
    return res.status(401).json({ error: 'Unauthorised cron execution' });
  }

  console.log('[APS Backend Server] Starting APS nightly ranking calculation...');
  const startTime = Date.now();

  try {
    // 1. Fetch previous day's rankings for momentum calculations
    const previousScores = await fetchPreviousScores(prisma);

    // 2. Fetch signals for all active artists
    console.log('[APS Backend Server] Collecting Signals...');
    const inputs = await collectAllArtistSignals(prisma);
    console.log(`[APS Backend Server] Collected signals for ${inputs.length} artists`);

    if (inputs.length === 0) {
      return res.json({ success: true, message: 'No active artists to calculate.' });
    }

    // 3. First pass: run computations without population density
    const firstPassResults = await batchCalculateAPS(inputs, previousScores);

    // 4. Derive platform-wide population density statistics
    const population = derivePopulationStats(firstPassResults.map(r => r.totalScore));

    // 5. Second pass: compute percentiles dynamically with population metrics
    const finalRankings = await batchCalculateAPS(inputs, previousScores, population);

    // 6. Write daily results to rankings table
    console.log('[APS Backend Server] Saving calculated daily rankings...');
    await persistRankingResults(prisma, finalRankings);

    // 7. Update artist_profiles fast read cache fields
    await updateArtistProfileTiers(prisma, finalRankings);

    // 8. Queue tier change notifications
    await queueTierChangeNotifications(prisma, finalRankings, previousScores);

    const elapsed = Date.now() - startTime;
    console.log(`[APS Backend Server] Nightly calculations completed in ${elapsed}ms`);

    res.json({
      success: true,
      artistsRanked: finalRankings.length,
      elapsedMs: elapsed,
      populationStats: population
    });
  } catch (error) {
    console.error('[APS Backend Server] Cron job execution encountered a fatal error:', error);
    res.status(500).json({ error: 'Nightly calculations failed', details: String(error) });
  }
});

// ── Cron Query & Mutation Helpers ──────────────────────────

async function fetchPreviousScores(db) {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const targetDate = yesterday.toISOString().slice(0, 10);

  const rankings = await db.ranking.findMany({
    where: { rankingDate: new Date(targetDate) }
  });
  return new Map(rankings.map(r => [r.artistId, r.totalScore]));
}

async function persistRankingResults(db, results) {
  const today = new Date().toISOString().slice(0, 10);
  const rankingDate = new Date(today);

  for (const r of results) {
    await db.ranking.upsert({
      where: {
        artistId_rankingDate: {
          artistId: r.artistId,
          rankingDate
        }
      },
      update: {
        totalScore:           r.totalScore,
        tier:                  r.tier,
        tierLabel:            r.tierLabel,
        engagementScore:      r.pillars.engagement.raw,
        qualityScore:         r.pillars.quality.raw,
        salesScore:           r.pillars.sales.raw,
        consistencyScore:     r.pillars.consistency.raw,
        reputationScore:      r.pillars.reputation.raw,
        profileStrengthScore: r.pillars.profileStrength.raw,
        decayFactor:          r.totalDecayFactor,
        bonusMultiplier:      r.totalBonusMultiplier,
        percentile:            r.percentileEstimate,
        scoreDelta24h:       r.scoreDelta24h,
        momentum:              r.momentum,
        pillarBreakdown:      JSON.stringify(r.pillars),
        decayPenalties:       JSON.stringify(r.decayPenalties),
        bonusMultipliers:     JSON.stringify(r.bonusMultipliers),
        calculatedAt:         new Date()
      },
      create: {
        artistId:             r.artistId,
        rankingDate,
        totalScore:           r.totalScore,
        tier:                  r.tier,
        tierLabel:            r.tierLabel,
        engagementScore:      r.pillars.engagement.raw,
        qualityScore:         r.pillars.quality.raw,
        salesScore:           r.pillars.sales.raw,
        consistencyScore:     r.pillars.consistency.raw,
        reputationScore:      r.pillars.reputation.raw,
        profileStrengthScore: r.pillars.profileStrength.raw,
        decayFactor:          r.totalDecayFactor,
        bonusMultiplier:      r.totalBonusMultiplier,
        percentile:            r.percentileEstimate,
        scoreDelta24h:       r.scoreDelta24h,
        momentum:              r.momentum,
        pillarBreakdown:      JSON.stringify(r.pillars),
        decayPenalties:       JSON.stringify(r.decayPenalties),
        bonusMultipliers:     JSON.stringify(r.bonusMultipliers),
        calculatedAt:         new Date()
      }
    });
  }
}

async function updateArtistProfileTiers(db, results) {
  for (const r of results) {
    await db.artistProfile.update({
      where: { id: r.artistId },
      data: {
        apsScore: r.totalScore,
        apsTier: r.tier,
        apsUpdatedAt: new Date()
      }
    });
  }
}

async function queueTierChangeNotifications(db, results, previousScores) {
  const tierChanges = results.filter(r => {
    const prev = previousScores.get(r.artistId) ?? 0;
    const prevTier = getTierForScore(prev);
    return prevTier !== r.tier;
  });

  if (tierChanges.length === 0) return;

  for (const r of tierChanges) {
    const title = `You've reached ${r.tierEmoji} ${r.tierLabel}!`;
    const body = `Your Artohie Prestige Score is now ${r.totalScore}. Keep creating to climb higher.`;
    const data = { tier: r.tier, score: r.totalScore };

    const artist = await db.artistProfile.findUnique({
      where: { id: r.artistId },
      select: { userId: true }
    });

    if (artist) {
      await db.notification.create({
        data: {
          userId: artist.userId,
          type: 'tier_change',
          title,
          body,
          data: JSON.stringify(data),
          createdAt: new Date()
        }
      });
    }
  }
}

function getTierForScore(score) {
  if (score >= 900) return 'prestige';
  if (score >= 750) return 'elite';
  if (score >= 600) return 'established';
  if (score >= 400) return 'rising';
  if (score >= 200) return 'emerging';
  return 'novice';
}

// ── Start Server ──────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 Artohie Backend Server is up on port ${PORT}`);
  console.log(`📁 Environment: ${process.env.NODE_ENV}`);
  console.log(`APS Core Calculating Cron: http://localhost:${PORT}/api/cron/ranking`);
  console.log(`======================================================\n`);
});
