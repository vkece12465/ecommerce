// Importing dotenv
import dotenv from "dotenv"

dotenv.config()
const dotenv = {
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRY: process.env.JWT_EXPIRY || "2d",
    MONGO_URL: process.env.MONGO_URL,
    PORT: process.env.PORT
}

export default config;