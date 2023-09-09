const { validationResult, check } = require('express-validator');

const loginValidation = [
    check('email').isEmail().withMessage('Email is required'),
    check('password').notEmpty().withMessage('Password is required'),
]

const signupValidation = [
    check('email').isEmail().withMessage('Not valid email'),
    check('password').notEmpty().withMessage('Password is required').isLength({ min: 6 }).withMessage('Not valid password (min 6 char)'),
    check('username').notEmpty().withMessage('Username is required'),
    check('name').notEmpty().withMessage('Name is required'),
    check('surname').notEmpty().withMessage('Surname is required'),
    check('phone').notEmpty().withMessage('Phone is required'),
    check('birthdate').notEmpty().withMessage('Birthdate is required'),
]

const eventValidation = [
    check('title').notEmpty().withMessage('Title is required'),
    check('dateStart').notEmpty().withMessage('Date start is required'),
    check('dateEnd').notEmpty().withMessage('Date end is required'),
    check('location').notEmpty().withMessage('Location is required'),
    check('description').notEmpty().withMessage('Description is required'),
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
    validationMiddleware
}
