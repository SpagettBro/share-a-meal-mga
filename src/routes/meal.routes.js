const express = require("express")
const bodyParser = require('body-parser')
const mealRouter = express.Router();
const mealController = require('../controllers/meal.controller')

mealRouter.use(bodyParser.json())

//UC-301 Register a new meal.
mealRouter.post('/api/meal', mealController.addMeal)

//UC-302 Get all meals.
mealRouter.get('/api/meal', mealController.getAllMeals)

//UC-303 Get Single meal by Id.
mealRouter.get('/api/meal/profile', mealController.getMealById)

//UC-304 Update a single meal.
mealRouter.get('/api/meal/:mealId', mealController.updateMeal)

//UC-305 Delete a single meal.
mealRouter.put('/api/meal/:mealId', mealController.deleteMeal)

//UC-306 Participate in a meal.
mealRouter.delete('/api/meal/:mealId', mealController.participateInMeal)

module.exports = mealRouter