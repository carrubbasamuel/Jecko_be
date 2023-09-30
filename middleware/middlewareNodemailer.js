const nodemailer = require('nodemailer');
const { generateRandomCode, handleMapResetCode } = require('./middlewareResetPass')
const fs = require('fs');
const path = require('path');




const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
    }
});

function passwordRestore(email) {
    const resetPass = generateRandomCode();
    const templatePath = path.join(__dirname, '../template/template-resetpass.html');
    const template = fs.readFileSync(templatePath, 'utf8');

    const mailOptions = {
        from: process.env.GMAIL_USER,
        to: email,
        subject: 'Recupero password',
        html: template.replace('{{resetPass}}', resetPass)
    };
    transporter.sendMail(mailOptions);
    return resetPass
}





function welcomeEmail(email) {
    const templatePath = path.join(__dirname, '../template/template-walcome.html');
    const template = fs.readFileSync(templatePath, 'utf8');


    const mailOptions = {
        from: process.env.GMAIL_USER,
        to: email,
        subject: 'Benvenuto su Jecko🏀😁',
        html: template
    };

    return transporter.sendMail(mailOptions);
}

module.exports = {
    passwordRestore,
    welcomeEmail
};