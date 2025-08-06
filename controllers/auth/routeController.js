const express = require('express');
const router = express.Router();

const dataController = require('./dataController');
const viewController = require('./viewController');
const plantViewController = require('../plant/viewController');

router.get('/', viewController.signUp);
router.get('/signup', viewController.signUp); 
router.get('/login', viewController.signIn);
router.post('/', dataController.createUser, viewController.redirectToLogin);
router.post('/login', dataController.loginUser, plantViewController.redirectHome);
router.put('/:id', dataController.updateUser);
router.delete('/:id', dataController.auth, dataController.deleteUser);

module.exports = router;
