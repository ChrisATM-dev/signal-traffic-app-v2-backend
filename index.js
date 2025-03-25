import jwtAuth from "./routes/jwtAuth.js";

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

const app = express();

// MIDDLEWARE
app.use(express.json());
app.use(cors());

// RUTAS
// Ruta principal
app.get('/', (req, res) => {
    res.send('Hello World!');
});

//register and login routes
app.use("/auth", jwtAuth);

//get all signals
app.use("/auth", sigals);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});