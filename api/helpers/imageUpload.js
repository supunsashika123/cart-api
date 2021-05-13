var cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: 'dhvertbtq',
    api_key: '418432274615827',
    api_secret: 'kRfHieMsRwL6rx5rzOkbKNhsdsg'
});

function uploadFood(file) {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(
            file,
            {
                folder: 'foods'
            },
            function (error, result) {
                console.log(result)
                console.log(error)
                return resolve(result)
            });
    })
}

module.exports = uploadFood