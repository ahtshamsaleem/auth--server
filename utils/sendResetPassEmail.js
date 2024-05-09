const sendMail = require("./sendMail");


const sendResetPassEmail = async (user, resetToken) => {

    const subject = "Password Reset Request";
    const link = `$https://auth-client-pi.vercel.app//reset-password?token=${resetToken}&id=${user._id}`;

    const msgToSend = `
    <html>
    <body>
        <h2>${subject}</h2>
        <div>
            <h3>Click on this link to reset passowrd</h3>
            <p>${link}</p>
        </div>
    </body>
    </html>
    `



    const result = await sendMail(user.email,subject,msgToSend);
    return result;
    
}


module.exports = sendResetPassEmail;