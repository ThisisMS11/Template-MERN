const User = require('../models/User');
const ErrorHandler = require('../utils/ErrorHandler');
const asyncHandler = require('../middleware/asyncHandler')
const cloudinary = require('../utils/cloudinary');

exports.getProfile = asyncHandler(async (req, res, next) => {
    res.status(200).send({ success: true, data: { user: req.user } })
})


exports.uploadProfilePic = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id);
    if (!user) {
        next(`User not found with id ${req.user._id}`, 401);
    }

    const file = req.files.files;
    if (!file.mimetype.startsWith('image')) {
        next(new errorResponse(`Please upload an image file`, 401));
    }

    if (file.size > process.env.MAX_FILE_UPLOAD) {
        next(new errorResponse(`Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`, 401));
    }

    // file.name=`${Date.now()}photo_${post._id}_${i}${path.parse(file.name).ext}`;
    let result;
    let profilePic;
    try {
        result = await cloudinary.uploader.upload(file.tempFilePath, {
            folder: 'profilePic'
        })
        profilePic = { public_id: result.public_id, url: result.secure_url }
    } catch (err) {
        console.log(err);
    }

    try {
        if (user.profilePic.public_id != "profilePic/defaultMentor_aucyyg") {
            await cloudinary.uploader.destroy(user.profilePic.public_id);
        }
    } catch (err) {
        console.log(err);
    }

    user.profilePic = profilePic;
    await user.save();
    res.status(200).send({ success: true, data: user });
})

exports.deleteProfilePic = asyncHandler(async (req, res, next) => {
    let user = await User.findById(req.user._id);
    if (!user) {
        next(`User not found with id ${req.user._id}`, 401);
    }

    // file.name=`${Date.now()}photo_${post._id}_${i}${path.parse(file.name).ext}`;
    let result;


    const profilePic = {
        public_id: 'profilePic/defaultMentor_aucyyg',
        url: 'https://res.cloudinary.com/dbatsdukp/image/upload/v1673782839/profilePic/defaultMentor_aucyyg.jpg'
    }

    try {
        if (user.profilePic.public_id != "profilePic/defaultMentor_aucyyg") {
            await cloudinary.uploader.destroy(user.profilePic.public_id);
        }
    } catch (err) {
        console.log(err);
    }

    user.profilePic = profilePic;
    await user.save();
    res.status(200).send({ success: true, data: user });
})



exports.addBio = asyncHandler(async (req, res, next) => {
    let user = await User.findById(req.user._id);
    if (!user) {
        next(`User not found with id ${req.user._id}`, 401);
    }

    user.bio = req.body.bio;
    await user.save();
    user = await User.findById(req.user._id);
    res.status(200).send({ success: true, data: user });
})