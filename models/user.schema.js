import mongoose from 'mongoose'
import authRoles from "../utils/authRoles"
import config from "../config/index"

//Importing Libraries
import bcrypt from "bcryptjs"
import JWT from "jsonwebtoken"
import crypto from "crypto"

const userSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: ["true", "Name is required"],
            maxlength:[25, "Name should not exceed more than 25 charactrictics long"],
            trim: true
        },
        email:{
            type: ["[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?"],
            required: ["true", "Email is required"],
            unique: true,
        },
        password: {
            type: String,
            required: ["true", "passeord is required"],
            minlength: [8, "password must be an 8 charactrictics"],
            select: false,
        },
        role: {
            type: String,
            enum: Object.values(authRoles),
            default: authRoles.USER
        },
        forgotPasswordToken: String,
        forgotpasswordExpiry: Date,

    },
    // Time Stamps
    {
        timestamps: true,
    }

);

// Password encryption
userSchema.pre("save", async function(next) {
    if(!this.modified(password)) return next()
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

// User Schema Methods
userSchema.methods = {
    // Compare password
    comparePassword: async function(userEnterPassword){
        return await bcrypt.compare(userEnterPassword, this.password)
    },

    // JWT Token
    jwtToken: function() {
        return JWT.sign(
            {
                _id: this._id,
                name: this.name
            },
            config.JWT_SECRET,
            {
                expiresIn: config.JWT_EXPIRY
            }
        )
    }
}
export default mongoose.model("User", userSchema)