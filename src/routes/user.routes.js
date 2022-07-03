const express = require("express")
const bodyParser = require('body-parser')
const userRouter = express.Router();
const userController = require('../controllers/user.controller');
const authenticationController = require("../controllers/authentication.controller");

userRouter.use(bodyParser.json())

//UC-201 Register a new user.
userRouter.post('/user',userController.validateUser, userController.addUser)

//UC-202 Get all users.
userRouter.get('/user', userController.getAllUsers)

//UC-203 Get personal user profile.
userRouter.get('/user/profile', userController.getPersonalUserProfile)

//UC-204 Get Single user by Id.
userRouter.get('/user/:userId', userController.getUserById)

//UC-205 Update a single user.
userRouter.put('/user/:userId', userController.updateUser)

//UC-206 Delete a single user.
userRouter.delete('/user/:userId', userController.deleteUser)

module.exports = userRouter