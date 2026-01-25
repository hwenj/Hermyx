// External modules
const express = require("express");
const cors = require("cors");
const corsOptions = {   // Cors configuration for accepting only allowed urls
    origin: ["http://localhost:5173"]
}

const app = express();

app.use(cors(corsOptions));
app.use(express.json());


module.exports = app;