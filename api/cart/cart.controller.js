const express = require('express');
const { body, query, validationResult } = require('express-validator');
const { success, error, validation } = require("../helpers/responses");

const cartService = require('./cart.service');
const router = express.Router();

router.post('/', validate('create'), create);
router.get('/:id', getById);
router.put('/:id', validate('create'), update);

module.exports = router;

function validate(method) {
    switch (method) {
        case 'create': {
            return [
                // body('name', 'Food name doesn\'t exist.').exists(),
                // body('name', 'Food name is empty.').notEmpty(),
                // body('description', 'Description doesn\'t exist.').exists(),
                // body('description', 'Description is empty.').notEmpty(),
                // body('category', 'Category doesn\'t exist.').exists(),
                // body('category', 'Category is empty.').notEmpty(),
                // body('price', 'Price doesn\'t exist.').exists(),
                // body('price', 'Price is empty.').notEmpty(),
                // body('price', 'Price needs to be a number.').isNumeric(),
                // body('image', 'Image doesn\'t exist.').exists(),
            ]
        }
    }
}

async function create(req, res) {
    try {
        // const errors = validationResult(req);

        // if (!errors.isEmpty()) {
        //     res.status(422).json(validation(errors.array()));
        //     return;
        // }

        // let imageUploadResponse = await upload(req.body.image)

        // let createdFood = await cartService.create({ ...req.body, image: imageUploadResponse.url });

        // return res.status(200).json(success("OK", createdFood, res.statusCode))
    } catch (e) {
        return res.status(500).json(error(e.message));
    }
}

async function getById(req, res) {
    try {
        let orders = await cartService.getById(req.params.id);

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

        let updatedOrder = await cartService.update(req.body, req.params.id)

        return res.status(200).json(success("OK", updatedOrder, res.statusCode))
    } catch (e) {
        return res.status(500).json(error(e.message));
    }
}
