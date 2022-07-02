const assert = require('assert')
const dbconnection = require('../database/dbconnection')
const logger = require('../config/config').logger
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
        logger.info('register')
        logger.info(req.body)

        //Query the database to see if the email of the user to be registered already exists.
        pool.getConnection((err, connection) => {
        if (err) {
            logger.error('Message: ' + err.toString())
            const error = {
                status: 500,
                result: err.message
            }
            next(error)
        }
        if (connection) {
            let { firstName, lastName, emailAdress, password, street, city } = req.body
            connection.query(
            'INSERT INTO `user` (`firstName`, `lastName`, `emailAdress`, `password`, `street`, `city`) VALUES (?, ?, ?, ?, ?, ?)',
            [firstName, lastName, emailAdress, password, street, city],
            (err, rows, fields) => {
                connection.release()
                if (err) {
                // When the INSERT fails, we assume the user already exists
                logger.error('Error: ' + err.toString())
                res.status(400).json({
                    message: err.toString()
                })
                } else {
                logger.trace(rows)
                // Create an object containing the data we want in the payload.
                // This time we add the id of the newly inserted user
                const payload = {
                    id: rows.insertId
                }
                // Userinfo returned to the caller.
                const userinfo = {
                    id: rows[0].insertId,
                    firstName: rows[0].firstName,
                    lastName: rows[0].lastName,
                    emailAdress: rows[0].emailAdress,
                    street: rows[0].street,
                    city: rows[0].city,
                    phonenumber: rows[0].phonenumber,
                    isActive: rows[0].isActive,
                    token: jwt.sign(payload, jwtSecretKey, { expiresIn: '24h' })
                }
                logger.debug('Registered', userinfo)
                res.status(200).json(userinfo)
                }
            }
            )
            // pool.end((err)=>{
            //   console.log('Pool was colsed');
            // })
        }
        })
    },

    getAllUsers:(req, res, next) => {
        logger.trace('getAllUsers called')
        logger.info(req.body)
    
        dbconnection.getConnection(function (err, connection) {
          if (err) {
            const error = {
                status: 400,
                result: err.message
            }
            next(error)
          }

          if (connection) {
            let { firstName, isActive } = req.body
            connection.query('SELECT * FROM user',
            (err, rows, fields) => {
              connection.release()
              if (err) {
                const error = {
                    status: 400,
                    result: err.message
                }
                next(error)
              }
              if (rows) {
                logger.trace('results: ', rows)
                const mappedResults = rows.map((item, i) => {
                  return {
                    id: rows[i].insertId,
                    firstName: rows[i].firstName,
                    lastName: rows[i].lastName,
                    emailAdress: rows[i].emailAdress,
                    street: rows[i].street,
                    city: rows[i].city,
                    phonenumber: rows[i].phonenumber,
                    isActive: rows[i].isActive
                  }
                })
                res.status(200).json({
                    status: 200,
                    result: mappedResults
                })
              }
            })
          }
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