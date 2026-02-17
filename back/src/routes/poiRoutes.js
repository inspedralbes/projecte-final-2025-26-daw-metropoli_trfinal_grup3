const express = require('express');
const router = express.Router();
const poiController = require('../controllers/poiController');

router.post('/', poiController.createPoiSimple);
router.post('/completo', poiController.createPoiCompleto);
router.get('/', poiController.getPois);

module.exports = router;
