const express = require('express');
const router = express.Router();

const authDataController = require('../auth/apiController');
const dataController = require('./dataController');
const apiController = require('./apiController');
const viewController = require('./viewController');


router.get('/', authDataController.auth, dataController.index, viewController.index);
router.get('/new', authDataController.auth, viewController.newView);
router.get('/:id', authDataController.auth, dataController.show, viewController.show);
router.get('/:id/edit', authDataController.auth, dataController.show, viewController.edit);


router.get('/api', authDataController.auth, apiController.index);
router.get('/api/:id', authDataController.auth, apiController.show);
router.post('/', authDataController.auth, dataController.create, apiController.create);
router.put('/:id', authDataController.auth, dataController.update, apiController.update);
router.delete('/:id', authDataController.auth, dataController.destroy, apiController.destroy);

module.exports = router;
