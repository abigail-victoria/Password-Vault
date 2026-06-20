const db = require("../config/database");

const {
    encryptPassword,
    decryptPassword
} = require("../utils/encryption");


// ADD PASSWORD

exports.addPassword = (req, res) => {

    const {
        app_name,
        username,
        password
    } = req.body;

    const encryptedPassword =
        encryptPassword(password);

    db.run(
        `
        INSERT INTO passwords
        (
            user_id,
            app_name,
            username,
            password
        )
        VALUES (?,?,?,?)
        `,
        [
            req.user.id,
            app_name,
            username,
            encryptedPassword
        ],
        function (err) {

            if (err) {

                return res.status(500).json({
                    message: err.message
                });

            }

            res.status(201).json({
                message: "Password Saved"
            });

        }
    );

};


// GET PASSWORDS

exports.getPasswords = (req, res) => {

    db.all(
        `
        SELECT *
        FROM passwords
        WHERE user_id = ?
        ORDER BY id DESC
        `,
        [req.user.id],
        (err, rows) => {

            if (err) {

                return res.status(500).json({
                    message: err.message
                });

            }

            const passwords =
                rows.map(item => ({

                    id: item.id,

                    app_name:
                        item.app_name,

                    username:
                        item.username,

                    password:
                        decryptPassword(
                            item.password
                        )

                }));

            res.json(passwords);

        }
    );

};


// DELETE PASSWORD

exports.deletePassword = (req, res) => {

    const id = req.params.id;

    db.run(
        `
        DELETE FROM passwords
        WHERE id = ?
        AND user_id = ?
        `,
        [
            id,
            req.user.id
        ],
        function (err) {

            if (err) {

                return res.status(500).json({
                    message: err.message
                });

            }

            res.json({
                message: "Deleted Successfully"
            });

        }
    );

};