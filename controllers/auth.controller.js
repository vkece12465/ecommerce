import User from './../models/user.schema';
import asyncHandler from './../services/asyncHandler';
import customError from './../utils/customError';
import mailHelper from './../utils/mailHelper';
import crypto from 'crypto';

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
 * @Returns User logged in
 ***********************/


// Creating Login feature
export const login = asyncHandler(async (req,res) => {
    const {email, password} = req.body;

    if(!email || !password){
        throw new customError("All fields are required", 400);
    }

    // Checking exit user
    // .select()('+password') is overriding default false to true
    const exitUser = User.findOne({email}).select('+password');
    
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
 * @Returns Success logout
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
});

/***********************
 * @FORGOT_PASSWORD
 * @Route http://localhost:4000/api/auth/passwords/forgot_password
 * @Description User submit a email and need to pass a token
 * @Parameter email
 * @Returns Success email send
 ***********************/

export const forgotPassword = asyncHandler(async (req, res) => {
    const {email} = req.body;
    const user = await User.findOne({email})

    // No user throw error
    if(!user){
        throw new customError("user not found", 404);
    };

    // Reset token
    const resetToken = user.generateForgotPasswordToken();
    await user.save({validateBeforeSave: false});

    // Reset url
    const resetUrl = `${req.protocol}://${req.get("host")}/api/auth/password/reset/${resetToken}`;
    
    // Creating a reset url text saving to a variable
    const text = `Your reset password link is 
    \n\n ${resetUrl} \n\n`

    // Try catch method
    try {
        await mailHelper({
            email: user.email,
            subject: "password reset email for password",
            text: text
        })
        res.status(200).json({
            success: true,
            message: `Email send to ${user.email}`
        })

    } catch (err) {
        
        // Clear the fields and save
        user.forgotPasswordToken = undefined;
        user.forgotPasswordExpiry = undefined;

        // Save the fields
        await user.save({validateBeforeSave: false})
        throw new customError(err.message || "Email sent failed", 500)
    }
})

/***********************
 * @RESET_PASSWORD
 * @Route http://localhost:4000/api/auth/passwords/reset/:resetPasswordToken
 * @Description User can able to reset a password based on url token
 * @Parameter token from url, password and confirm password
 * @Returns user Object
 ***********************/

export const resetPassword = asyncHandler (async (req, res) => {
    const {token: resetToken} = req.params
    const {password, confirmPassword} = req.body

    const resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex')

    // find by url
    const user = await User.findOne({
        forgotPasswordToken: resetPasswordToken,
        forgotPasswordExpiry: {$gt: Date.now()}
    });

    if(!user){
        throw new customError("Password is invalid or expiry token", 400)
    }

    // compare password
    if(password !== confirmPassword){
        throw new customError("Password and confirm password doesn't matched", 400)
    }
    user.password = password
    user.forgotPasswordToken = undefined
    user.forgotPasswordExpiry = undefined
    await user.save()

    // Create a token and send response
    const token = User.jwtToken()
    user.password = undefined

    // Cookie method
    res.cookie("token", token, cookieOptions)
    res.status(200).json({
        success: true,
        user,
        message: "Your password reset succefully"
    })
})

// Need to create a change password method

/***********************
 * @GET_PROFILE
 * @REQUEST_TYPE GET
 * @Route http://localhost:4000/api/auth/profile
 * @Description check token and populate user
 * @Parameter 
 * @Returns user Object
 ***********************/

export const getProfile = asyncHandler(async (req, res) => {
    const {user} = req
    if(!user){
        throw new customError("User is not found", 404)
    }
    res.status(200).json({
        success: true,
        message: "user found",
        user
    })
})