// This is a protected pieces of middleware

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const ErrorResponse = require('../utils/ErrorResponse');

exports.protect = async(req, res, next) => {
    let token;

    if(req.headers.authorization && req.authorization.startstWith("Bearer")){
        token = req.headers.authorization.split(" ")[1];
    };

    if(!token){
        return next(new ErrorResponse("Not authorized to acces this route", 401));

    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id);

        if(!user){
            return next(new ErrorResponse("No user found with this id", 404));
        };
        req.user = user

        next();
    } catch (error) {
        return next(new ErrorResponse("Not to autorized to access this route", 401));
    };

};
