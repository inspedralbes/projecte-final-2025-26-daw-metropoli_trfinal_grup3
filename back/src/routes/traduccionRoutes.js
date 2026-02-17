const express = require('express');
const router = express.Router();
const traduccionController = require('../controllers/traduccionController');

router.post('/', traduccionController.createTraduccion);
router.get('/', traduccionController.getTraducciones);

module.exports = router;
