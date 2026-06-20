const db = require("../config/database");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER

exports.register = async (req, res) => {

    try {

        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        db.get(
            "SELECT * FROM users WHERE email = ?",
            [email],
            async (err, user) => {

                if (err) {
                    return res.status(500).json({
                        message: err.message
                    });
                }

                if (user) {
                    return res.status(400).json({
                        message: "Email already exists"
                    });
                }

                const hashedPassword =
                    await bcrypt.hash(password, 10);

                db.run(
                    `INSERT INTO users
                    (name,email,password)
                    VALUES(?,?,?)`,
                    [
                        name,
                        email,
                        hashedPassword
                    ],
                    function (err) {

                        if (err) {
                            return res.status(500).json({
                                message: err.message
                            });
                        }

                        res.status(201).json({
                            message: "Registration Successful"
                        });

                    }
                );

            }
        );

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};


// LOGIN

exports.login = (req, res) => {

    try {

        const { email, password } = req.body;

        db.get(
            "SELECT * FROM users WHERE email = ?",
            [email],
            async (err, user) => {

                if (err) {
                    return res.status(500).json({
                        message: err.message
                    });
                }

                if (!user) {
                    return res.status(400).json({
                        message: "Invalid Credentials"
                    });
                }

                const isMatch =
                    await bcrypt.compare(
                        password,
                        user.password
                    );

                if (!isMatch) {

                    return res.status(400).json({
                        message: "Invalid Credentials"
                    });

                }

                const token =
                    jwt.sign(
                        {
                            id: user.id,
                            email: user.email
                        },
                        process.env.JWT_SECRET,
                        {
                            expiresIn: "7d"
                        }
                    );

                res.json({
                    token,
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email
                    }
                });

            }
        );

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};