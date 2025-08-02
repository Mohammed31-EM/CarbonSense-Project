const express = require('express');
const router = express.Router();

const dataController = require('./dataController');
const viewController = require('./viewController');
const plantViewController = require('../plant/viewController');

// ✅ SIGNUP PAGE
router.get('/', viewController.signUp);
router.get('/signup', viewController.signUp); // optional alias

// ✅ LOGIN PAGE
router.get('/login', viewController.signIn);

// ✅ SIGNUP (Create a new user)
router.post('/', dataController.createUser, viewController.redirectToLogin);

// ✅ LOGIN (Authenticate user and redirect to plants)
router.post('/login', dataController.loginUser, plantViewController.redirectHome);

// ✅ UPDATE user by ID
router.put('/:id', dataController.updateUser);

// ✅ DELETE user (requires auth)
router.delete('/:id', dataController.auth, dataController.deleteUser);

module.exports = router;
