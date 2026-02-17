const express = require('express');
const router = express.Router();
const nodoController = require('../controllers/nodoController');

router.post('/', nodoController.createNodo);
router.get('/', nodoController.getNodos);
router.get('/:id', nodoController.getNodoById);

module.exports = router;
