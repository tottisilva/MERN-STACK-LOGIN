// For create a send email i wil use the nodemailer and sendgrid

const nodemailer = require('nodemailer');

//This function wil be dynamic
const sendEmail = (options) =>{
    const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        auth:{
            user: process.env.EMAIL_USERNAME,
            password: process.env.EMAIL_PASSWORD
        }
    });

    const emailOptions = {
        from: process.env.EMAIL_FROM,
        to: options.to,
        subject: options.subject,
        html: options.text
    }

    transporter.sendMail(emailOptions, function(err, info){
        if(err){
            console.log(err);
        } else {
            console.log(info);
        }
    });
};
module.exports = sendEmail;