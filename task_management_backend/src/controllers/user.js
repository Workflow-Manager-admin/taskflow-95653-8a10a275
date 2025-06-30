/**
 * UserController handles register, login, logout, and profile endpoints.
 */
const { User } = require('../models');
const AuthService = require('../services/auth');
const { Op } = require('sequelize');

class UserController {
  // PUBLIC_INTERFACE
  /**
   * @swagger
   * /api/auth/register:
   *   post:
   *     summary: Register a new user
   *     tags:
   *       - Authentication
   */
  static async register(req, res) {
    try {
      const { username, email, password } = req.body;
      if (!username || !email || !password || password.length < 6) {
        return res.status(400).json({ error: 'Validation error: username, email and password (6+ chars) are required.' });
      }

      // Check for existing user
      const exists = await User.findOne({
        where: {
          [Op.or]: [{ email }, { username }],
        },
      });
      if (exists) {
        return res.status(409).json({ error: 'Email or username already exists' });
      }

      const hashed = await AuthService.hashPassword(password);
      const user = await User.create({ username, email, password: hashed });
      const userPlain = {
        id: user.id,
        username: user.username,
        email: user.email,
      };
      const token = AuthService.signToken({
        id: user.id,
        username: user.username,
        email: user.email,
      });
      return res.status(201).json({ user: userPlain, token });
    } catch (err) {
      return res.status(500).json({ error: 'Internal error' });
    }
  }

  // PUBLIC_INTERFACE
  /**
   * @swagger
   * /api/auth/login:
   *   post:
   *     summary: Login with user credentials
   *     tags:
   *       - Authentication
   */
  static async login(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: 'Validation error: email and password required.' });
      }
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      const isMatch = await AuthService.comparePassword(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      const userPlain = {
        id: user.id,
        username: user.username,
        email: user.email,
      };
      const token = AuthService.signToken({
        id: user.id,
        username: user.username,
        email: user.email,
      });
      return res.status(200).json({ user: userPlain, token });
    } catch (err) {
      return res.status(500).json({ error: 'Internal error' });
    }
  }

  // PUBLIC_INTERFACE
  /**
   * @swagger
   * /api/auth/logout:
   *   post:
   *     summary: Logout user (JWT stateless)
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Authentication
   */
  static async logout(req, res) {
    // JWT stateless: client should discard token, but endpoint is for extensibility
    return res.status(204).send();
  }

  // PUBLIC_INTERFACE
  /**
   * @swagger
   * /api/users/profile:
   *   get:
   *     summary: Get authenticated user's profile
   *     security:
   *       - bearerAuth: []
   *     tags:
   *       - Users
   */
  static async profile(req, res) {
    try {
      const { id } = req.user;
      const user = await User.findByPk(id);
      if (!user) return res.status(401).json({ error: 'Not authenticated' });
      return res.status(200).json({
        id: user.id,
        username: user.username,
        email: user.email,
        created_at: user.created_at,
      });
    } catch (err) {
      return res.status(500).json({ error: 'Internal error' });
    }
  }
}

module.exports = UserController;
