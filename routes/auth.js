const express = require('express');
const authController = require('../controllers/auth');
const { body } = require('express-validator');

const router = express.Router();


// SIGN UP
router.post('/signup', 

    body('email').isEmail().withMessage('Please Enter a valid Email Address') .normalizeEmail() ,
    body('password').trim().isStrongPassword({ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 }).withMessage('Please Enter a valid Password | Password should be atleast 8 characters long, including 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character.'),
    body('name') .trim() .not() .isEmpty().withMessage('Please Enter a valid Name')


, authController.signUp);

module.exports = router;





// LOGIN 
router.post('/login', 

    body('email').isEmail().withMessage('Please Enter a valid Email Address') .normalizeEmail() ,
    body('password').trim().isStrongPassword({ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 }).withMessage('Please Enter a valid Password | Password should be atleast 8 characters long, including 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character.'),
 
    authController.login);

module.exports = router;















// RESET PASSWORD REQUEST
router.post('/req-reset-password', 
        body('email').isEmail().withMessage('Please Enter a valid Email Address') .normalizeEmail(),
        authController.sendToken )









//      RESET PASSWORD

router.post('/reset-password', 
        body('password').trim().isStrongPassword({ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 }).withMessage('Please Enter a valid Password | Password should be atleast 8 characters long, including 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character.'),
        authController.resetPassword )
















router.get('/verify/:token',  authController.verifyEmail)