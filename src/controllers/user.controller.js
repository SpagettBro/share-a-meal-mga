const assert = require("assert");
const dbconnection = require("../database/dbconnection");
const logger = require("../config/config").logger;
let database = [];
let id = 0;

let userController = {
    validateUser: (req, res, next) => {
        let user = req.body;
        let {
            firstName,
            lastName,
            street,
            city,
            password,
            emailAdress,
            phoneNumber,
        } = user;

        try {
            assert(typeof firstName === "string", "firstName must be a string.");
            assert(typeof lastName === "string", "lastName must be a string.");
            assert(typeof street === "string", "street must be a string.");
            assert(typeof city === "string", "city must be a string.");
            assert(typeof password === "string", "password must be a string.");
            assert(typeof emailAdress === "string", "emailAdress must be a string.");
            assert(typeof phoneNumber === "string", "phoneNumber must be a string.");
            next();
        } catch (err) {
            const error = {
                status: 400,
                result: err.message,
            };
            next(error);
        }
    },

    addUser: (req, res) => {
        logger.info("addUser called");
        logger.info(req.body);

        //Query the database to see if the email of the user to be registered already exists.
        dbconnection.getConnection((err, connection) => {
            if (err) {
                logger.error("Message: " + err.toString());
                const error = {
                    status: 500,
                    result: err.message,
                };
                next(error);
            }
            if (connection) {
                let {
                    firstName,
                    lastName,
                    isActive,
                    emailAdress,
                    password,
                    phoneNumber,
                    roles,
                    street,
                    city,
                } = req.body;
                connection.query(
                    "INSERT INTO `user` (`firstName`, `lastName`, `isActive`, `emailAdress`, `password`, `phoneNumber`, `roles`, `street`, `city`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
                    [
                        firstName,
                        lastName,
                        isActive,
                        emailAdress,
                        password,
                        phoneNumber,
                        roles,
                        street,
                        city,
                    ],
                    (err, rows, fields) => {
                        connection.release();
                        if (err) {
                            logger.error(err.toString());
                            res.status(409).json({
                                message: err.toString(),
                            });
                        } else {
                            logger.info("result: ", rows);
                            res.status(201).json({ result: rows });
                        }
                    }
                );
            }
        });
    },

    getAllUsers: (req, res, next) => {
        logger.trace("getAllUsers called");
        logger.info(req.body);

        dbconnection.getConnection(function (err, connection) {
            if (err) {
                const error = {
                    status: 400,
                    result: err.message,
                };
                next(error);
            }

            if (connection) {
                let { firstName, password } = req.body;
                connection.query("SELECT * FROM user", (err, rows, fields) => {
                    connection.release();
                    if (err) {
                        const error = {
                            status: 400,
                            result: err.message,
                        };
                        next(error);
                    }
                    if (rows) {
                        logger.trace("results: ", rows);

                        res.status(200).json({
                            status: 200,
                            result: rows,
                        });
                    }
                });
            }
        });
    },

    getPersonalUserProfile: (req, res) => { },

    getUserById: (req, res, next) => {
        const userId = req.params.userId;
        let user = database.filter((item) => item.id == userId);
        if (user.length > 0) {
            console.log(user);
            res.status(200).json({
                status: 200,
                result: user,
            });
        } else {
            const error = {
                status: 404,
                result: `Movie with ID ${userId} not found.`,
            };
            next(error);
        }
    },

    updateUser: (req, res) => {
        logger.trace('alter called')
        logger.info(req.body)

        dbconnection.getConnection((err, connection) => {
            if (err) {
                logger.error('error getting connection from dbconnection')
                res
                    .status(500)
                    .json({ message: err.toString() })
            }
            if (connection) {
                // Alter the account.
                let { firstName, lastName, isActive, password, emailAdress, phoneNumber, roles, street, city } = req.body
                connection.query(
                    'UPDATE `user` SET `firstName` = ?, `lastName` = ?, `emailAdress` = ?, `password` = ?, `street` = ?, `city` = ?, `phoneNumber` = ?, isActive = ? WHERE `id` = ?',
                    [firstName, lastName, isActive, password, emailAdress, phoneNumber, roles, street, city, req.params.id],
                    (err, rows, fields) => {
                        connection.release()
                        if (err) {
                            logger.info('error: user id not found')
                            res.status(400).json({
                                message: 'error: user id not found'
                            })
                        } else {

                            logger.info('User altered: ', rows)
                            res.status(200).json({ Altert: rows })
                        }
                    }
                )
            }
        })
    },

    deleteUser: (req, res) => {
        logger.trace('delete called')
        logger.info(req.body)

        dbconnection.getConnection((err, connection) => {
            if (err) {
                logger.error('error getting connection from dbconnection')
                res
                    .status(500)
                    .json({ message: err.toString() })
            }
            if (connection) {
                // delete user.
                connection.query(
                    'SELECT * FROM `user` WHERE `id` = ?',
                    [req.params.id],
                    (err, rows, fields) => {
                        if (err) {
                            logger.error('error: ', err.toString())
                            res.status(400).json({
                                message: err.toString()
                            })
                        } else if (rows && rows.length === 1) {
                            if (req.userId === rows[0].id) {
                                dbconnection.getConnection((err, connection) => {
                                    if (err) {
                                        logger.error('error getting connection from dbconnection')
                                        res
                                            .status(500)
                                            .json({ message: err.toString() })
                                    }
                                    if (connection) {
                                        // delete the account
                                        connection.query(
                                            'DELETE FROM `user` WHERE `id` = ?',
                                            [req.userId],
                                            (err, rows, fields) => {
                                                if (err) {
                                                    logger.error('error: ', err.toString())
                                                    res.status(400).json({
                                                        message: err.toString()
                                                    })
                                                } else {
                                                    logger.info('result: ', rows)
                                                    res.status(200).json({ result: rows })
                                                }
                                            }
                                        )
                                    }
                                })
                            } else {
                                logger.info('this is not your account')
                                res.status(403).json({ message: 'this is not your account' })
                            }
                        } else {
                            logger.info('there is no account')
                            res.status(400).json({ message: 'there is no account' })
                        }
                    }
                )
            }
        })
    },
};

module.exports = userController;
