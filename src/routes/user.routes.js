const express = require("express")
const bodyParser = require('body-parser')
const router = express.Router();

router.use(bodyParser.json())

let database = []
let id = 0

router.get('/', (req, res) => {
    res.status(200).json({
        status: 200,
        result: 'Hello World!'
    })
})

router.all('*', (req, res, next) => {
    const method = req.method
    console.log(`Methode ${method} aangeroepen.`)
    next()
})

router.get('/', (req, res) => {
    res.status(200).json({
        status: 200,
        result: 'Hello World!'
    })
})

//UC-201 Register a new user
router.post('/api/user', (req, res, next) => {
    let user = req.body
    id++
    console.log(`User: ${user}`)
    user={
        id, 
        ...user,
    }
    
    database.push(user)
    console.log(`Database: ${database}`)
    res.status(201).json({
        status: 201,
        result: user
    })

})

//UC-202 Get all users
router.get('/api/user', (req, res) => {
    res.status(200).json({
        status: 200,
        result: database
    })

})

//UC-204 Get Single user by Id
router.get('/router/user/:userId', (req, res) =>{
    const userId = req.params.userId
    let user = database.filter((item) => item.id == userId)
    if(user.length > 0){
        console.log(user)
        res.status(200).json({
            status: 200,
            result: user
        })
    }else{
        res.status(404).json({
            status: 404,
            result: `Movie with ID ${userId} not found.`
        })
    }
})

//UC-205 Update a single user
router.put('/router/user/:userId', (req, res) =>{
    
})

//UC-206 Delete user
router.delete('/router/user/:userId', (req, res) =>{
    
})

module.exports = router