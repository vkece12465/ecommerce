import User from './../models/user.schema';
import asyncHandler from './../services/asyncHandler';
import customError from './../utils/customError'

export const cookieOptions = {
    expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    httpOnly: true,
}

/***********************
 * @SIGNUP create a signup
 * @Route http://localhost:4000
 * @Description Signup controller for creating new user
 * @Parameter name, email, password
 * @Returns User Object
 ***********************/

export const signUp = asyncHandler(async (req, res) => {
    const {name, email, password} = req.body;

    // Logic for no name, email, password
    if(!name || ! email || !password){
        throw new customError("Please fill all the fields", 4000)
    }

    // Logic for existing user
    const existUser = await User.find(email);
    if(existUser){
        throw new customError("User already existed please try another", 4000)
    }

    // Creating a user fields
    const user = User.create({
        name,
        email,
        password
    })

    // Creating a token
    const token = user.jwtToken()
    console.log(user);
    // return the password undefined
    user.password = undefined;

    // sending cookie response
    res.cookie("token", token, cookieOptions);
    res.status(200).json({
        success: true,
        message: "User created Cussefully",
        token,
        user,
    })
})