const db = require('../helpers/database');
const Food = db.Food;

module.exports = {
    create,
    getAll,
    update,
    getById,
    searchByName
}

async function create(foodItem) {
    try {
        const newFood = Food(foodItem);

        return await newFood.save();
    } catch (err) {
        throw new Error(err)
    }
}

async function getAll() {
    try {
        return await Food.find({})
    } catch (err) {
        throw new Error(err)
    }
}

async function update(food, id) {
    try {
        const foundfood = await Food.findOne({ _id: id });
        Object.assign(foundfood, food);

        return foundfood.save();
    } catch (err) {
        throw new Error(err)
    }
}

async function getById(id) {
    try {
        return await Food.findById(id);
    } catch (err) {
        throw new Error(err)
    }
}

async function searchByName(query) {
    try {
        return await Food.find({
            name: { "$regex": query, "$options": "i" }
        });
    } catch (err) {
        throw new Error(err)
    }
}