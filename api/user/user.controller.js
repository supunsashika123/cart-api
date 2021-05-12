const express = require('express');
const userService = require('./user.service');
const { OAuth2Client } = require('google-auth-library')
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { Guser, User, Token } = require('../helpers/database');
const crypto = require('crypto')
const nodemailer = require('nodemailer')
var jwt = require('jsonwebtoken');

router.post('/signup', signUp);
router.post('/googlelogin', googleLogin)
router.post('/login', logIn)
router.post('/forget-pw', forgetPw)
router.get('/reset', resetPw)

const client = new OAuth2Client("37361668095-bhna113hnh345ot5rpj7ddhfcubsr6sa.apps.googleusercontent.com")

module.exports = router;

async function signUp(req, res) {

    // const error = validationResult(req);

    // if (!error.isEmpty()) {
    //     return res.status(400).send(error.array())
    // }
    // else {
    try {
        // let user = await userService.getUnique({ email: req.body.email });
        // if (user) return res.status(Codes.NOT_FOUND).json(failed("Email already exists."));

        // let salt = bcrypt.genSaltSync(parseInt(process.env.SALT_ROUNDS));
        // newUser.password = bcrypt.hashSync(newUser.password, salt);

        let newUser = req.body;
        User.find({ email: req.body.email })
            .exec()
            .then(ppl => {

                if (ppl.length > 0) {

                    return res.status(200).json({
                        message: "user existed"
                    })
                }
                else {

                    let createdUser = userService.create(newUser);
                    return res.json({ message: "user has been created.", createdUser })
                }

            });
    } catch (e) {
        console.log(e);
        return res.json({ error: e });
    }
    // }
}

async function googleLogin(req, res) {


    client.verifyIdToken({ idToken: req.body.tokenID, audience: "37361668095-bhna113hnh345ot5rpj7ddhfcubsr6sa.apps.googleusercontent.com" }).then(response => {


        const { email_verified, name, email } = response.payload;
        if (email_verified) {

            Guser.findOne({ email }).exec((err, user) => {

                if (err) {
                    return res.status(200).json({
                        error: "Google Account Verification went wrong"
                    })
                }
                else {
                    if (user) {

                        const token = jwt.sign({ name: user.name, email: user.email }, process.env.GSIGN_AUTH_KEY, { expiresIn: "1h" });
                        return res.status(200).json({
                            message: "Auth Successful",
                            token: token,
                            isLogged: true
                        });
                    }
                    else {
                        try {
                            let newUser = new Guser({ name, email })
                            let createdUser = userService.Gcreate(newUser);

                            const token = jwt.sign({ name: name, email: email }, process.env.GSIGN_AUTH_KEY, { expiresIn: "1h" });
                            return res.status(200).json({
                                message: "Auth Successful",
                                token: token,
                                isLogged: true
                            });

                            return res.json({ success: "user has been created.", createdUser })
                        } catch (e) {
                            console.log(e);
                            return res.status(200).json({ message: e });
                        }



                    }
                }
            })
        }

    })

}

async function logIn(req, res) {


    User.find({ email: req.body.email })
        .exec()
        .then(ppl => {

            if (ppl.length < 1) {

                return res.status(200).json({
                    message: "user not existed"
                })
            } else {
                if (req.body.password === ppl[0].password) {
                    const token = jwt.sign({ name: ppl[0].name, email: ppl[0].email }, process.env.GSIGN_AUTH_KEY, { expiresIn: "1h" });
                    return res.status(200).json({
                        message: "Auth Successful",
                        token: token,
                        isLogged: true
                    });
                }
                else {
                    return res.status(200).json({
                        error: "Account Verification went wrong"
                    })
                }


            }

        })
        .catch(err => {
            if (err) {
                console.log(err);
                res.status(500).json({
                    error: err
                })
            }
        })

}

async function forgetPw(req, res) {

    
    console.log(req.body.email)
    User.findOne({ 
            email : req.body.email
    })
        .then(user => {
            if (user) {
                console.log(user);
                const token = crypto.randomBytes(25).toString('hex')

                Token({
                    email: req.body.email,
                    token: token,
                    createdAt: Date.now()
                }).save();
               

                const tran = nodemailer.createTransport({

                    service: 'gmail',
                    auth: {
                        user: `${process.env.EMAIL_ADD}`,
                        pass: `${process.env.EMAIL_PASS}`,
                    },
                });

                const mailDet = {
                    from: 'bthunder1001@gmail.com',
                    to: `${user.email}`,
                    subject: 'Link to Reset Password',
                    text: `http://localhost:3000/auth/reset-pw/${token}`
                };

                tran.sendMail(mailDet, (err, response) => {

                    if (err) {
                        res.json({
                            error: err
                        });
                    }
                    else {
                        res.json({
                            message: 'recover email has been sent'
                        });
                    }

                });

            }
            else {
                res.json({
                    message: 'email not registered'
                });
            }
        });
}

async function resetPw(req, res) {

    console.log(req.body.token)
    Token.findOne({
   
            token: req.body.token,
            
    }).then(user =>{
        console.log(user)
        if(user == null)
        {
            res.json({
                error: 'password reset link is invalid or has expired'
            })
        }
        else
        {
            res.json({
                email: user.email,
                message: 'password reset link ok',
            });
        }
    });

}
