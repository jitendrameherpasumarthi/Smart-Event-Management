import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route. No authentication token provided.',
    });
  }

  try {
    const secret = process.env.JWT_SECRET || 'eventhub_default_secret_key_2026';
    const decoded = jwt.verify(token, secret);

    // Fetch user from DB
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      // In case token was valid but user deleted/not in DB, allow payload if present
      if (decoded.role && decoded.email) {
        req.user = {
          _id: decoded.id,
          id: decoded.id,
          name: decoded.name || 'User',
          email: decoded.email,
          role: decoded.role,
        };
        return next();
      }

      return res.status(401).json({
        success: false,
        message: 'The user belonging to this token no longer exists.',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized. Token verification failed or expired.',
      error: error.message,
    });
  }
};

export default protect;
