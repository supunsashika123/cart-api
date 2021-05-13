const express = require('express');
const userService = require('./user.service');
const { OAuth2Client } = require('google-auth-library')
const router = express.Router();
const { body, validationResult } = require('express-validator');
const nodemailer = require('nodemailer')
var jwt = require('jsonwebtoken');
const { GOOGLE_AUTH_CLIENT_KEY, JWT_SECRET } = require('../../config');
const { success, error, validation } = require("../helpers/responses");
const bcrypt = require('bcrypt');

router.post('/signup', validate('signUp'), signUp);
router.post('/googlelogin', googleLogin)
router.post('/login', validate('login'), login)
router.post('/forgot-pw', validate('forgetPw'), forgetPw)
router.post('/reset-pw/:token', resetPassword)

function validate(method) {
    switch (method) {
        case 'forgetPw': {
            return [
                body('email', 'Email doesn\'t exist.').exists(),
                body('email', 'Email is empty.').notEmpty(),
                body('email', 'Email is invalid.').isEmail(),
            ]
        }
        case 'login': {
            return [
                body('email', 'Email doesn\'t exist.').exists(),
                body('password', 'Password doesn\'t exist.').exists(),
                body('email', 'Email is empty.').notEmpty(),
                body('password', 'Password is empty.').notEmpty(),
            ]
        }
        case 'signUp': {
            return [
                body('name', 'Name doesn\'t exist.').exists(),
                body('name', 'Name is empty.').notEmpty(),
                body('email', 'Email doesn\'t exist.').exists(),
                body('email', 'Email is empty.').notEmpty(),
                body('email', 'Email is invalid.').isEmail(),
                body('password', 'Password doesn\'t exist.').exists(),
                body('password', 'Password is empty.').notEmpty(),
                body('confirmPassword', 'Confirm password doesn\'t exist.').exists(),
                body('confirmPassword', 'Confirm password is empty.').notEmpty(),
            ]
        }
    }
}


const client = new OAuth2Client(GOOGLE_AUTH_CLIENT_KEY)

module.exports = router;

async function signUp(req, res) {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(422).json(validation(errors.array()));
            return;
        }

        if (req.body.password !== req.body.confirmPassword) {
            res.status(422).json(validation([{ msg: "Passwords does not match!" }]));
        }

        let salt = bcrypt.genSaltSync(10);
        req.body.password = bcrypt.hashSync(req.body.password, salt);

        let existingUsers = await userService.getByEmail(req.body.email)

        if (existingUsers.length) {
            res.status(409).json(validation([{ msg: "User already exists!" }]))

            return
        }

        let newUser = await userService.create(req.body)
        let token = jwt.sign({ id: newUser._id }, JWT_SECRET);

        return res.status(200).json(success("OK", { user: newUser, token }, res.statusCode))
    } catch (e) {
        return res.status(500).json(error(e.message));
    }
}

async function googleLogin(req, res) {
    try {
        let googleResponse = await client.verifyIdToken(
            {
                idToken: req.body.tokenID,
                audience: "37361668095-bhna113hnh345ot5rpj7ddhfcubsr6sa.apps.googleusercontent.com"
            }
        )

        const { email_verified, name, email } = googleResponse.payload;

        if (!email_verified) {
            return res.status(409).json(validation([{ msg: "Invalid email!" }]))
        }

        let existingUsers = await userService.getByEmail(email)
        if (existingUsers.length) {
            let token = jwt.sign({ id: existingUsers[0]._id }, JWT_SECRET);

            return res.status(200).json(success("OK", { user: existingUsers[0], token }, res.statusCode))
        }

        let createdUser = userService.create({ name, email });
        let token = jwt.sign({ id: createdUser._id }, JWT_SECRET);

        res.status(200).json(success("OK", { user: createdUser, token }, res.statusCode))
    } catch (e) {
        return res.status(500).json(error(e.message));
    }

}

async function login(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.status(422).json(validation(errors.array()));
        return;
    }

    let users = await userService.getByEmail(req.body.email)
    if (!users.length || !users[0].password) {
        return res.status(404).json(validation([{ msg: "Invalid credentials!" }]))
    }

    if (!bcrypt.compareSync(req.body.password, users[0].password)) {
        return res.status(400).json(validation([{ msg: "Invalid credentials!" }]))
    }

    let token = jwt.sign({ id: users[0]._id }, JWT_SECRET);

    return res.status(200).json(success("OK", { user: users[0], token }, res.statusCode))
}

async function forgetPw(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.status(422).json(validation(errors.array()));
        return;
    }

    let users = await userService.getByEmail(req.body.email)
    if (!users.length) {
        return res.status(404).json(validation([{ msg: "Invalid credentials!" }]))
    }

    const token = Math.random().toString(36).substr(2)
    await userService.update({ resetToken: token }, users[0]._id)

    const tran = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'bthunder1001@gmail.com',
            pass: 'cartapp123',
        },
    });

    const mailDet = {
        from: 'bthunder1001@gmail.com',
        to: `${users[0].email}`,
        subject: 'Link to Reset Password',
        text: `http://localhost:3000/reset-password/${token}`
    };

    tran.sendMail(mailDet, (err, response) => {
        if (err) {
            return res.status(500).json(error([{ msg: 'Email send error!' }]))
        }

        return res.status(200).json(success("OK"))
    });
}

async function resetPassword(req, res) {
    let users = await userService.findByToken(req.params.token)
    if (!users.length) {
        return res.status(404).json(validation([{ msg: "Invalid token!" }]))
    }

    let salt = bcrypt.genSaltSync(10);
    let newPassword = bcrypt.hashSync(req.body.password, salt);

    let updatedUser = await userService.update({ password: newPassword, resetToken: null }, users[0]._id)
    return res.status(200).json(success("OK", updatedUser, res.statusCode))
}
