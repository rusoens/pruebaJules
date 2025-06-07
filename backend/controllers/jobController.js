const Job = require('../models/Job');
const User = require('../models/User'); // Necesario para verificar el rol del cliente

// @desc    Crear una nueva solicitud de trabajo
// @route   POST /api/jobs
// @access  Private (solo clientes)
exports.createJob = async (req, res, next) => {
  try {
    // El ID del cliente viene de req.user (establecido por el middleware 'protect')
    req.body.client = req.user.id;

    // Opcional: Verificar que el usuario es un cliente (aunque 'protect' ya lo valida como usuario logueado)
    // if (req.user.role !== 'client') {
    //   return res.status(403).json({ success: false, error: 'Solo los clientes pueden crear trabajos' });
    // }

    const job = await Job.create(req.body);
    res.status(201).json({ success: true, data: job });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message }); // Errores de validación, etc.
  }
};

// @desc    Obtener todas las solicitudes de trabajo
// @route   GET /api/jobs
// @access  Public (o Private para usuarios logueados, según se decida)
exports.getJobs = async (req, res, next) => {
  try {
    // Aquí se podrían añadir filtros, paginación, etc.
    // Por ejemplo: populate para obtener datos del cliente que publicó
    const jobs = await Job.find().populate({
        path: 'client',
        select: 'name email' // Seleccionar qué campos del cliente mostrar
    }).sort({ createdAt: -1 }); // Ordenar por más recientes

    res.status(200).json({ success: true, count: jobs.length, data: jobs });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Obtener detalles de un trabajo específico
// @route   GET /api/jobs/:jobId
// @access  Public (o Private)
exports.getJobById = async (req, res, next) => {
  try {.
    const job = await Job.findById(req.params.jobId).populate({
        path: 'client',
        select: 'name email'
    });

    if (!job) {
      return res.status(404).json({ success: false, error: 'Trabajo no encontrado' });
    }
    res.status(200).json({ success: true, data: job });
  } catch (error) {
    // Manejar errores de ID inválido etc.
    if (error.kind === 'ObjectId') {
        return res.status(404).json({ success: false, error: 'Trabajo no encontrado (ID inválido)' });
    }
    res.status(500).json({ success: false, error: error.message });
  }
};

// Se podrían añadir PUT y DELETE para trabajos (ej. solo el cliente que lo creó o un admin)
// exports.updateJob = async (req, res, next) => { ... }
// exports.deleteJob = async (req, res, next) => { ... }
