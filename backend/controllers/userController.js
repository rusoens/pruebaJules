const User = require('../models/User');

// @desc    Obtener todos los profesionales (o filtrar por oficio, etc. - A IMPLEMENTAR)
// @route   GET /api/users/professionals
// @access  Public
exports.getProfessionals = async (req, res, next) => {
  try {
    // Por ahora, solo devuelve todos los usuarios con rol 'professional'
    // Más adelante se pueden añadir filtros por mainSkill, ubicación (si se añade), etc.
    const professionals = await User.find({ role: 'professional' });
    res.status(200).json({ success: true, count: professionals.length, data: professionals });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Obtener perfil de un usuario (especialmente profesional)
// @route   GET /api/users/:userId/profile
// @access  Public
exports.getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ success: false, error: 'Usuario no encontrado' });
    }
    // Devolver solo la información pública o relevante del perfil
    // (excluir email si no es el propio usuario, etc. - se puede refinar)
    res.status(200).json({
        success: true,
        data: {
            _id: user._id,
            name: user.name,
            role: user.role,
            mainSkill: user.mainSkill,
            description: user.description,
            whatsappNumber: user.whatsappNumber,
            createdAt: user.createdAt
            // No devolver email aquí por defecto para perfiles públicos
        }
    });
  } catch (error) {
    // Manejar errores de ID inválido etc.
    if (error.kind === 'ObjectId') {
        return res.status(404).json({ success: false, error: 'Usuario no encontrado (ID inválido)' });
    }
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Actualizar perfil de usuario (profesional)
// @route   PUT /api/users/:userId/profile  (o /api/users/profile si es el propio usuario)
// @access  Private (solo el propio usuario o admin)
exports.updateUserProfile = async (req, res, next) => {
  try {
    // Asegurarse que el usuario que actualiza es el mismo del token o un admin
    if (req.user.id !== req.params.userId && req.user.role !== 'admin') { // Asumiendo que hay rol admin
        return res.status(403).json({ success: false, error: 'No autorizado para actualizar este perfil' });
    }

    // Campos que se pueden actualizar (ejemplo)
    const { name, mainSkill, description, whatsappNumber } = req.body;
    const fieldsToUpdate = {};
    if (name) fieldsToUpdate.name = name;
    if (mainSkill && req.user.role === 'professional') fieldsToUpdate.mainSkill = mainSkill;
    if (description && req.user.role === 'professional') fieldsToUpdate.description = description;
    if (whatsappNumber && req.user.role === 'professional') fieldsToUpdate.whatsappNumber = whatsappNumber;
    // No permitir cambiar el email o rol por esta vía simplificada

    const user = await User.findByIdAndUpdate(req.params.userId, fieldsToUpdate, {
      new: true, // Devuelve el documento modificado
      runValidators: true, // Ejecuta las validaciones del esquema
    });

    if (!user) {
      return res.status(404).json({ success: false, error: 'Usuario no encontrado para actualizar' });
    }
    res.status(200).json({ success: true, data: user.role === 'professional' ? {
        _id: user._id, name: user.name, email: user.email, role: user.role, // Incluir email para el propio usuario
        mainSkill: user.mainSkill, description: user.description, whatsappNumber: user.whatsappNumber
    } : { _id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message }); // Errores de validación, etc.
  }
};
