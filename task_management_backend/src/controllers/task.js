const TaskService = require('../services/task');

/**
 * TaskController handles all /api/tasks endpoints (CRUD, filtering, sorting).
 */
// PUBLIC_INTERFACE
class TaskController {
  // PUBLIC_INTERFACE
  /**
   * @swagger
   * /api/tasks:
   *   post:
   *     summary: Create a new task
   *     tags: [Tasks]
   *     security: [{ bearerAuth: [] }]
   */
  static async create(req, res) {
    try {
      const { title, description, due_date, status, priority } = req.body;
      if (!title || typeof title !== 'string') {
        return res.status(400).json({ error: 'Validation error: title is required.' });
      }
      if (status && !['pending', 'in_progress', 'completed'].includes(status))
        return res.status(400).json({ error: 'Invalid status value.' });
      if (priority && !['low', 'medium', 'high'].includes(priority))
        return res.status(400).json({ error: 'Invalid priority value.' });

      const newTask = await TaskService.createTask(req.user.id, {
        title,
        description,
        due_date,
        status,
        priority,
      });

      return res.status(201).json(newTask);
    } catch (e) {
      return res.status(500).json({ error: 'Internal error' });
    }
  }

  // PUBLIC_INTERFACE
  /**
   * @swagger
   * /api/tasks:
   *   get:
   *     summary: Get task list with filtering, sorting, and pagination
   *     tags: [Tasks]
   *     security: [{ bearerAuth: [] }]
   */
  static async list(req, res) {
    try {
      const query = {
        status: req.query.status,
        priority: req.query.priority,
        search: req.query.search,
        sort_by: req.query.sort_by,
        sort_order: req.query.sort_order,
        page: req.query.page,
        limit: req.query.limit,
      };
      const result = await TaskService.listTasks(req.user.id, query);
      // Format tasks (remove sensitive fields)
      result.tasks = result.tasks.map((t) => ({
        id: t.id,
        title: t.title,
        description: t.description,
        created_at: t.created_at,
        due_date: t.due_date,
        status: t.status,
        priority: t.priority,
        user_id: t.user_id,
      }));
      return res.status(200).json(result);
    } catch (e) {
      return res.status(500).json({ error: 'Internal error' });
    }
  }

  // PUBLIC_INTERFACE
  /**
   * @swagger
   * /api/tasks/{id}:
   *   get:
   *     summary: Get a single task by ID (must be owned)
   *     tags: [Tasks]
   *     security: [{ bearerAuth: [] }]
   */
  static async get(req, res) {
    try {
      const task = await TaskService.getTaskById(req.user.id, req.params.id);
      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }
      return res.status(200).json({
        id: task.id,
        title: task.title,
        description: task.description,
        created_at: task.created_at,
        due_date: task.due_date,
        status: task.status,
        priority: task.priority,
        user_id: task.user_id,
      });
    } catch (e) {
      return res.status(500).json({ error: 'Internal error' });
    }
  }

  // PUBLIC_INTERFACE
  /**
   * @swagger
   * /api/tasks/{id}:
   *   put:
   *     summary: Update a single task by ID (must be owned)
   *     tags: [Tasks]
   *     security: [{ bearerAuth: [] }]
   */
  static async update(req, res) {
    try {
      const patch = {};
      const allowed = ['title', 'description', 'due_date', 'status', 'priority'];
      for (const f of allowed) {
        if (Object.prototype.hasOwnProperty.call(req.body, f)) patch[f] = req.body[f];
      }
      if ('status' in patch && patch.status && !['pending', 'in_progress', 'completed'].includes(patch.status))
        return res.status(400).json({ error: 'Invalid status value.' });
      if ('priority' in patch && patch.priority && !['low', 'medium', 'high'].includes(patch.priority))
        return res.status(400).json({ error: 'Invalid priority value.' });
      if (Object.keys(patch).length === 0)
        return res.status(400).json({ error: 'At least one updatable field is required.' });

      const updated = await TaskService.updateTask(req.user.id, req.params.id, patch);
      if (!updated) return res.status(404).json({ error: 'Task not found' });

      return res.status(200).json({
        id: updated.id,
        title: updated.title,
        description: updated.description,
        created_at: updated.created_at,
        due_date: updated.due_date,
        status: updated.status,
        priority: updated.priority,
        user_id: updated.user_id,
      });
    } catch (e) {
      return res.status(500).json({ error: 'Internal error' });
    }
  }

  // PUBLIC_INTERFACE
  /**
   * @swagger
   * /api/tasks/{id}:
   *   delete:
   *     summary: Delete a task (must be owned)
   *     tags: [Tasks]
   *     security: [{ bearerAuth: [] }]
   */
  static async delete(req, res) {
    try {
      const deleted = await TaskService.deleteTask(req.user.id, req.params.id);
      if (!deleted) return res.status(404).json({ error: 'Task not found' });
      return res.status(204).send();
    } catch (e) {
      return res.status(500).json({ error: 'Internal error' });
    }
  }
}

module.exports = TaskController;
