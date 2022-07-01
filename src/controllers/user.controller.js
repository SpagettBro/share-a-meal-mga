const assert = require('assert')
let database = []
let id = 0

let userController={
    validateUser:(req,res,next)=>{
        let user = req.body
        let {firstName, lastName, street, city, password, emailAddress, phoneNumber} = user

        try{
            assert(typeof firstName === 'string','firstName must be a string.')
            assert(typeof lastName === 'string','lastName must be a string.')
            assert(typeof street === 'string','street must be a string.')
            assert(typeof city === 'string','city must be a string.')
            assert(typeof password === 'string','password must be a string.')
            assert(typeof emailAddress === 'string','emailaddress must be a string.')
            assert(typeof phoneNumber === 'string','phoneNumber must be a string.')
            next()
        }catch(err){
            const error = {
                status: 400,
                result: err.message
            }
            next(error)
        }
    },

    addUser:(req, res)=>{
        let user = req.body
        id++
        console.log(`User: ${JSON.stringify(user)}`)
        user={
            id, 
            ...user,
        }
    
        database.push(user)
        console.log(`Database: ${JSON.stringify(database)}`)
        res.status(201).json({
            status: 201,
            result: user
        })
    },

    getAllUsers:(req, res) => {
        res.status(200).json({
            status: 200,
            result: database
        })
    },

    getPersonalUserProfile:(req, res) => {

    },

    getUserById:(req, res, next) =>{
        const userId = req.params.userId
        let user = database.filter((item) => item.id == userId)
        if(user.length > 0){
            console.log(user)
            res.status(200).json({
                status: 200,
                result: user
            })
        }else{
            const error = {
                status: 404,
                result: `Movie with ID ${userId} not found.`
            }
            next(error)
        }
    },

    updateUser:(req, res) =>{

    },

    //Werkt nog niet correct.
    deleteUser:(req, res) =>{
        const userId = req.params.userId
        let user = database.filter((item) => item.id == userId)
        if(user.length > 0){
            console.log(JSON.stringify(user))
            database.splice((item) => item.id == userId)
            res.status(200).json({
                status: 200,
                result: `User with ID: ${userId} was deleted succesfully.`
            })
        }else{
            res.status(404).json({
                status: 404,
                result: `Movie with ID ${userId} not found.`
            })
        }
    }
}

module.exports = userController