const nodemailer = require('nodemailer')
const { nodeMailerConfig } = require('../../config');

const tran = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: nodeMailerConfig.email,
        pass: nodeMailerConfig.password,
    },
});

function sendEmail(toEmail, title, body) {
    return new Promise((resolve, reject) => {
        const mailDet = {
            from: nodeMailerConfig.fromEmail,
            to: toEmail,
            subject: title,
            text: body
        };

        tran.sendMail(mailDet, (err, response) => {
            if (err) {
                return reject(err)
            }

            return resolve(resolve)
        });
    })
}


module.exports = sendEmail