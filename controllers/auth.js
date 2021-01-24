const crypto = require('crypto');
const { findOne } = require('../models/User');
const User = require('../models/User');
const ErrorResponse = require('../utils/ErrorResponse');
const sendEmail = require('../utils/sendEmail');

exports.register = async (req, res, next ) => {
   const {username, email, password} = req.body;

   try {
       const user = await User.create({
           username, email , password
       });

       sendToken(user, 201, res);
   } catch (error) {
       res.status(500).json({
           sucess: false,
           error: error.message,
       });
   }
};

exports.login = async (req, res, next ) => {
    const {email, password} = req.body;

    if(!email || !password){
        return next(new ErrorResponse("Please provide email and password", 400))
    }
    try {
        const user = await User.findOne({ email }).select("+password");

        if(!user){
            return next(new ErrorResponse("Invalid Credentials", 401))
        }

        const iMatch = await user.matchPasswords(password);

        if(!iMatch){
            return next(new ErrorResponse("Invalid Credentials", 401))
        }
        sendToken(user, 200, res);
        
    } catch (error) {
            res.status(500).json({
                sucess: true,
                error: error.menssage
            });
        };
};


exports.forgotpassword = async (req, res, next ) => {
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.resetToken).digest("hex");

    try {
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now()}
        })
        
        if(!user){
            return next(new ErrorResponse("Invalid reset Token", 400));
        }

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();
        res.status(201).json({
            sucess: true,
            data: "Password Reset Sucess"
        });
    } catch (error) {
        next(error);
    }
};

exports.resetpassword = async (req, res, next ) => {
    const {user} = req.body;

    try {
        const user = await User.findOne({email});

        if(!user){
            return next(new ErrorResponse("Email could not be sent", 404))
        }
        const resetToken = user.getResetPasswordToken();

        await user.save();

        const resetUrl = `http://localhost:3000/passwordreset/${resetToken}`;

        const message = `
            <h1> You requested a password reset </h1>
            <p> Click on this link to reset your password <p>
            <a href=${resetUrl} clicktracking=off>${resetUrl} </a>
        `

        try {
            await sendEmail({
                to: user.email,
                subject: "Password Reset Request",
                text: message
            });

            res.status(200).json({sucess: true, data: "Email Sent"})
        } catch (error) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;

            await user.save();

            return next(new ErrorResponse("Email could not be sent", 500));
        }
    } catch (error) {
        next(error);
    }
};

const sendToken = (user, statusCode, res) =>{
    const token = user.getSingInToken();
    res.status(statusCode).json({
        sucess: true,
        token
    });

}