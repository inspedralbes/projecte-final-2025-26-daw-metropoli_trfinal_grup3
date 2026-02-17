const express = require('express');
const router = express.Router();
const eventoController = require('../controllers/eventoController');

router.post('/', eventoController.createEvento);
router.get('/', eventoController.getEventos);

module.exports = router;
