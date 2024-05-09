const nodeMailer = require('nodemailer');
const sendGridTransport = require('nodemailer-sendgrid-transport');

const sendMail = (email, subject, message) => {


    const promise = new Promise((resolve, reject) => {
        const transporter = nodeMailer.createTransport(sendGridTransport({
            auth: {
                api_key: process.env.API_KEY
            }
        }))


        transporter.sendMail({
            from: 'ahtshamsaleem51@gmail.com',
            to: email,
            subject: subject,
            html: message
        },
    
        (error) => {
            if(!error) {
                //console.log('Email sent successfully.');
                resolve(true);
                //return true;
            } else {
                //console.log('Error occured while sending email.', error);

                reject('Error occured while sending email.', error);
                //return false;
            }
        })
    })


    return promise;



   



}



module.exports = sendMail;




