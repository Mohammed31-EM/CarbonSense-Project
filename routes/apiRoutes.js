const express = require('express');
const router = express.Router();
const plantDataController = require('../controllers/plant/dataController');
const plantApiController = require('../controllers/plant/apiController');
const authController = require('../controllers/auth/dataController');

// RESTful API routes for plants
router.get('/plants', authController.auth, plantDataController.index, plantApiController.index);
router.get('/plants/:id', authController.auth, plantDataController.show, plantApiController.show);
router.post('/plants', authController.auth, plantDataController.create, plantApiController.create);
router.put('/plants/:id', authController.auth, plantDataController.update, plantApiController.update);
router.delete('/plants/:id', authController.auth, plantDataController.destroy, plantApiController.destroy);

module.exports = router;
