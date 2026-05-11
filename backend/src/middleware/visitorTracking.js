// backend/src/middleware/visitorTracking.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get geolocation from IP
const getGeoLocation = async (ip) => {
  try {
    if (!ip || ip === '::1' || ip === '127.0.0.1' || ip.startsWith('192.168.') || ip.startsWith('10.') || ip.startsWith('172.')) {
      return null;
    }
    
    const response = await fetch(`http://ip-api.com/json/${ip}`);
    const data = await response.json();
    
    if (data.status === 'success') {
      return {
        country: data.country,
        city: data.city,
        region: data.regionName,
        latitude: data.lat,
        longitude: data.lon,
        timezone: data.timezone
      };
    }
    return null;
  } catch (error) {
    return null;
  }
};

// Parse user agent
const parseUserAgent = (userAgent) => {
  const ua = userAgent || '';
  
  let deviceType = 'desktop';
  let browser = 'Unknown';
  let browserVersion = 'Unknown';
  let os = 'Unknown';
  let osVersion = 'Unknown';
  
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobile))/i.test(ua)) {
    deviceType = 'tablet';
  } else if (/(Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini))/i.test(ua)) {
    deviceType = 'mobile';
  }
  
  if (ua.includes('Chrome') && !ua.includes('Edg')) {
    browser = 'Chrome';
    const match = ua.match(/Chrome\/(\d+)/);
    browserVersion = match ? match[1] : 'Unknown';
  } else if (ua.includes('Firefox')) {
    browser = 'Firefox';
    const match = ua.match(/Firefox\/(\d+)/);
    browserVersion = match ? match[1] : 'Unknown';
  } else if (ua.includes('Safari') && !ua.includes('Chrome')) {
    browser = 'Safari';
  } else if (ua.includes('Edg')) {
    browser = 'Edge';
  }
  
  if (ua.includes('Windows NT 10.0')) os = 'Windows 10';
  else if (ua.includes('Windows NT 6.1')) os = 'Windows 7';
  else if (ua.includes('Mac OS X')) os = 'macOS';
  else if (ua.includes('Android')) os = 'Android';
  else if (ua.includes('iOS') || ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';
  else if (ua.includes('Linux')) os = 'Linux';
  
  return { deviceType, browser, browserVersion, os, osVersion };
};

// FIXED: Track visitor - properly handles existing sessions
const trackVisitor = async (req, res, next) => {
  try {
    // IMPORTANT: Try to get existing session ID from cookie
    let sessionId = req.cookies?.visitorSessionId;
    
    const userAgent = req.headers['user-agent'];
    const currentPage = req.originalUrl || req.url;
    
    // Skip tracking for admin routes and API calls
    if (currentPage.includes('/admin') || currentPage.includes('/api/')) {
      return next();
    }
    
    const now = new Date();
    
    if (sessionId) {
      // EXISTING VISITOR - Update last visit only, don't create new record
      const existingVisitor = await prisma.visitor.findUnique({
        where: { sessionId }
      });
      
      if (existingVisitor) {
        // Update existing visitor - this does NOT increase visitor count
        await prisma.visitor.update({
          where: { sessionId },
          data: {
            lastVisit: now,
            visitCount: { increment: 1 },
            totalTimeSpent: { increment: 30 } // Assume ~30 seconds per page view
          }
        });
        
        // Track page view
        await prisma.visitorPageView.create({
          data: {
            sessionId,
            visitorId: existingVisitor.id,
            pageUrl: currentPage,
            createdAt: now
          }
        });
        
        // Attach to request
        req.visitor = existingVisitor;
        req.visitorSessionId = sessionId;
        
        // Refresh cookie expiry
        res.cookie('visitorSessionId', sessionId, {
          maxAge: 30 * 24 * 60 * 60 * 1000,
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/'
        });
        
        return next();
      }
    }
    
    // NEW VISITOR - Create only when no valid session exists
    const newSessionId = 'vis_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    
    const ipAddress = req.ip || req.connection?.remoteAddress || req.socket?.remoteAddress;
    const cleanIp = ipAddress === '::1' ? '127.0.0.1' : ipAddress?.replace(/^::ffff:/, '');
    const referrer = req.headers.referer || req.headers.referrer;
    
    const { deviceType, browser, browserVersion, os, osVersion } = parseUserAgent(userAgent);
    const geoData = await getGeoLocation(cleanIp);
    
    // Create new visitor record
    const newVisitor = await prisma.visitor.create({
      data: {
        sessionId: newSessionId,
        ipAddress: cleanIp,
        userAgent,
        deviceType,
        browser,
        browserVersion,
        os,
        osVersion,
        referrer,
        landingPage: currentPage,
        isNewVisitor: true,
        visitCount: 1,
        firstVisit: now,
        lastVisit: now,
        country: geoData?.country,
        city: geoData?.city,
        region: geoData?.region,
        latitude: geoData?.latitude,
        longitude: geoData?.longitude,
        timezone: geoData?.timezone
      }
    });
    
    // Track first page view
    await prisma.visitorPageView.create({
      data: {
        sessionId: newSessionId,
        visitorId: newVisitor.id,
        pageUrl: currentPage,
        referrer,
        createdAt: now
      }
    });
    
    // Attach to request
    req.visitor = newVisitor;
    req.visitorSessionId = newSessionId;
    
    // Set persistent cookie
    res.cookie('visitorSessionId', newSessionId, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    });
    
    next();
  } catch (error) {
    console.error('Visitor tracking error:', error);
    next();
  }
};

// Track page view duration
const trackPageViewDuration = async (req, res) => {
  try {
    const { pageViewId, timeSpent } = req.body;
    
    if (pageViewId && timeSpent) {
      await prisma.visitorPageView.update({
        where: { id: pageViewId },
        data: { timeSpent: Math.min(timeSpent, 3600) }
      });
    }
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Track visitor event
const trackEvent = async (req, res) => {
  try {
    const { sessionId, eventType, elementId, elementClass, eventData } = req.body;
    
    const visitor = await prisma.visitor.findUnique({
      where: { sessionId }
    });
    
    if (visitor) {
      await prisma.visitorEvent.create({
        data: {
          sessionId,
          visitorId: visitor.id,
          eventType,
          elementId,
          elementClass,
          eventData
        }
      });
    }
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get or create session
const getSession = async (req, res) => {
  try {
    let sessionId = req.cookies?.visitorSessionId;
    
    if (!sessionId) {
      sessionId = 'vis_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      
      await prisma.visitor.create({
        data: {
          sessionId,
          isNewVisitor: true,
          visitCount: 1,
          firstVisit: new Date(),
          lastVisit: new Date()
        }
      });
      
      res.cookie('visitorSessionId', sessionId, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: 'lax',
        path: '/'
      });
    }
    
    res.json({ success: true, sessionId });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  trackVisitor,
  trackPageViewDuration,
  trackEvent,
  getSession
};