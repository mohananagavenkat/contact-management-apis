const nodemailer = require("nodemailer");
const config = require("../config/config");

const transporter = nodemailer.createTransport({
    host: config.mailServer.host,
    port: 2525,
    secure: false, // true for 465, false for other ports
    auth: {
        user: config.mailServer.userName,
        pass: config.mailServer.password
    }
});

const userActivationEmail = (userEmail,token) => {
    let mailOptions = {
        from: '"Contact Manager 👻" <noreply@contactmanager.com>', // sender address
        to: userEmail, // list of receivers
        subject: "Contact Manager - Thankyou For Creating Account. Please Activate Your Account ✔", // Subject line
        html: `<h3>Welcome To Contact Manager 👻</h3>
                    <p>please click on the link to activate your account <a href="${config.frontEndURL}/user/activate/${token}">Click Here</a></p>`
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            return false;
        }
        console.log(
            "User activation email sent successfully 👍. MessageId : %s",
            info.messageId
        );
        return true;
    });
}

const forgotPasswordEmail = (userEmail,token) => {
    let mailOptions = {
        from: '"Contact Manager 👻" <noreply@contactmanager.com>', // sender address
        to: userEmail, // list of receivers
        subject: "Forgot Password - Click on the link to reset your password 👍 ", // Subject line
        html: `<h3>We have received forgot password request for your email 🤔 </h3>
                    <p>please click on the link to change your password <a href="${config.frontEndURL}/reset-password/${token}">Click Here</a></p>`
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            return false;
        }
        console.log(
            "forgotpassword email sent successfully 👍. MessageId : %s",
            info.messageId
        );
        return true;
    });
}

module.exports = {
    send:{
        userActivationEmail,
        forgotPasswordEmail
    }
}