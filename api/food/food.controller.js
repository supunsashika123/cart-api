const express = require('express');
const foodService = require('./food.service');

const router = express.Router();

router.post('/', create);

module.exports = router;

async function create(req, res) {
    try {
        let newFood = req.body;

        let createdFood = await foodService.create(newFood);

        return res.json({ success: "Food has been created.", createdFood })
    } catch (e) {
        console.log(e)
        return res.status(400).json({ error: e });
    }
}
