const express = require('express');
const router = express.Router();

// Controllers
const userDataController = require('../controllers/auth/dataController');
const userApiController = require('../controllers/auth/apiController');

const plantDataController = require('../controllers/plant/dataController');
const plantApiController = require('../controllers/plant/apiController');

// const equipmentDataController = require('../controllers/equipment/dataController');
// const equipmentApiController = require('../controllers/equipment/apiController');

// const reportDataController = require('../controllers/report/dataController');
// const reportApiController = require('../controllers/report/apiController');

// ===========================
// ✅ USER API ROUTES
// ===========================
router.post('/users', userApiController.createUser);
router.post('/users/login', userApiController.loginUser);
router.get('/users/profile', userApiController.auth, userApiController.getProfile);
router.put('/users/:id', userApiController.auth, userApiController.updateUser);
router.delete('/users/:id', userApiController.auth, userApiController.deleteUser);


// ===========================
// ✅ PLANT API ROUTES
// ===========================
router.get('/plants', userDataController.auth, plantDataController.index, plantApiController.index);
router.get('/plants/:id', userDataController.auth, plantDataController.show, plantApiController.show);
router.post('/plants', userDataController.auth, plantDataController.create, plantApiController.create);
router.put('/plants/:id', userDataController.auth, plantDataController.update, plantApiController.update);
router.delete('/plants/:id', userDataController.auth, plantDataController.destroy, plantApiController.destroy);

// ===========================
// ✅ EQUIPMENT API ROUTES
// ===========================
router.get('/equipment', userDataController.auth, equipmentDataController.index, equipmentApiController.index);
router.get('/equipment/:id', userDataController.auth, equipmentDataController.show, equipmentApiController.show);
router.post('/equipment', userDataController.auth, equipmentDataController.create, equipmentApiController.create);
router.put('/equipment/:id', userDataController.auth, equipmentDataController.update, equipmentApiController.update);
router.delete('/equipment/:id', userDataController.auth, equipmentDataController.destroy, equipmentApiController.destroy);

// // ===========================
// // ✅ REPORT API ROUTES
// // ===========================
// router.get('/reports', userDataController.auth, reportDataController.index, reportApiController.index);
// router.get('/reports/:id', userDataController.auth, reportDataController.show, reportApiController.show);
// router.post('/reports', userDataController.auth, reportDataController.create, reportApiController.create);
// router.delete('/reports/:id', userDataController.auth, reportDataController.destroy, reportApiController.destroy);

module.exports = router;
