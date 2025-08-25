import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export const protect = async (req, res, next) => {
    // Skip authentication for health check endpoint
    if (req.path === '/health' || req.originalUrl === '/api/health') {
        console.log('🏥 Health check - skipping auth');
        return next();
    }
    
    // // ⚠️ TEMPORARY BYPASS FOR TESTING - REMOVE IN PRODUCTION
    // console.log('🔒 JWT middleware bypassed for testing');
    // req.user = { id: 'test-user', email: 'test@example.com' }; // Mock user
    // return next();
    
    // ORIGINAL CODE - UNCOMMENT TO RE-ENABLE JWT
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
    
};

