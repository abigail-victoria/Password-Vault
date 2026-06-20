require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

/* =========================
   DATABASE CONNECTION
========================= */
require("./config/database");

/* =========================
   MIDDLEWARES
========================= */

// Allow frontend access (IMPORTANT for deployment)
app.use(
    cors({
        origin: "*", // later you can restrict this to your frontend URL
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true
    })
);

// Parse JSON requests
app.use(express.json());

/* =========================
   ROUTES
========================= */

// Auth routes (login/register)
app.use(
    "/api/auth",
    require("./routes/authRoutes")
);

// Password routes (CRUD passwords)
app.use(
    "/api/passwords",
    require("./routes/passwordRoutes")
);

/* =========================
   HEALTH CHECK ROUTE
   (useful for Render / debugging)
========================= */
app.get("/", (req, res) => {
    res.send("Secure Vault API is running...");
});

/* =========================
   START SERVER
========================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});