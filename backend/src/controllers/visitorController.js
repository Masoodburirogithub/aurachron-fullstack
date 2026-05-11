// backend/src/controllers/visitorController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all visitors with pagination
const getAllVisitors = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    
    const where = search ? {
      OR: [
        { country: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
        { browser: { contains: search, mode: 'insensitive' } },
        { deviceType: { contains: search, mode: 'insensitive' } }
      ]
    } : {};
    
    const [visitors, total] = await Promise.all([
      prisma.visitor.findMany({
        where,
        include: {
          pageViews: {
            orderBy: { createdAt: 'desc' },
            take: 10
          }
        },
        orderBy: { lastVisit: 'desc' },
        skip,
        take: limit
      }),
      prisma.visitor.count({ where })
    ]);
    
    res.json({
      success: true,
      data: visitors,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get visitors error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get visitor by ID
const getVisitorById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const visitor = await prisma.visitor.findUnique({
      where: { id },
      include: {
        pageViews: {
          orderBy: { createdAt: 'desc' }
        },
        events: {
          orderBy: { createdAt: 'desc' },
          take: 50
        }
      }
    });
    
    if (!visitor) {
      return res.status(404).json({ success: false, message: 'Visitor not found' });
    }
    
    res.json({ success: true, data: visitor });
  } catch (error) {
    console.error('Get visitor error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get visitor statistics for dashboard - ACCURATE VERSION
const getVisitorStats = async (req, res) => {
  try {
    const now = new Date();
    
    // Define time periods
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    // Use raw SQL for accurate distinct counting (works with all databases)
    const [totalResult] = await prisma.$queryRaw`
      SELECT COUNT(DISTINCT "sessionId")::int as count FROM visitors
    `;
    
    const [todayResult] = await prisma.$queryRaw`
      SELECT COUNT(DISTINCT "sessionId")::int as count FROM visitors 
      WHERE "lastVisit" >= ${todayStart}
    `;
    
    const [weekResult] = await prisma.$queryRaw`
      SELECT COUNT(DISTINCT "sessionId")::int as count FROM visitors 
      WHERE "lastVisit" >= ${weekAgo}
    `;
    
    const [monthResult] = await prisma.$queryRaw`
      SELECT COUNT(DISTINCT "sessionId")::int as count FROM visitors 
      WHERE "lastVisit" >= ${monthAgo}
    `;
    
    const [newResult] = await prisma.$queryRaw`
      SELECT COUNT(DISTINCT "sessionId")::int as count FROM visitors 
      WHERE "isNewVisitor" = true AND "firstVisit" >= ${weekAgo}
    `;
    
    // Get device stats (unique visitors per device)
    const deviceStats = await prisma.$queryRaw`
      SELECT "deviceType", COUNT(DISTINCT "sessionId")::int as count
      FROM visitors 
      WHERE "deviceType" IS NOT NULL
      GROUP BY "deviceType"
    `;
    
    // Get browser stats (unique visitors per browser)
    const browserStats = await prisma.$queryRaw`
      SELECT browser, COUNT(DISTINCT "sessionId")::int as count
      FROM visitors 
      WHERE browser IS NOT NULL AND browser != 'Unknown'
      GROUP BY browser
      ORDER BY count DESC
    `;
    
    // Get country stats
    const countryStats = await prisma.$queryRaw`
      SELECT country, COUNT(DISTINCT "sessionId")::int as count
      FROM visitors 
      WHERE country IS NOT NULL AND country != ''
      GROUP BY country
      ORDER BY count DESC
      LIMIT 10
    `;
    
    // Get daily unique visitors for last 7 days
    const dailyStats = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);
      
      const [dayResult] = await prisma.$queryRaw`
        SELECT COUNT(DISTINCT "sessionId")::int as count
        FROM visitors 
        WHERE "lastVisit" >= ${date} AND "lastVisit" < ${nextDate}
      `;
      
      dailyStats.push({
        date: date.toLocaleDateString(),
        views: Number(dayResult.count)
      });
    }
    
    // Calculate average daily visitors (last 7 days)
    const avgDaily = Math.round(dailyStats.reduce((sum, day) => sum + day.views, 0) / 7);
    
    // Format device stats for frontend
    const formattedDeviceStats = deviceStats.map(stat => ({
      deviceType: stat.deviceType,
      _count: Number(stat.count)
    }));
    
    // Format browser stats
    const formattedBrowserStats = browserStats.map(stat => ({
      browser: stat.browser,
      _count: Number(stat.count)
    }));
    
    // Format country stats
    const formattedCountryStats = countryStats.map(stat => ({
      country: stat.country,
      _count: Number(stat.count)
    }));
    
    res.json({
      success: true,
      data: {
        total: Number(totalResult.count),
        today: Number(todayResult.count),
        week: Number(weekResult.count),
        month: Number(monthResult.count),
        unique: Number(newResult.count),
        avgDaily: avgDaily,
        devices: formattedDeviceStats,
        browsers: formattedBrowserStats,
        countries: formattedCountryStats,
        dailyViews: dailyStats
      }
    });
  } catch (error) {
    console.error('Get visitor stats error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get page views analytics
const getPageViewsAnalytics = async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const since = new Date();
    since.setDate(since.getDate() - parseInt(days));
    
    const pageViews = await prisma.$queryRaw`
      SELECT "pageUrl", COUNT(DISTINCT "sessionId")::int as unique_visitors, COUNT(*)::int as total_views
      FROM visitor_page_views 
      WHERE "createdAt" >= ${since}
      GROUP BY "pageUrl"
      ORDER BY total_views DESC
      LIMIT 20
    `;
    
    res.json({ success: true, data: pageViews });
  } catch (error) {
    console.error('Get page views error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Export visitor data as CSV
const exportVisitorsCSV = async (req, res) => {
  try {
    const visitors = await prisma.visitor.findMany({
      orderBy: { firstVisit: 'desc' }
    });
    
    const headers = ['Session ID', 'Country', 'City', 'Device', 'Browser', 'OS', 'First Visit', 'Last Visit', 'Visits', 'Time Spent (min)'];
    const rows = visitors.map(v => [
      v.sessionId,
      v.country || '',
      v.city || '',
      v.deviceType || '',
      v.browser || '',
      v.os || '',
      v.firstVisit.toISOString(),
      v.lastVisit.toISOString(),
      v.visitCount,
      Math.round(v.totalTimeSpent / 60)
    ]);
    
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=visitors_${Date.now()}.csv`);
    res.send(csvContent);
  } catch (error) {
    console.error('Export CSV error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getAllVisitors,
  getVisitorById,
  getVisitorStats,
  getPageViewsAnalytics,
  exportVisitorsCSV
};