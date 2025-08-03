const express = require('express');
const router = express.Router();

const dataController = require('./dataController');
const apiController = require('./apiController');
const viewController = require('./viewController'); 
const { auth } = require('../auth/dataController');

// --- Web Views ---
router.get('/new', auth, viewController.newView); 

// --- API Endpoints ---
router.get('/', auth, dataController.index, apiController.index);
router.get('/:id', auth, dataController.show, apiController.show);
router.post('/', auth, dataController.create, apiController.show);
router.put('/:id', auth, dataController.update, apiController.show);
router.delete('/:id', auth, dataController.destroy, apiController.destroy);

module.exports = router;
