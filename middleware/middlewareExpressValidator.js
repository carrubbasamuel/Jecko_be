const { validationResult, check } = require('express-validator');

const loginValidation = [
    check('email').isEmail().withMessage('Inserisci una email'),
    check('password').notEmpty().withMessage('Inserisci una password'),
]

const signupValidation = [
    check('email').isEmail().withMessage('Email non valida'),
    check('password').notEmpty().withMessage('Inserisci una Password').isLength({ min: 6 }).withMessage('Numero minimo di caratteri 6'),
    check('username').notEmpty().withMessage('Inserisci un username').isLength({ min: 3 }).withMessage('Numero minimo di caratteri 3'),
    check('name').notEmpty().withMessage('Inserisci un nome'),
    check('surname').notEmpty().withMessage('Inserisci un cognome'),
    check('city').notEmpty().withMessage('Inserisci una città'),
    check('birthdate').notEmpty().withMessage('Inserisci una data di nascita'),
]

const eventValidation = [
    check('title').notEmpty().withMessage('Inserisci un titolo'),
    check('dateStart').notEmpty().withMessage('Inserisci una data di inizio'),
    check('dateEnd').notEmpty().withMessage('Inserisci una data di fine'),
    check('description').notEmpty().withMessage('Inserisci una descrizione'),
]

const validateResetPass = [
    check('password').notEmpty().withMessage('Inserisci una Password').isLength({ min: 6 }).withMessage('Numero minimo di caratteri 6'),
]

const validationMiddleware = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}



module.exports = {
    loginValidation,
    signupValidation,
    eventValidation,
    validateResetPass,
    validationMiddleware
}
