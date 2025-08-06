const express = require('express');
const router = express.Router();
const viewController = require('./viewController.js');
const dataController = require('./dataController.js');
const authDataController = require('../auth/dataController.js');

router.get('/', authDataController.auth, dataController.index, viewController.index);
router.get('/new', authDataController.auth, viewController.newView);
router.post('/', authDataController.auth, dataController.create, viewController.redirectHome);
router.get('/:id', authDataController.auth, dataController.show, viewController.show);
router.get('/:id/edit', authDataController.auth, dataController.show, viewController.edit);
router.put('/:id', authDataController.auth, dataController.update, viewController.redirectShow);
router.delete('/:id', authDataController.auth, dataController.destroy, viewController.redirectHome);

module.exports = router;
