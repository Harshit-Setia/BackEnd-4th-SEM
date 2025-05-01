import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import {userRoute} from "./routes/userRoute.js"
import {eventRoute} from "./routes/eventRoute.js"

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials:true
}));

app.use(express.json({limit:"16kb"}));

app.use(express.urlencoded({extended:true,limit:"16kb"}));

app.use(express.static("public"));

app.use(cookieParser())

//routes
app.use('/api/users',userRoute)
app.use('/api/events',eventRoute)

export {app}