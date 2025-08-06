const express = require('express');
const router = express.Router();

const authDataController = require('../auth/dataController');
const dataController = require('./dataController');
const viewController = require('./viewController');

router.get('/new', authDataController.auth, viewController.newView);
router.get('/', authDataController.auth, dataController.index, viewController.index);
router.post('/', authDataController.auth, dataController.create, viewController.redirectHome);
router.get('/:id', authDataController.auth, dataController.show, viewController.show);
router.get('/:id/edit', authDataController.auth, dataController.show, viewController.edit);
router.put('/:id', authDataController.auth, dataController.update, viewController.redirectShow);
router.delete('/:id', authDataController.auth, dataController.destroy, viewController.redirectHome);

module.exports = router;
