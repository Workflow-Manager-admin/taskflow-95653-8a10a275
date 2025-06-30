const express = require('express');
const TaskController = require('../controllers/task');
const auth = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     security: [{ bearerAuth: [] }]
 */
router.post('/tasks', auth, TaskController.create);

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: List tasks (filter/sort/pagination)
 *     tags: [Tasks]
 *     security: [{ bearerAuth: [] }]
 */
router.get('/tasks', auth, TaskController.list);

/**
 * @swagger
 * /api/tasks/{id}:
 *   get:
 *     summary: Get single task
 *     tags: [Tasks]
 *     security: [{ bearerAuth: [] }]
 */
router.get('/tasks/:id', auth, TaskController.get);

/**
 * @swagger
 * /api/tasks/{id}:
 *   put:
 *     summary: Update task by ID
 *     tags: [Tasks]
 *     security: [{ bearerAuth: [] }]
 */
router.put('/tasks/:id', auth, TaskController.update);

/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     summary: Delete task by ID
 *     tags: [Tasks]
 *     security: [{ bearerAuth: [] }]
 */
router.delete('/tasks/:id', auth, TaskController.delete);

module.exports = router;
