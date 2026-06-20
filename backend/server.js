require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

require("./config/database");

app.use(cors());

app.use(express.json());

app.use(
    "/api/auth",
    require("./routes/authRoutes")
);

app.use(
    "/api/passwords",
    require("./routes/passwordRoutes")
);

const PORT =
    process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log(
        `Server running on port ${PORT}`
    );

});