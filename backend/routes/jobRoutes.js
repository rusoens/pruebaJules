const express = require('express');
const { createJob, getJobs, getJobById } = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Rutas públicas (o protegidas si se decide que solo usuarios logueados pueden ver)
router.get('/', getJobs);
router.get('/:jobId', getJobById);

// Rutas protegidas
// Solo usuarios autenticados pueden crear trabajos.
// Se podría añadir authorize('client') si solo los clientes pueden crear.
router.post('/', protect, createJob);
// router.post('/', protect, authorize('client'), createJob); // Ejemplo más restrictivo

// Aquí irían PUT y DELETE para trabajos, protegidas y autorizadas adecuadamente
// router.put('/:jobId', protect, authorize('client', 'admin'), updateJob);
// router.delete('/:jobId', protect, authorize('client', 'admin'), deleteJob);


module.exports = router;
