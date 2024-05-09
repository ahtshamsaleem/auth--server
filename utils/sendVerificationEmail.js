const nodeMailer = require('nodemailer');
const sendGridTransport = require('nodemailer-sendgrid-transport');
const jwt = require('jsonwebtoken');
const sendMail = require('./sendMail');

const sendVerficationEmail = async (email) => {

    const token = jwt.sign({
        email: email,
    }, process.env.JWT_SECRET ,  { expiresIn: '10m' } );


    let message = `Hi! There, You have recently visited  
    our website and entered your email. 
    Please follow the given link to verify your email 
    http://localhost:8000/verify/${token}
    Thanks` 

    


    return await sendMail(email, 'Email Verification', message);
}



module.exports = sendVerficationEmail;




