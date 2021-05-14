const db = require('../helpers/database');
const foodService = require('../food/food.service');
const Cart = db.Cart;

module.exports = {
    create,
    getAll,
    update,
    getById,
    getByCustomerId,
    deleteByCustomerId,
    calculateTotalPrice,
    deleteById
}

async function getByCustomerId(customerId) {
    try {
        return await Cart.find({ customerId: customerId })
    } catch (err) {
        throw new Error(err)
    }
}

async function deleteByCustomerId(customerId) {
    try {
        return await Cart.deleteOne({ customerId: customerId })
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

async function calculateTotalPrice(cart) {
    let total = 0

    for (let i = 0; i < cart.items.length; i++) {
        let foodItem = await foodService.getById(cart.items[i].itemId)
        total += +foodItem.price * cart.items[i].qty
    }

    return total
}

async function deleteById(id) {
    try {
        await Cart.deleteOne({ _id: id })
    } catch (err) {
        throw new Error(err)
    }
}