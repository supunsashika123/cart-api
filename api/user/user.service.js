const { Guser } = require('../helpers/database');
const db = require('../helpers/database');
const User = db.User;

module.exports = {
    create,
    getByEmail,
    findByToken,
    update,
    getById
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

async function getByEmail(email) {
    try {
        return await User.find({ email: email })
    } catch(err) {
        throw new Error(err)
    }
}

async function findByToken(token) {
    try {
        return await User.find({ resetToken: token })
    } catch(err) {
        throw new Error(err)
    }
}

async function update(user, id) {
    try {
        const foundUser = await User.findOne({ _id: id });
        Object.assign(foundUser, user);

        return foundUser.save();
    } catch (err) {
        throw new Error(err)
    }
}

async function getById(id) {
    try {
        return await User.findById(id);
    } catch (err) {
        throw new Error(err)
    }
}
