const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: 'smtp.sendgrid.net',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: "AchyuthAchyuth",
        pass: "achyuth111"
    }
});

const userActivationEmail = (userEmail,token) => {
    let mailOptions = {
        from: '"Contact Manager 👻" <noreply@contactmanager.com>', // sender address
        to: userEmail, // list of receivers
        subject: "Contact Manager - Thankyou For Creating Account. Please Activate Your Account ✔", // Subject line
        html: `<h3>Welcome To Contact Manager 👻</h3>
                    <p>please click on the link to activate your account <a href="http://localhost:3001/activate_user/${token}">Click Here</a></p>`
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            return false;
        }
        console.log(
            "Message sent successfully 👍. MessageId : %s",
            info.messageId
        );
        return true;
    });
}

module.exports = {
    send:{
        userActivationEmail
    }
}