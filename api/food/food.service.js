const db = require('../helpers/database');
const Food = db.Food;

module.exports = {
    create,
    getAll,
    update,
    getById,
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
    const foundFood = await Food.findOne({ _id: id });

    Object.assign(foundFood, food);

    let response = {};
    try {
        response = await foundFood.save();
    } catch (err) {
        console.log(err)
        response.error = "There was an issue while updating the food item.";
    }
    return response;
}

async function getById(id, project = {}) {
    return Food.findOne({ _id: new Object(id) }, project);
}