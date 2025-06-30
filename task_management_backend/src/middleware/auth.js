// PUBLIC_INTERFACE
/**
 * Express middleware for protecting routes with JWT.
 * Sets req.user to decoded JWT payload if valid.
 */
const AuthService = require('../services/auth');

const authMiddleware = (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  const token = authHeader.slice(7);
  try {
    const payload = AuthService.verifyToken(token);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
};

module.exports = authMiddleware;
