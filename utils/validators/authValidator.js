const { check } = require('express-validator');
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const User = require('../../models/userModel');

exports.signupValidator = [
check("username")
    .notEmpty()
    .withMessage('username required'),
check('email')
    .notEmpty()
    .withMessage('Email required')
    .isEmail()
    .withMessage('Invalid email address')
    .custom((val) =>
        User.findOne({ email: val }).then((user) => {
        if (user) {
            return Promise.reject('E-mail already in user');
        }
    })
    ),
check('phoneNumber')
    .notEmpty()
    .withMessage('phone number required')
    .isMobilePhone()
    .withMessage("Invalid format"),
check('password')
    .notEmpty()
    .withMessage('Password required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .custom((password, { req }) => {
        if (password !== req.body.passwordConfirm) {
        throw new Error('Password Confirmation incorrect');
    }
        return true;
    }),

check('passwordConfirm')
    .notEmpty()
    .withMessage('Password confirmation required'),

validatorMiddleware,
];

exports.loginValidator = [
check('email')
    .notEmpty()
    .withMessage('Email required')
    .isEmail()
    .withMessage('Invalid email address'),

check('password')
    .notEmpty()
    .withMessage('Password required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),

validatorMiddleware,
];

exports.changePassword_Validator = [
    check('old_password')
    .notEmpty()
    .withMessage('old password required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
    check('new_password')
    .notEmpty()
    .withMessage('New Password required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .custom((new_password, { req }) => {
        if (new_password !== req.body.passwordConfirm) {
        throw new Error('Password Confirmation incorrect');
    }
        return true;
    }),
    check('passwordConfirm')
    .notEmpty()
    .withMessage('Password confirmation required'),

validatorMiddleware,
];

exports.resetValidator = [
    check('new_password')
    .notEmpty()
    .withMessage('New Password required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .custom((new_password, { req }) => {
        if (new_password !== req.body.passwordConfirm) {
        throw new Error('Password Confirmation incorrect');
    }
        return true;
    }),
    check('passwordConfirm')
    .notEmpty()
    .withMessage('Password confirmation required'),

validatorMiddleware,
];

exports.rateValidator = [
    check('rating')
    .notEmpty()
    .withMessage('rate required')
    .isLength({ min: 1 })
    .withMessage('rate must be at least 1 characters')
    ,
    check('comment')
    .notEmpty()
    .withMessage('comment required'),

    //validatorMiddleware,
];