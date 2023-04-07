const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please add a name"],
        unique: true,
        trim: true,
        maxlength: [50, 'Name can not be more than 50 characters']
    },
    profilePic: {
        public_id: {
            type: String
        },
        url: {
            type: String
        }
    },
    email: {
        type: String,
        unique: true,
        required: [true, "Please add a email"],
    },
    password: {
        type: String,
        required: [true, "Please add a password"],
        minlength: [6, 'Password must be of length more than 6'],
        select: false
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
})

// !to save the password in hash form
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = bcrypt.genSaltSync(10);
    this.password = await bcrypt.hash(this.password, salt);
})


// !to remove the cloudinary content of the user if we delete the user.

userSchema.pre('remove', async function (next) {
    try {
        if (user.profilePic.public_id != "profilePic/defaultMentor_aucyyg") {
            await cloudinary.uploader.destroy(user.profilePic.public_id);
        }
    } catch (err) {
        console.log(err);
    }

    next();
})


userSchema.methods.matchPassword = function (password) {
    return bcrypt.compare(password, this.password);
}



userSchema.methods.getSignedJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
}

module.exports = mongoose.model('Users', userSchema);