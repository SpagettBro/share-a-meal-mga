const express = require("express")
const bodyParser = require('body-parser')
const authenticationRouter = express.Router();
const authenticationController = require('../controllers/authentication.controller')

authenticationRouter.use(bodyParser.json())

//UC-101 Log in.
authenticationRouter.post('/authentication', authenticationController.logIn)

module.exports = authenticationRouter