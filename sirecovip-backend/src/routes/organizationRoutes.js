const express = require('express');
const router = express.Router();
const organizationController = require('../controllers/organizationController');
const requireAuth = require('../middlewares/authMiddleware');

// Definir endpoints
router.get('/', requireAuth, organizationController.getOrganizations);    // Listar organizaciones activas
router.get('/:id', requireAuth, organizationController.getOrganizationById); // Obtener por ID

module.exports = router;
