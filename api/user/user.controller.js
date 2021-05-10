const express = require('express');
const userService = require('./user.service');

const router = express.Router();

router.post('/signup', signUp);

module.exports = router;

async function signUp(req, res) {
    try {
        let newUser = req.body;

        // let user =  await userService.getUnique({email: req.body.email});
        // if(user) return res.status(Codes.NOT_FOUND).json(failed("Email already exists."));

        // let salt = bcrypt.genSaltSync(parseInt(process.env.SALT_ROUNDS));
        // newUser.password = bcrypt.hashSync(newUser.password, salt);

        let createdUser = await userService.create(newUser);

        if (!createdUser._id) {
            return res.status(400).json({ error: 'damn' });
        }

        return res.json({ success: "user has been created.", createdUser })
    } catch (e) {
        console.log(e)
        return res.status(400).json({ error: e });
    }
}
