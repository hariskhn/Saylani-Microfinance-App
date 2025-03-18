import dotenv from "dotenv" 
import { app } from "./app.js";
import connectDB from "./db/index.js";

dotenv.config({path: './.env'});

connectDB()
    .then(()=>{
        app.listen(process.env.PORT || 5000, () => {
            console.log(`Server running on port ${process.env.PORT || 5000}`);
        })

        app.on("error", (error) => {
            console.log("Error while initializing server: ", error)
            throw error
        })
    })
    .catch((error) => {
        console.log("MongoDB Connection Error", error)
    })