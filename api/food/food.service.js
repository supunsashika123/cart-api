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
        console.log(id);
        return await Food.findById(id);
    } catch (err) {
        throw new Error(err)
    }
}