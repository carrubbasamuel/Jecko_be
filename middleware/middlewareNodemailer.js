const nodemailer = require('nodemailer');
const { generateRandomCode, handleMapResetCode } = require('./middlewareResetPass') 




const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
    }
});


function passwordRestore(email) {
    const resetPass = generateRandomCode();
    handleMapResetCode(resetPass)
    const mailOptions = {
        from: process.env.GMAIL_USER,
        to: email,
        subject: 'Recupero password',
        text: `Il tuo codice di recupero è: ${resetPass}`
    };
    transporter.sendMail(mailOptions);
    return resetPass
}

function welcomeEmail(email) {
    const mailOptions = {
        from: process.env.GMAIL_USER,
        to: email,
        subject: 'Benvenuto su Jecko',
        text: `Grazie per esserti registrato su Jecko!`
    };
    console.log('sending email');
    return transporter.sendMail(mailOptions);
}

module.exports = {
    passwordRestore,
    welcomeEmail
};