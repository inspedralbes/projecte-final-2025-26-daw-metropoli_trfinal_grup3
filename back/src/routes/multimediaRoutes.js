const express = require('express');
const router = express.Router();
const multimediaController = require('../controllers/multimediaController');

router.post('/', multimediaController.createMultimedia);
router.get('/:id_poi', multimediaController.getMultimediaByPoi);

module.exports = router;
