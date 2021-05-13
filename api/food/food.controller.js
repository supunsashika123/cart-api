const express = require('express');
const { body, query, validationResult } = require('express-validator');
const upload = require('../helpers/imageUpload');
const { success, error, validation } = require("../helpers/responses");

const foodService = require('./food.service');
const router = express.Router();

router.post('/', validate('create'), create);
router.get('/', getAll);
router.get('/search', search);
router.get('/:id', getById);
router.delete('/:id', validate('delete'), deleteById);
router.put('/:id', validate('create'), update);

module.exports = router;

function validate(method) {
    switch (method) {
        case 'delete': {
            return [
                query('id', 'Missing id.').exists()
            ]
        }
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
                body('image', 'Image doesn\'t exist.').exists(),
            ]
        }
    }
}

async function deleteById(req, res) {
    try {
        await foodService.deleteById(req.params.id)

        return res.status(200).json(success("OK", "Food item deleted.", res.statusCode))
    } catch (e) {
        return res.status(500).json(error(e.message));
    }
}

async function create(req, res) {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(422).json(validation(errors.array()));
            return;
        }

        let imageUploadResponse = await upload(req.body.image)

        let createdFood = await foodService.create({ ...req.body, image: imageUploadResponse.url });

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

async function getById(req, res) {
    try {
        let foods = await foodService.getById(req.params.id);

        return res.status(200).json(success("OK", foods, res.statusCode))
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

        let updatedFoods = await foodService.update(req.body, req.params.id)

        return res.status(200).json(success("OK", updatedFoods, res.statusCode))
    } catch (e) {
        return res.status(500).json(error(e.message));
    }
}

async function search(req, res) {
    try {
        let foods = await foodService.searchByName(req.query.name)

        return res.status(200).json(success("OK", foods, res.statusCode))
    } catch (e) {
        return res.status(500).json(error(e.message));
    }
}
