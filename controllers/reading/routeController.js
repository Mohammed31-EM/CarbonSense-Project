const express = require('express');
const router = express.Router();

// Controllers
const authDataController = require('../auth/apiController');
const dataController = require('./dataController');
const apiController = require('./apiController');
const viewController = require('./viewController');



// Index - List all readings
router.get('/', authDataController.auth, dataController.index, viewController.index);

// New - Show form to add a new reading
router.get('/new', authDataController.auth, viewController.newView);

// Show - View a single reading by ID
router.get('/:id', authDataController.auth, dataController.show, viewController.show);

// Edit - Show form to edit a reading
router.get('/:id/edit', authDataController.auth, dataController.show, viewController.edit);


// Get all readings
router.get('/api', authDataController.auth, apiController.index);

// Get reading by ID
router.get('/api/:id', authDataController.auth, apiController.show);

// Create new reading
router.post('/', authDataController.auth, dataController.create, apiController.create);

// Update a reading
router.put('/:id', authDataController.auth, dataController.update, apiController.update);

// Delete a reading
router.delete('/:id', authDataController.auth, dataController.destroy, apiController.destroy);

module.exports = router;
