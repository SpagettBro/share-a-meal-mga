const express = require("express")
const bodyParser = require('body-parser')
const authenticationRouter = express.Router();
const authenticationController = require('../controllers/authentication.controller')

authenticationRouter.use(bodyParser.json())

authenticationRouter.get('/', (req, res) => {
    res.status(200).json({
        status: 200,
        result: 'Hello World!'
    })
})

//UC-101 Log in.
authenticationRouter.post('/api/authentication', authenticationController.logIn)

module.exports = authenticationRouter