const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Por favor, ingrese un título para el trabajo'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Por favor, ingrese una descripción del trabajo'],
  },
  location: { // Ubicación general
    type: String,
    required: [true, 'Por favor, ingrese la ubicación del trabajo'],
  },
  client: {
    type: mongoose.Schema.ObjectId,
    ref: 'User', // Referencia al usuario que creó el trabajo
    required: true,
  },
  // Podríamos añadir campos como: presupuesto estimado, estado (abierto, en progreso, cerrado), etc.
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Job', JobSchema);
