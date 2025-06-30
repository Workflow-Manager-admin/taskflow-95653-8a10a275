const express = require('express');
const UserController = require('../controllers/user');
const auth = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 */
router.post('/auth/register', UserController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login with user credentials
 *     tags: [Authentication]
 */
router.post('/auth/login', UserController.login);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout current user (JWT stateless)
 *     security:
 *       - bearerAuth: []
 *     tags: [Authentication]
 */
router.post('/auth/logout', auth, UserController.logout);

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get authenticated user's profile
 *     security:
 *       - bearerAuth: []
 *     tags: [Users]
 */
router.get('/users/profile', auth, UserController.profile);

module.exports = router;
