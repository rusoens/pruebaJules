const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// @desc    Registrar un nuevo usuario
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role, mainSkill, description, whatsappNumber } = req.body;

    // Crear usuario
    const user = await User.create({
      name,
      email,
      password,
      role,
      mainSkill: role === 'professional' ? mainSkill : undefined,
      description: role === 'professional' ? description : undefined,
      whatsappNumber: role === 'professional' ? whatsappNumber : undefined,
    });

    sendTokenResponse(user, 201, res);
  } catch (error) {
    // Manejo de errores (ej. email duplicado, validación)
    res.status(400).json({ success: false, error: error.message }); // Mejorar manejo de errores luego
    // next(error); // Si se usa un middleware de errores global
  }
};

// @desc    Iniciar sesión
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validar email y password
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Por favor, provea un email y contraseña' });
    }

    // Buscar usuario por email (incluyendo la contraseña que por defecto no se selecciona)
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ success: false, error: 'Credenciales inválidas' });
    }

    // Verificar contraseña
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Credenciales inválidas' });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
    // next(error);
  }
};

// Helper para generar token, crear cookie y enviar respuesta
const sendTokenResponse = (user, statusCode, res) => {
  // Crear token
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });

  const options = {
    expires: new Date(
      Date.now() + (process.env.JWT_COOKIE_EXPIRE || 30) * 24 * 60 * 60 * 1000 // Cookie expira en 30 días por defecto
    ),
    httpOnly: true, // Cookie no accesible por JS en el cliente
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true; // Cookie solo sobre HTTPS en producción
  }

  // No estamos usando cookies directamente para la respuesta del token aquí,
  // el frontend lo almacenará. Devolvemos el token en el JSON.
  res.status(statusCode).json({
    success: true,
    token,
    user: { // Devolver info básica del usuario
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
    }
  });
};

// @desc    Obtener usuario actual (ejemplo de ruta protegida)
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  // req.user es establecido por el middleware de autenticación
  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(404).json({ success: false, error: 'Usuario no encontrado' });
  }

  res.status(200).json({
    success: true,
    data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        mainSkill: user.mainSkill,
        description: user.description,
        whatsappNumber: user.whatsappNumber
    }
  });
};

module.exports.sendTokenResponse = sendTokenResponse; // Exportar para posible uso futuro
