import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

const PUBLIC_PATHS = ['/', '/favicon.ico', '/api/health', '/health'];

export const protect = async (req, res, next) => {
    try {
      // 🏥 Skip auth for health checks & public/static assets
      if (PUBLIC_PATHS.includes(req.path) || PUBLIC_PATHS.includes(req.originalUrl)) {
        console.log(`⚡ Public route [${req.path}] - skipping auth`);
        return next();
      }
  
      // 🔑 Extract Authorization header
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Missing or invalid Authorization header' });
      }
  
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
  
      // 🏢 Ensure company code exists (from header OR token payload)
      const companyCode = req.headers['x-company-code'] || decoded.companyCode;
      if (!companyCode) {
        return res.status(400).json({ message: 'Missing company code header' });
      }
  
      // 👤 Lookup user
      const user = await User.findById(decoded.userId || decoded.id).select('-password');
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }
  
      // Attach user & company info to request
      req.user = user;
      req.companyCode = companyCode;
  
      next();
    } catch (error) {
      console.error('❌ Auth error:', error.message);
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
  };

