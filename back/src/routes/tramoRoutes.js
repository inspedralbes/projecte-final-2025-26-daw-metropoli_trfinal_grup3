const express = require('express');
const router = express.Router();
const tramoController = require('../controllers/tramoController');

router.post('/', tramoController.createTramo);
router.get('/', tramoController.getTramos);

module.exports = router;
