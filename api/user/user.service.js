const { Guser } = require('../helpers/database');
const db = require('../helpers/database');
const User = db.User;

module.exports = {
    create,
    // update,
}

async function create(user) {
    const new_user = User(user);
    let response = {};
    try {
        response = await new_user.save();
    } catch (err) {
        console.log(err)
        response.error = "There was an issue while creating the user.";
    }
    return response;
}


// async function update(user, id) {
//     const found_user = await User.findOne({ _id: id });

//     Object.assign(found_user, user);

//     let response = {};
//     try {
//         response = await found_user.save();
//     } catch (err) {
//         console.log(err)
//         response.error = "There was an issue while updating the user.";
//     }
//     return response;
// }

