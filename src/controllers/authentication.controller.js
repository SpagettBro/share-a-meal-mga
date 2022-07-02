const assert = require('assert')
const dbconnection = require('../database/dbconnection')
const logger = require('../config/config').logger

let authenticationController = {
    login(req, res, next) {
        pool.getConnection((err, connection) => {
          if (err) {
            logger.error('Error getting connection from pool')
            res
              .status(500)
              .json({ message: err.toString() })
          }
          if (connection) {
            // Check if the account exists.
            connection.query(
              'SELECT `id`, `firstName`, `lastName`, `emailAdress`, `password`, `phonenumber`, `roles`, `street`, `city` FROM `user` WHERE `emailAdress` = ?',
              [req.body.emailAdress],
              (err, rows, fields) => {
                connection.release()
                if (err) {
                  logger.error('Error: ', err.toString())
                  res.status(500).json({
                    Message: err.toString()
                  })
                } else {
                  // There was a result, check the password.
                  logger.info('Database responded: ')
                  logger.info(rows)
                  try {
                    if (
                      rows[0].password == req.body.password
                    ) {
                      logger.info('passwords DID match, sending valid token')
                      // Create an object containing the data we want in the payload.
                      const payload = {
                        id: rows[0].id
                      }
                      // Userinfo returned to the caller.
                      const userinfo = {
                        id: rows[0].id,
                        firstName: rows[0].firstName,
                        lastName: rows[0].lasrName,
                        password: rows[0].password,
                        phonenumber: rows[0].phonenumber,
                        roles: rows[0].roles,
                        street: rows[0].street,
                        city: rows[0].city,
                        token: jwt.sign(payload, jwtSecretKey, { expiresIn: '2h' })
                      }
                      logger.debug('Logged in, sending: ', userinfo)
                      res.status(200).json(userinfo)
                      next()
                    } else {
                      logger.info('Error user password invalid')
                      res.status(400).json({
                        Message: 'Error: user password invalid'
                      })
                    }
                  } catch (error) {
                    logger.info('Error user email not found')
                    res.status(400).json({
                      Message: 'Error: user email not found'
                    })
                  }
                }
              }
            )
          }
        })
      },

    validateToken(req, res, next) {
        logger.info('validateToken called')
        // logger.trace(req.headers)
        // The headers should contain the authorization-field with value 'Bearer [token]'
        const authHeader = req.headers.authorization
        if (!authHeader) {
          logger.warn('Authorization header missing!')
          res.status(401).json({
            error: 'Authorization header missing!',
            datetime: new Date().toISOString()
          })
        } else {
          // Strip the word 'Bearer ' from the headervalue
          const token = authHeader.substring(7, authHeader.length)
    
          jwt.verify(token, jwtSecretKey, (err, payload) => {
            if (err) {
              logger.warn('Not authorized')
              res.status(401).json({
                error: 'Not authorized',
                datetime: new Date().toISOString()
              })
            }
            if (payload) {
              logger.debug('token is valid', payload)
              // User heeft toegang. Voeg UserId uit payload toe aan
              // request, voor ieder volgend endpoint.
              req.userId = payload.id
              next()
            }
          })
        }
      },
    
      renewToken(req, res) {
        logger.debug('renewToken')
    
        pool.getConnection((err, connection) => {
          if (err) {
            logger.error('Error getting connection from pool')
            res
              .status(500)
              .json({ error: err.toString(), datetime: new Date().toISOString() })
          }
          if (connection) {
            // 1. Kijk of deze useraccount bestaat.
            connection.query(
              'SELECT * FROM `user` WHERE `id` = ?',
              [req.userId],
              (err, rows, fields) => {
                connection.release()
                if (err) {
                  logger.error('Error: ', err.toString())
                  res.status(500).json({
                    error: err.toString(),
                    datetime: new Date().toISOString()
                  })
                } else {
                  // 2. User gevonden, return user info met nieuw token.
                  // Create an object containing the data we want in the payload.
                  const payload = {
                    id: rows[0].ID
                  }
                  // Userinfo returned to the caller.
                  const userinfo = {
                    id: rows[0].id,
                    firstName: rows[0].firstname,
                    lastName: rows[0].lastname,
                    emailAdress: rows[0].emailAdress,
                    token: jwt.sign(payload, jwtSecretKey, { expiresIn: '24h' })
                  }
                  logger.debug('Sending: ', userinfo)
                  res.status(200).json(userinfo)
                }
              }
            )
            // pool.end((err)=>{
            //   console.log('Pool was colsed');
            // })
          }
        })
      }
}

module.exports = authenticationController