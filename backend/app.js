import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(cookieParser())

import userRoutes from "./routes/user.route.js";
import loanRoutes from "./routes/loan.route.js";
import appointmentRoutes from "./routes/appointment.route.js"
import applicationRoutes from "./routes/application.route.js"

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/loan", loanRoutes);
app.use("/api/v1/appointment", appointmentRoutes);
app.use("/api/v1/applications", applicationRoutes);

export { app };