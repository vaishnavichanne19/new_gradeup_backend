import dotenv from "dotenv"
dotenv.config();
import express from "express";
import cors from "cors";
import Route from "./Routes/AllRoutes.js";
import mongoose from "mongoose";
import "./notification/cronReminder.js"

const app = express();
app.use(express.json());
app.use(cors());

const PORT =process.env.PORT || 7000;
const URL = process.env.MONGOURL;


mongoose.connect(URL).then (() => {
    console.log("DB connected successfully");
    app.listen(PORT, () => {
        console.log(`server is running on http://localhost:${PORT}`);
    })
}).catch(error => console.log(error));

app.use("/api", Route)
