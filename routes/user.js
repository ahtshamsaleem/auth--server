const express = require('express');
const userController = require('../controllers/user');
const { body } = require('express-validator');

const router = express.Router();


// GET USER DATA
router.get('/user/:id',  userController.getUserData );

module.exports = router;



