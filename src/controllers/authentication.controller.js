const assert = require("assert");
const dbconnection = require("../database/dbconnection");
const logger = require("../config/config").logger;
const jwt = require("jsonwebtoken");
const { userInfo } = require("os");
const jwtSecretKey = require("../config/config").jwtSecretKey;

let authenticationController = {
    logIn: (req, res, next) => {
        dbconnection.getConnection((err, connection) => {
            if (err) {
                logger.error("error getting connection from dbconnection");
                const error = {
                    status: 500,
                    result: err.message,
                };
                next(error);
            }
            if (connection) {
                // Check if the account exists.
                connection.query(
                    "SELECT * FROM `user` WHERE `emailAdress` = ?",
                    [req.body.emailAdress],
                    (err, rows, fields) => {
                        connection.release();
                        if (err) {
                            logger.error("error: ", err.toString());
                            const error = {
                                status: 422,
                                result: err.message,
                            };
                            next(error);
                        } else if (
                            rows &&
                            rows.length === 1 &&
                            rows[0].password == req.body.password
                        ) {
                            logger.info(
                                "passwords DID match, sending userinfo and valid token"
                            );
                            // Extract the password from the userdata - we do not send that in the response.
                            const { password, ...userinfo } = rows[0];
                            // Create an object containing the data we want in the payload.
                            const payload = {
                                userId: userinfo.id,
                            };

                            jwt.sign(
                                payload,
                                jwtSecretKey,
                                { expiresIn: "12d" },
                                function (err, token) {
                                    logger.debug("User logged in, sending: ", userinfo);
                                    res.status(201).json({
                                        statusCode: 201,
                                        results: { ...userinfo, token },
                                    });
                                }
                            );
                        } else if (rows.length === 0) {
                            logger.info("error user does not exist");
                            const error = {
                                status: 404,
                                result: "error user does not exist",
                            };
                            next(error);
                        } else {
                            logger.info("error user password or email invalid");
                            const error = {
                                status: 400,
                                result: "error user password or email invalid",
                            };
                            next(error);
                        }
                    }
                );
            }
        });
    },
    validateEmail: (req, res, next) => {
        if (
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(req.body.emailAdress)
        ) {
            logger.info("Email is vallid");
            next();
        } else {
            logger.info("Email is not valid");
            const error = {
                status: 400,
                result: "Email is not valid",
            };
            next(error);
        }
    },

    validatePhone: (req, res, next) => {
        if (
            /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(
                req.body.phoneNumber
            )
        ) {
            logger.info("Phonenumber is vallid");
            next();
        } else {
            logger.info("Phonenumber is not vallid");
            const error = {
                status: 400,
                result: "Phonenumber is not vallid",
            };
            next(error);
        }
    },

    validateMealRegister: (req, res, next) => {
        // Verify that we receive the expected input
        console.log("Reached Validation");
        try {
            assert(typeof req.body.name === "string", "name must be a string");
            assert(
                typeof req.body.dateTime === "string",
                "dateTime must be a string"
            );

            assert(
                typeof req.body.imageUrl === "string",
                "imageUrl must be a string"
            );

            assert(typeof req.body.price === "string", "price must be a string");
            console.log("validation completed");
            next();
        } catch (err) {
            console.log("validateRegister error: ", err);
            const error = {
                status: 400,
                result: "validateRegister error: " + err.message,
            };
            next(error);
        }
    },

    validateUserRegister: (req, res, next) => {
        // Verify that we receive the expected input
        console.log("Reached Validation");
        try {
            assert(
                typeof req.body.firstName === "string",
                "firstName must be a string"
            );
            assert(
                typeof req.body.lastName === "string",
                "lastName must be a string"
            );

            assert(typeof req.body.street === "string", "password must be a string");

            assert(typeof req.body.city === "string", "password must be a string");

            assert(
                typeof req.body.password === "string",
                "password must be a string"
            );
            console.log("validation completed");
            next();
        } catch (err) {
            console.log("validateRegister error: ", err);
            console.log("validateRegister error: ", err);
            const error = {
                status: 400,
                result: err.message,
            };
            next(error);
        }
    },

    validateUserToken: (req, res, next) => {
        logger.info("validateToken called");
        // logger.trace(req.headers)
        // The headers should contain the authorization-field with value 'Bearer [token]'
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            logger.warn("Authorization header missing!");
            const error = {
                status: 401,
                result: "Authorization header missing!",
                datetime: new Date().toISOString(),
            };
            next(error);
        } else {
            // Strip the word 'Bearer ' from the headervalue
            const token = authHeader.substring(7, authHeader.length);

            jwt.verify(token, jwtSecretKey, (err, payload) => {
                if (err) {
                    logger.warn("Not authorized");
                    const error = {
                        status: 401,
                        result: "Not authorized",
                    };
                    next(error);
                }
                if (payload) {
                    logger.debug("token is valid", payload);
                    // User has acces, add the userId to the user for next use.
                    req.userId = payload.userId;
                    logger.debug(req.userId);
                    next();
                }
            });
        }
    },
};

module.exports = authenticationController;
