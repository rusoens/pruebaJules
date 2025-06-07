const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Por favor, ingrese su nombre'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Por favor, ingrese su email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Por favor, ingrese un email válido',
    ],
  },
  password: {
    type: String,
    required: [true, 'Por favor, ingrese su contraseña'],
    minlength: 6,
    select: false, // No devolver la contraseña por defecto en las consultas
  },
  role: {
    type: String,
    enum: ['client', 'professional'],
    default: 'client',
  },
  // Campos específicos para profesionales
  mainSkill: { // Oficio principal
    type: String,
    trim: true,
    // required: function() { return this.role === 'professional'; } // Descomentar si es obligatorio al registrarse como profesional
  },
  description: { // Descripción del profesional
    type: String,
    trim: true,
  },
  whatsappNumber: {
    type: String,
    trim: true,
    // match: [/^\+[1-9]\d{1,14}$/, 'Por favor, ingrese un número de WhatsApp válido con código de país'] // Validación opcional
  },
  // Podríamos añadir más campos como: años de experiencia, portfolio, etc.
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// 2.2. Lógica de Negocio (parcial): Hashing de contraseñas antes de guardar
UserSchema.pre('save', async function (next) {
  // Solo hashear la contraseña si ha sido modificada (o es nueva)
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Método para comparar la contraseña ingresada con la hasheada en la BD
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
