import User from './../models/user.schema';
import asyncHandler from './../services/asyncHandler';
import customError from './../utils/customError'

export const cookieOptions = {
    expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    httpOnly: true,
}

/***********************
 * @SIGNUP create a signup
 * @Route http://localhost:4000/api/auth/signup
 * @Description Signup controller for creating new user
 * @Parameter name, email, password
 * @Returns User Object
 ***********************/

export const signUp = asyncHandler(async (req, res) => {
    const {name, email, password} = req.body;

    // Logic for no name, email, password
    if(!name || ! email || !password){
        throw new customError("Please fill all the fields", 400)
    }

    // Logic for existing user
    const existUser = await User.find(email);
    if(existUser){
        throw new customError("User already existed please try another", 400)
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

/***********************
 * @LOGIN create a LOGIN
 * @Route http://localhost:4000/api/auth/login
 * @Description Login controller for creating user
 * @Parameter email, password
 * @Returns User Object
 ***********************/
// Creating Login feature
export const login = asyncHandler(async (req,res) => {
    const {email, password} = req.body;

    if(!email || !password){
        throw new customError("All fields are required", 400);
    }

    // Checking exit user
    // .select()('+password') is overriding default false to true
    const exitUser = User.findOne({email}).select('+password')
    if(!exitUser){
        throw new customError("Invalid login details", 400)
    }

    // Matching the password
    const matchPassword = await exitUser.comparePassword(password);
    if(matchPassword){
        const token = exitUser.jwtToken()
        exitUser.password = undefined;
        res.cookie("token", token, cookieOptions)
        res.status(200).json({
            success: true,
            message: "Login success",
            token,
            exitUser

        })
    }
    throw new customError("Invalid login details password", 400)

})

/***********************
 * @LOGOUT create a LOGIN
 * @Route http://localhost:4000/api/auth/logout
 * @Description Logout controller for clearing user cookies
 * @Parameter email, password
 * @Returns Sussecc logout
 ***********************/

export const logout = asyncHandler(async (_req, res) => {

    // Simple logout....res.clearCookie()
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    })
    res.status(200).json({
        success: true,
        message: "Logout success",
        token
    })
})