const express = require('express');
const router = express.Router();
const horarioController = require('../controllers/horarioController');

router.post('/', horarioController.createHorario);
router.get('/:id_poi', horarioController.getHorariosByPoi);

module.exports = router;
