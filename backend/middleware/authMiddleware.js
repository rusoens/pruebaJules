const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Proteger rutas, verificar token
exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  // else if (req.cookies.token) { // Si se usaran cookies para el token
  //   token = req.cookies.token;
  // }

  // Asegurarse que el token existe
  if (!token) {
    return res.status(401).json({ success: false, error: 'No autorizado para acceder a esta ruta (no token)' });
  }

  try {
    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password'); // Adjuntar usuario al request, sin la contraseña

    if (!req.user) {
        return res.status(401).json({ success: false, error: 'No autorizado para acceder a esta ruta (usuario no encontrado)' });
    }

    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: 'No autorizado para acceder a esta ruta (token inválido)' });
  }
};

// Otorgar acceso a roles específicos (ej. 'admin', 'professional')
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, error: `El rol de usuario '${req.user ? req.user.role : 'desconocido'}' no está autorizado para acceder a esta ruta` });
    }
    next();
  };
};
