import User from './../models/user.schema';
import JWT from 'jsonwebtoken';
import asyncHandler from '../services/asyncHandler';
import customError from '../utils/customError';
import config from '../config';

export const isLoggedIn = asyncHandler(async (req, _res, next) => {
    let token;
    if(req.cookies.token || (req.headers.authorization && req.headers.authorization.startsWith('bearer'))
    ) {
        // split(" ")[0]--> 0 place token [1] place valus
    token = req.cookies.token || req.headers.authorization.split(" ")[1]
    }
    if(!token){
        throw new customError("Access denied", 401)
    }

    // try catch block
    try {
        const decodedPayload = JWT.verify(token, config.JWT_SECRET)
        
        // Find the user, role, email
        req.user = await User.findById(decodedPayload._id, "name email role")
        next()
    } catch (error) {
        throw new customError("Access denied", 401)
    }
    
})