const { Task, User, Sequelize } = require('../models');
const { Op } = Sequelize;

/**
 * TaskService provides business logic for Task CRUD and list (with filtering/sorting).
 */
class TaskService {
  // PUBLIC_INTERFACE
  static async createTask(userId, data) {
    /** Create a task owned by the given user. */
    return await Task.create({ ...data, user_id: userId });
  }

  // PUBLIC_INTERFACE
  static async getTaskById(userId, id) {
    /** Get a single task by ID and user (ownership enforced) */
    return await Task.findOne({ where: { id, user_id: userId } });
  }

  // PUBLIC_INTERFACE
  static async updateTask(userId, id, data) {
    /** Update the task (if owned by user) */
    const task = await Task.findOne({ where: { id, user_id: userId } });
    if (!task) return null;
    await task.update(data);
    return task;
  }

  // PUBLIC_INTERFACE
  static async deleteTask(userId, id) {
    /** Delete the task (if owned by user) */
    const deleted = await Task.destroy({ where: { id, user_id: userId } });
    return deleted > 0;
  }

  // PUBLIC_INTERFACE
  static async listTasks(userId, query = {}) {
    /**
     * List tasks owned by user with filtering, sorting, search, and pagination.
     * Query: status, priority, search, sort_by, sort_order, page, limit
     */
    const {
      status,
      priority,
      search,
      sort_by = 'created_at',
      sort_order = 'asc',
      page = 1,
      limit = 10,
    } = query;

    // Filtering clause
    const where = { user_id: userId };
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
      ];
    }

    // Sorting
    const validSortFields = ['created_at', 'due_date', 'priority', 'status'];
    const orderField = validSortFields.includes(sort_by) ? sort_by : 'created_at';
    const order = [[orderField, sort_order && sort_order.toLowerCase() === 'desc' ? 'DESC' : 'ASC']];

    // Pagination
    const safeLimit = Math.max(1, Math.min(Number(limit) || 10, 100));
    const safePage = Math.max(1, Number(page) || 1);
    const offset = (safePage - 1) * safeLimit;

    // Query tasks
    const { rows, count } = await Task.findAndCountAll({
      where,
      order,
      limit: safeLimit,
      offset,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id'],
        },
      ],
    });
    return {
      tasks: rows,
      page: safePage,
      limit: safeLimit,
      total: count,
    };
  }
}

module.exports = TaskService;
