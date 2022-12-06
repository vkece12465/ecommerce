import mongoose from 'mongoose';
import app from './app';
import config from './config/index';

/* To run a database immediately
    Create a function
    Run a function
    IIFE Function ()() */


// Created a IIFE function
(async () => {
    try {
        await mongoose.connect(config.MONGO_URL)
        console.log("DB Connected");

        // Error want to listen
        app.on("error", (err) => {
            console.log("Error: ", err);

        })
        
        // Listening on port
        const appListening = () => {
            console.log(`Your app is listening on ${config.PORT}`);
        }
        app.listen(config.PORT, appListening)

        // Error block
    } catch (error) {
        console.log("Error in DB ", error);
        throw error;
    }
})()