// PUBLIC_INTERFACE
/**
 * AuthService provides utility methods for hashing, JWT creation/validation, and password comparing.
 */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'default_jwt_secret_change_this';
const JWT_EXPIRY = '7d';

class AuthService {
  // PUBLIC_INTERFACE
  static async hashPassword(rawPassword) {
    /** Hashes plain password with salt. */
    return await bcrypt.hash(rawPassword, 10);
  }

  // PUBLIC_INTERFACE
  static async comparePassword(raw, hashed) {
    /** Compares plain password with hash. */
    return await bcrypt.compare(raw, hashed);
  }

  // PUBLIC_INTERFACE
  static signToken(payload) {
    /** Creates a JWT token from payload. */
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });
  }

  // PUBLIC_INTERFACE
  static verifyToken(token) {
    /** Verifies JWT, returns payload or throws error. */
    return jwt.verify(token, JWT_SECRET);
  }
}

module.exports = AuthService;
