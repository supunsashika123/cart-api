const db = require('../helpers/database');
const Cart = db.Cart;

module.exports = {
    create,
    getAll,
    update,
    getById,
    getByCustomerId
}

async function getByCustomerId(customerId) {
    try {
        return await Cart.find({ customerId: customerId })
    } catch (err) {
        throw new Error(err)
    }
}

async function create(cart) {
    try {
        const newCart = Cart(cart);

        return await newCart.save();
    } catch (err) {
        throw new Error(err)
    }
}

async function getAll() {
    try {
        return await Cart.find({})
    } catch (err) {
        throw new Error(err)
    }
}

async function update(cart, id) {
    try {
        const foundCart = await Cart.findOne({ _id: id });
        foundCart.overwrite(cart)

        return await foundCart.save();
    } catch (err) {
        throw new Error(err)
    }
}

async function getById(id) {
    try {
        return await Cart.findById(id);
    } catch (err) {
        throw new Error(err)
    }
}
