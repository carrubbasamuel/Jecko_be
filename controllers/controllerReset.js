const { passwordRestore } = require('../middleware/middlewareNodemailer')
const { handleMapResetCode, handleCheckPin } = require('../middleware/middlewareResetPass')
const SchemaUser = require('../models/SchemaUser')
const bcrypt = require('bcrypt');

const forgot = async (req,res) => {
    try {
        const ValidEmail = await SchemaUser.findOne({ email: req.body.email });
        

        if(ValidEmail){
            const code = passwordRestore(req.body.email);
            handleMapResetCode(code);
            res.status(200).json({email: req.body.email});
        } else {
            res.status(404).json({error: 'Email non valida'});
        }
    } catch (error) {
        res.status(500).json({error: 'Errore del server'});
    }
}


const checkPin = (req, res) => {
    try {
        const pin = req.body.pin;
        const verify = handleCheckPin(pin);

        if (verify) {
            res.status(200).json({ message: 'Pin corretto' });
        } else {
            res.status(404).json({ error: 'Pin non valido' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Errore del server' });
    }
}


const changePass = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    try {
        const user = await SchemaUser.findOne({ email: email }).exec();

        if (!user) {
            return res.status(404).json({ error: 'Utente non trovato' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        await user.save();

        return res.status(200).json({ message: 'Password cambiata' });
    } catch (error) {
        return res.status(500).json({ error: 'Errore durante il cambio password' });
    }
}


module.exports = {
    forgot,
    checkPin,
    changePass
}