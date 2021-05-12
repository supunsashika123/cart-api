const express = require('express');
const { body, validationResult } = require('express-validator');
const { success, error, validation } = require("../helpers/responses");

const foodService = require('./food.service');
const router = express.Router();

router.post('/', validate('create'), create);
router.get('/', getAll);

module.exports = router;

function validate(method) {
    switch (method) {
        case 'create': {
            return [
                body('name', 'Food name doesn\'t exist.').exists(),
                body('name', 'Food name is empty.').notEmpty(),
                body('description', 'Description doesn\'t exist.').exists(),
                body('description', 'Description is empty.').notEmpty(),
                body('category', 'Category doesn\'t exist.').exists(),
                body('category', 'Category is empty.').notEmpty(),
                body('price', 'Price doesn\'t exist.').exists(),
                body('price', 'Price is empty.').notEmpty(),
                body('price', 'Price needs to be a number.').isNumeric(),
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

        let createdFood = await foodService.create(req.body);

        return res.status(200).json(success("OK", createdFood, res.statusCode))
    } catch (e) {
        return res.status(500).json(error(e.message));
    }
}

async function getAll(req, res) {
    try {
        let foods = await foodService.getAll();

        return res.status(200).json(success("OK", foods, res.statusCode))
    } catch (e) {
        return res.status(500).json(error(e.message));
    }
}
