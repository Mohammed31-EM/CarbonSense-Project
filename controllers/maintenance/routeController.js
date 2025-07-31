const express = require('express');
const router = express.Router();

const authDataController = require('../auth/dataController');
const dataController = require('./dataController');
const viewController = require('./viewController');

// INDEX
router.get('/', authDataController.auth, dataController.index, viewController.index);

// NEW
router.get('/new', authDataController.auth, viewController.newView);

// CREATE
router.post('/', authDataController.auth, dataController.create, viewController.redirectHome);

// SHOW
router.get('/:id', authDataController.auth, dataController.show, viewController.show);

// EDIT
router.get('/:id/edit', authDataController.auth, dataController.show, viewController.edit);

// UPDATE
router.put('/:id', authDataController.auth, dataController.update, viewController.redirectShow);

// DELETE
router.delete('/:id', authDataController.auth, dataController.destroy, viewController.redirectHome);

module.exports = router;
