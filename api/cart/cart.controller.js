const express = require('express');
const { body, query, validationResult } = require('express-validator');
const { success, error, validation } = require("../helpers/responses");

const cartService = require('./cart.service');
const foodService = require('../food/food.service');

const router = express.Router();

router.post('/', validate('create'), create);
router.get('/', getForUser);
router.put('/:id', validate('create'), update);

module.exports = router;

function validate(method) {
    switch (method) {
        case 'create': {
            return [
                body('items', 'Items doesn\'t exist.').exists(),
                body('items', 'Items are empty.').notEmpty(),
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

        let existingCarts = await cartService.getByCustomerId(req.user.id)

        if (existingCarts.length) {
            let existingCart = existingCarts[0]

            req.body.items.forEach(newCartItem => {
                let existingItems = existingCart.items.filter(i => i.itemId == newCartItem.itemId)
                if (existingItems.length) {
                    existingItems[0].qty += 1
                } else {
                    existingCart.items.push(newCartItem)
                }
            })

            existingCart.total = await calculateTotalPrice(existingCart)
            let updatedCart = await cartService.update(existingCart, existingCart._id)

            return res.status(200).json(success("OKdd", updatedCart, res.statusCode))
        }

        let cart = req.body

        cart.total = await calculateTotalPrice(cart)
        cart.customerId = req.user.id
        let newCart = await cartService.create(cart)

        return res.status(200).json(success("OK", newCart, res.statusCode))
    } catch (e) {
        return res.status(500).json(error(e.message));
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

async function getForUser(req, res) {
    try {
        let carts = await cartService.getByCustomerId(req.user.id);
        if (!carts.length) {
            return res.status(404).json(error("No cart found.", 404));
        }

        let cart = carts[0]
        //Bind food items
        for (let i = 0; i < cart.items.length; i++) {
            let foodItem = await foodService.getById(cart.items[i].itemId)
            cart.items[i].item = foodItem
        }

        return res.status(200).json(success("OK", cart, res.statusCode))
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

        let updatedCart = await cartService.update(req.body, req.params.id)

        return res.status(200).json(success("OK", updatedCart, res.statusCode))
    } catch (e) {
        return res.status(500).json(error(e.message));
    }
}
