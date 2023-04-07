const User = require('../models/User');
const mongoose = require('mongoose');
const errorResponse = require('../utils/ErrorHandler');
const asyncHandler = require('../middleware/asyncHandler');
const bcrypt = require('bcrypt');
const jwt = require('json-web-token');
const sendEmail = require('../utils/emailHandler');
const crypto = require('crypto');
const emailValidator = require('email-validator');

const cloudinary = require('../utils/cloudinary');

// logins the user using email and passpord 
exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new errorResponse('Please provide an email and password', 400));
    }
    // ! searching for user with req.body parameters
    let user = await User.findOne({ email: email }).select('+password')

    if (!user) {
        return next(new errorResponse('User not Registered', 400));
    }

    // if (!user.isVerified) {
    //     return next(new errorResponse('Please verify your email', 401));
    // }

    console.log(req.body);

    const matchPassword = await user.matchPassword(req.body.password);

    if (!matchPassword) {
        return next(new errorResponse('Invalid Input', 404));
    }

    // !this will set the token cookie and send back the response status and token generated
    sendTokenResponse(user, 200, res)
})



exports.register = asyncHandler(async (req, res, next) => {
    // console.log('registration body : ',req.body)
    const { name, email, password, image } = req.body;

    let newuser = await User.findOne({ email: email });

    if (newuser) {
        return next(new errorResponse('User already exists with given email', 400));
    }

    newuser = await User.findOne({ name: name });

    if (newuser) {
        return next(new errorResponse('User already exists with given name', 400));
    }

    // ! if user don't give his/her image then we would use this image as default.
    let profilePic = {
        public_id: 'profilePic/defaultMentor_aucyyg',
        url: 'https://res.cloudinary.com/dbatsdukp/image/upload/v1673782839/profilePic/defaultMentor_aucyyg.jpg'
    }

    // ? uploading the image at cloudinary
    if (req.body.image) {
        const uploadRes = await cloudinary.uploader.upload(image, {
            upload_preset: `We_don't_care`
        })
        // ! image is given then image is uploaded and thus user further too give public_id and url.
        if (uploadRes) {
            // uploadRes will contain information about the uploaded image.
            profilePic = {
                public_id: uploadRes.public_id,
                url: uploadRes.url
            }
        }
    }

    // creating the new user into database
    newuser = await User.create({
        name: name,
        email: email,
        password: password,
        profilePic: profilePic
    });


    // to send token on successfull registration.
    sendTokenResponse(newuser, 200, res)
})


//! this function takes the user information (if found) / created and generates a token with some expiry time and sets token cookie to that token and populate the response object with status and token to send back to client. 

const sendTokenResponse = (user, statusCode, res) => {

    //! this getSignedJwtToken is in users model where it signs the token with the user.id ,jwt secret and the expiry time
    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
    }
    // !setting the authorisation token at server.
    res.status(statusCode).cookie('token', token, options).send({ status: true, token: token });
}

exports.logout = asyncHandler(async (req, res, next) => {

    // ! Setting the token to none on user logging out.
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    })

    res.status(200).send({ status: "success", data: {} })

})