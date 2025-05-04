import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

// Middleware to protect routes
export const protect = async (req, res, next) => {
  let token;

  // 1. Check for token in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } 
  // 2. Else check for token in cookies
  else if (req.cookies && req.cookies.accessToken) {
    token = req.cookies.accessToken;
  }

  // 3. If no token, return error
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    // 4. Verify token
    const decoded = jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN);

    // 5. Attach user ID and user to request object
    req.userId = decoded.id;
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized, invalid token' });
  }
};

// Role-based access control
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: `Role '${req.user.role}' not allowed` });
    }
    next();
  };
};
