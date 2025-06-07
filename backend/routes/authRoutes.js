const express = require('express');
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware'); // Importar el middleware de protección

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe); // Ruta protegida de ejemplo

module.exports = router;
