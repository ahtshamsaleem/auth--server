const User = require('../models/user');
const Token = require('../models/token');
const crypto = require('crypto');
const { validationResult } = require('express-validator')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sendMail = require('../utils/sendMail');
const sendVerficationEmail = require('../utils/sendVerificationEmail');
const sendResetPassEmail = require('../utils/sendResetPassEmail');




exports.signUp = async (req, res, next) => {

    const validationErrors = validationResult(req);

    if(!validationErrors.isEmpty()) {
        const error = new Error(validationErrors.array()[0].msg);
        error.statusCode = 422;
        return next(error);
    }






    const {email, password, name} = req.body;

    try {
        const existedUser = await User.findOne({email: email});
    if (existedUser) {
        if(existedUser.verified === false) {
            await sendVerficationEmail(email);
            const error = new Error('Kindly Verify Your Email First! A new verification link has been sent to your email.');
            error.statusCode = 401;
            return next(error);
        }
        const error = new Error('User with this Email already exists!');
        error.statusCode = 422;
        return next(error);
    }
    



    const hashedPassword = await  bcrypt.hash(password, 12);
    const user = new User({
        email: email,
        password: hashedPassword,
        name: name,
    })
    const result = await user.save();

    const resultEmail = await sendVerficationEmail(email);


    res.status(201).json({
        message: 'New User is created',
        user: result,
        
    })
    } catch(err) {
        next(err);
    }




    

    

    
}

























exports.login = async (req, res ,next) => {
    const validationErrors = validationResult(req);

    if(!validationErrors.isEmpty()) {
        const error = new Error(validationErrors.array()[0].msg);
        error.statusCode = 422;      //validation failed
        return next(error);
    }


    const {email, password} = req.body;


    try {

        const user = await User.findOne({email: email});

        if(!user) {
            const error = new Error('User with this Email does not exist.');
            error.statusCode = 401;     //unauthorized
            throw error;
        }

        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) {
            const error = new Error('Password is wrong');
            error.statusCode = 401;
            throw error;
        }


        // json token sign in 

        const token = jwt.sign({
            email: user.email,
            userId: user._id.toString()
        }, 'secret' , {expiresIn: '1h'})







        res.json({
            message: 'user is logged in',
            token: token,
            userId: user._id
        })
    } catch (err) {
        next(err);
    }
    

}















// PASSWORD RESET REQUEST / SEND MAIL WITH TOKEN


exports.sendToken = async (req, res, next) => {

    const {email} = req.body;

    try {
        const user = await User.findOne({email: email});
    if(!user) {
        const error = new Error('No User exist with this email')
        throw error;
    }

    const token = await Token.findOne({userId: user._id});
    if (token) await token.deleteOne();

    let resetToken = crypto.randomBytes(32).toString('hex');
    const hash = await bcrypt.hash(resetToken, 12);

    const newToken = new Token({
        userId: user._id,
        token: hash,
        createdAt: Date.now()
    })

    const result = await newToken.save();

    const success = await sendResetPassEmail(user, resetToken);
    console.log(resetToken);

    res.json({
        message: 'Reset mail sent successfuly.',
        success: success
    })

    } catch(error) {
        next(error);
    }
    

    



}










// PASSWORD RESET

exports.resetPassword = async (req, res, next) => {
    //console.log(req.params)
    //console.log(req.query)

    const token = req.query.token;
    const userId = req.query.id;
    const password = req.body.password;

    try {
        let passwordResetTokenDB = await Token.findOne({ userId });
            if (!passwordResetTokenDB) {
            throw new Error("Invalid or expired password reset token / DB Token not found");
            }


    const isValid = await bcrypt.compare(token, passwordResetTokenDB.token)
    if (!isValid) {
        throw new Error("Invalid or expired password reset token / not right token as compared to db");
      }


      const hash = await bcrypt.hash(password, 12);
      await User.updateOne(
        { _id: userId },
        { $set: { password: hash } },
        { new: true }
      );


      const user = await User.findById({ _id: userId });

      const msgToSend = `
      <html>
      <body>
          <h2>Password Reset Successfully</h2>
          <div>
              <p> Your Password  has been succesfully changed ${user.name} </p>
          </div>
      </body>
      </html>
      `
      await sendMail(user.email, "Password Reset Successfully", msgToSend)

      await passwordResetTokenDB.deleteOne();

      res.status(201).json({
        message: 'Password has been successfully changed.'
      })
    } catch(error) {
        console.log(error);
        next(error);
    }



}






















// VERIFY EMAIL


exports.verifyEmail = async (req, res, next) => {
    const {token} = req.params; 
  
    // Verifying the JWT token  
    jwt.verify(token, process.env.JWT_SECRET , function(err, decoded) { 
        if (err) { 
            console.log(err); 
            res.json({
                success: false,
                error: err
                
            })
        } 
        else {  

            console.log(decoded);
            const user = User.updateOne(
                { email: decoded.email },
                { $set: { verified: true } },
                { new: true }
              ).then((user) => {


                res.json({
                    success: true,
                    user: user
                })
              })


            
        } 
    }); 
}