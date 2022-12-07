// Importing dotenv
import dotenv from "dotenv"

dotenv.config()
const dotenv = {
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRY: process.env.JWT_EXPIRY || "2d",
    MONGO_URL: process.env.MONGO_URL,
    PORT: process.env.PORT,
    SMTP_MAIL_HOST: process.env.SMTP_MAIL_HOST,
    SMTP_MAIL_PORT: process.env.SMTP_MAIL_PORT,
    SMTP_MAIL_USERNAME: process.env.SMTP_MAIL_USERNAME,
    SMTP_MAIL_PASSWORD: process.env.SMTP_MAIL_PASSWORD,



}

export default config;