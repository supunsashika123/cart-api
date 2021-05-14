const db = require('../helpers/database');
const foodService = require('../food/food.service');

const Order = db.Order;

module.exports = {
    create,
    getAll,
    update,
    getById,
    getWithItemInfo,
    getByUserId
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

async function getByUserId(customerId) {
    try {
        return await Order.find({ customerId: customerId })
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

async function getWithItemInfo(orders) {
    for (let j = 0; j < orders.length; j++) {
        let order = orders[j]
        //Bind food items
        for (let i = 0; i < order.items.length; i++) {
            let foodItem = await foodService.getById(order.items[i].itemId)
            order.items[i].item = foodItem
        }
    }

    return orders
}