const db = require("../config/database");

const {
    encryptPassword,
    decryptPassword
} = require("../utils/encryption");


// ADD PASSWORD

exports.addPassword = async (req, res) => {

    try {

        const {
            app_name,
            username,
            password
        } = req.body;

        const encryptedPassword =
            encryptPassword(password);

        await db.query(
            `
            INSERT INTO passwords
            (
                user_id,
                app_name,
                username,
                password
            )
            VALUES ($1,$2,$3,$4)
            `,
            [
                req.user.id,
                app_name,
                username,
                encryptedPassword
            ]
        );

        res.status(201).json({
            message: "Password Saved"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};


// GET PASSWORDS

exports.getPasswords = async (req, res) => {

    try {

        const result = await db.query(
            `
            SELECT *
            FROM passwords
            WHERE user_id = $1
            ORDER BY id DESC
            `,
            [req.user.id]
        );

        const passwords = result.rows.map(item => ({
            id: item.id,
            app_name: item.app_name,
            username: item.username,
            password: decryptPassword(item.password)
        }));

        res.json(passwords);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};


// DELETE PASSWORD

exports.deletePassword = async (req, res) => {

    try {

        await db.query(
            `
            DELETE FROM passwords
            WHERE id = $1
            AND user_id = $2
            `,
            [
                req.params.id,
                req.user.id
            ]
        );

        res.json({
            message: "Deleted Successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};