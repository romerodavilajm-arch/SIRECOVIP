const express = require('express');
const router = express.Router();
const { getUsers, getUserById } = require('../controllers/userController');
const requireAuth = require('../middlewares/authMiddleware');

// GET /api/users - Obtener todos los usuarios (con filtro opcional por zona)
router.get('/', requireAuth, getUsers);

// GET /api/users/:id - Obtener un usuario por ID
router.get('/:id', requireAuth, getUserById);

module.exports = router;
