const jwt = require('jsonwebtoken');
const asyncHandler = require('./asyncHandler');
const errorResponse = require('../utils/ErrorHandler')
const User = require('../models/User');


//! this is to crosscheck the authentication of the user trying to fetch the userinfo.
exports.protect = asyncHandler(async (req, res, next) => {
    let token;

    // ?If user is authorized we can get the token from the server (stored in cookies) or we can send it in the request body from client to server.
    console.log(req.headers.authorisation);

    if (req.headers.authorisation && req.headers.authorisation.startsWith('Bearer')) {
        token = req.headers.authorisation.split(' ')[1];
    }
    else if (req.cookies.token) {
        token = req.cookies.token;
    }


    // !if token is not found the user is not allowed to access this route.
    if (!token) {
        next(new errorResponse('Not authorize to access the route', 401))
    }


    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // console.log(decoded);
        //! setting the req.user to the user we found with the help of the token we received. 
        req.user = await User.findById(decoded.id);

        next();

    } catch (err) {

        next(new errorResponse('Not authorize to access the route', 401))
    }
})


exports.authorisation = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new errorResponse('Not authorized to access the route', 404));
        }
        next();
    }
}