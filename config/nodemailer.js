require('dotenv').config()
const nodemailer = require("nodemailer");
const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = process.env.SMTP_PORT;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;


function sendMail(from, to, subject, content) {
    smtpProtocol = nodemailer.createTransport({
        host: SMTP_HOST,
        port: SMTP_PORT,
        secure: false,
        auth: {
            user: SMTP_USER,
            pass: SMTP_PASS,
        },
    });

    var mailoption = {
        from: from + `<${SMTP_USER}>`,
        to: to,
        subject: subject,
        html: content
    }

    smtpProtocol.sendMail(mailoption, function (err, response) {
        if (err) {
            console.log(err);
        }
        console.log('Message Sent');
        smtpProtocol.close();
    });
}

module.exports = sendMail