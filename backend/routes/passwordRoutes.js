const express = require("express");

const router = express.Router();

const auth =
    require("../middleware/auth");

const {
    addPassword,
    getPasswords,
    deletePassword
} = require("../controllers/passwordController");

router.post(
    "/",
    auth,
    addPassword
);

router.get(
    "/",
    auth,
    getPasswords
);

router.delete(
    "/:id",
    auth,
    deletePassword
);

module.exports = router;