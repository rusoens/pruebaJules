const express = require('express');
const { getProfessionals, getUserProfile, updateUserProfile } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/professionals', getProfessionals);
router.get('/:userId/profile', getUserProfile);
// Proteger la ruta de actualización de perfil
// Solo el usuario logueado puede actualizar su propio perfil
router.put('/:userId/profile', protect, updateUserProfile);
// Alternativamente, se podría tener una ruta /api/users/profile (sin ID) que use req.user.id

module.exports = router;
