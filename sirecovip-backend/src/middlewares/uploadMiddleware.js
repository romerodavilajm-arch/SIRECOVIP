const multer = require('multer');

// Configuración básica: Guardar en memoria temporalmente
const storage = multer.memoryStorage();

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // Limite de 5MB por archivo
    },
    fileFilter: (req, file, cb) => {
        // Permitir imágenes y PDFs
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp', 'application/pdf'];

        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('⛔ Solo se permiten imágenes (JPG, PNG, GIF, WEBP) y documentos PDF'), false);
        }
    }
});

module.exports = upload;