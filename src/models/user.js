const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)){
                throw new Error('Invalid email!')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true
    }
})

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email })
    if (!user){
        throw new Error('Unable to login..')
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch){
        throw new Error('Unable to login..')
    }

    return user
}

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, process.env.SECRET, {expiresIn: '24 seconds' })
    return token
}

userSchema.pre('save', async function (next) {
    const user = this
    if (user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

const User = mongoose.model('User', userSchema);

module.exports = User