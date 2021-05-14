const express = require('express');
const { body, query, validationResult } = require('express-validator');
const { success, error, validation } = require("../helpers/responses");

const orderService = require('./order.service');
const cartService = require('../cart/cart.service');
const foodService = require('../food/food.service');
const router = express.Router();

router.post('/', validate('create'), create);
router.get('/', getAll);
router.get('/:id', getById);
router.put('/:id', validate('create'), update);

module.exports = router;

function validate(method) {
    switch (method) {
        case 'create': {
            return [
                body('total', 'Price doesn\'t exist.').exists(),
                body('items', 'Items doesn\'t exist.').exists(),
            ]
        }
    }
}

async function create(req, res) {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(422).json(validation(errors.array()));
            return;
        }

        let newOrder = await orderService.create({ ...req.body, customerId: req.user.id });
        await cartService.deleteByCustomerId(req.user.id)

        return res.status(200).json(success("OK", newOrder, res.statusCode))
    } catch (e) {
        return res.status(500).json(error(e.message));
    }
}

async function getAll(req, res) {
    try {
        let orders = await orderService.getAll();

        for (let j = 0; j < orders.length; j++) {
            let order = orders[j]
            //Bind food items
            for (let i = 0; i < order.items.length; i++) {
                let foodItem = await foodService.getById(order.items[i].itemId)
                order.items[i].item = foodItem
            }
        }

        return res.status(200).json(success("OK", orders, res.statusCode))
    } catch (e) {
        return res.status(500).json(error(e.message));
    }
}

async function getById(req, res) {
    try {
        let orders = await orderService.getById(req.params.id);

        return res.status(200).json(success("OK", orders, res.statusCode))
    } catch (e) {
        return res.status(500).json(error(e.message));
    }
}

async function update(req, res) {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(422).json(validation(errors.array()));
            return;
        }

        let updatedOrder = await orderService.update(req.body, req.params.id)

        return res.status(200).json(success("OK", updatedOrder, res.statusCode))
    } catch (e) {
        return res.status(500).json(error(e.message));
    }
}
