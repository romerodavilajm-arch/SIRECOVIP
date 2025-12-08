const express = require('express');
const router = express.Router();
const merchantController = require('../controllers/merchantController');
const requireAuth = require('../middlewares/authMiddleware');   // Importar el middleware   
const upload = require('../middlewares/uploadMiddleware');


// Definir endpoints
// POST: Auth + Upload + Controller
// Aceptar múltiples archivos: 'image' (foto del puesto) y 'documents' (múltiples documentos)
const uploadFields = upload.fields([
  { name: 'image', maxCount: 1 },           // Foto del puesto
  { name: 'documents', maxCount: 10 }       // Documentos adicionales (máx 10)
]);

router.post('/', requireAuth, uploadFields, merchantController.createMerchant); // Crear
router.get('/', requireAuth, merchantController.getMerchants);    // Listar
router.get('/:id', requireAuth, merchantController.getMerchantById); // Obtener por ID
router.put('/:id', requireAuth, uploadFields, merchantController.updateMerchant); // Actualizar

module.exports = router;