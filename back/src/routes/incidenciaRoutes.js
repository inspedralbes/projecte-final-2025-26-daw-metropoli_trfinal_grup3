const express = require('express');
const router = express.Router();
const incidenciaController = require('../controllers/incidenciaController');

router.post('/', incidenciaController.createIncidencia);
router.get('/', incidenciaController.getIncidencias);

module.exports = router;
