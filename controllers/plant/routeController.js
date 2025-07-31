const express = require('express');
const router = express.Router();
const viewController = require('./viewController.js');
const dataController = require('./dataController.js');
const authDataController = require('../auth/dataController.js');

// INDEX: List all plants
router.get('/', authDataController.auth, dataController.index, viewController.index);

// NEW: Show new plant form
router.get('/new', authDataController.auth, viewController.newView);

// CREATE: Add a new plant
router.post('/', authDataController.auth, dataController.create, viewController.redirectHome);

// SHOW: Show one plant
router.get('/:id', authDataController.auth, dataController.show, viewController.show);

// EDIT: Edit plant form
router.get('/:id/edit', authDataController.auth, dataController.show, viewController.edit);

// UPDATE: Update plant data
router.put('/:id', authDataController.auth, dataController.update, viewController.redirectShow);

// DELETE: Remove a plant
router.delete('/:id', authDataController.auth, dataController.destroy, viewController.redirectHome);

module.exports = router;
// console.log(authDataController, dataController, viewController)