const express = require('express');
const router = express.Router();

const authDataController = require('../auth/dataController');
const apiController = require('./apiController')
const dataController = require('./dataController');
const viewController = require('./viewController');

router.get('/new', authDataController.auth, viewController.newView);
router.get('/:id/edit', authDataController.auth, dataController.show, viewController.edit);
router.get('/', authDataController.auth, dataController.index, viewController.index);
router.post('/', authDataController.auth, dataController.create, viewController.redirectHome);
router.get('/:id', authDataController.auth, dataController.show, viewController.show);
router.put('/:id', authDataController.auth, dataController.update, viewController.redirectShow);
router.delete('/:id', authDataController.auth, dataController.destroy, viewController.redirectHome);

router.get('/api',authDataController.auth, dataController.index, apiController.index);
router.get('/api/:id', authDataController.auth, dataController.show, apiController.show);
router.post('/api', authDataController.auth, dataController.create, apiController.create);
router.put('/api/:id', authDataController.auth, dataController.update, apiController.update);
router.delete('/api/:id', authDataController.auth, dataController.destroy, apiController.destroy)
module.exports = router;
