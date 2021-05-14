const db = require('../helpers/database');
const Order = db.Order;

module.exports = {
    create,
    getAll,
    update,
    getById
}

async function create(order) {
    try {
        const newOrder = Order(order);

        return await newOrder.save();
    } catch (err) {
        throw new Error(err)
    }
}

async function getAll() {
    try {
        return await Order.find({})
    } catch (err) {
        throw new Error(err)
    }
}

async function update(order, id) {
    try {
        const foundOrder = await Order.findOne({ _id: id });
        Object.assign(foundOrder, order);

        return foundOrder.save();
    } catch (err) {
        throw new Error(err)
    }
}

async function getById(id) {
    try {
        return await Order.findById(id);
    } catch (err) {
        throw new Error(err)
    }
}
