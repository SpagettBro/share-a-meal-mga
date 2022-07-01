const express = require("express")
const bodyParser = require('body-parser')
const userRouter = express.Router();
const userController = require('../controllers/user.controller');
const { validateUser } = require("../controllers/user.controller");

userRouter.use(bodyParser.json())

//UC-201 Register a new user.
userRouter.post('/api/user',userController.validateUser, userController.addUser)

//UC-202 Get all users.
userRouter.get('/api/user', userController.getAllUsers)

//UC-203 Get personal user profile.
userRouter.get('/api/user/profile', userController.getPersonalUserProfile)

//UC-204 Get Single user by Id.
userRouter.get('/api/user/:userId', userController.getUserById)

//UC-205 Update a single user.
userRouter.put('/api/user/:userId', userController.updateUser)

//UC-206 Delete a single user.
userRouter.delete('/api/user/:userId', userController.deleteUser)

module.exports = userRouter