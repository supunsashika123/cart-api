const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../../config');
const { success, error, validation } = require("../helpers/responses");

const openUrls = [
    '/user/login',
    '/user/signup',
    '/user/googlelogin',
    '/user/forgot-pw',
]

function authenticateToken(req, res, next) {
    console.log(req.url)
    if (openUrls.indexOf(req.url) !== -1) {
        return next()
    }

    if (req.url.includes('/user/reset-pw/')) {
        return next()
    }

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1]
    if (!token) {
        return res.status(401).json(error("Unauthorized.", 401));
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(401).json(error("Unauthorized.", 401));
        }

        req.user = user;
        return next();
    })
}

// function adminOnly(req, res, next) {
//     if (req.user.type && req.user.type === 'admin') {
//         return next();
//     }
//     return res.status(403).send(failed("Only admins are authorized for this action!"));
// }

function createToken(info) {
    return jwt.sign(info, JWT_SECRET);
}

module.exports = {
    authenticateToken,
    createToken,
    // adminOnly
}
