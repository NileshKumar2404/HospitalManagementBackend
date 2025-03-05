import mongoose, { Schema } from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const hospitalSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    specializedIn: [
        {
            type: String,
            required: true
        }
    ],
    password: {
        type: String,
        required: true
    },
    refreshToken: {
        type: String,
        required: true,
        default: null
    },
    branch: [{
        type: Schema.Types.ObjectId,
        ref: 'Branch',
    }]
}, {timestamps: true})

hospitalSchema.pre('save', async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

hospitalSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

hospitalSchema.methods.generateAccessToken = async function () {
    return jwt.sign(
        {
            _id: this._id,
            name: this.name,
            specializedIn: this.specializedIn,
            branch: this.branch,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

hospitalSchema.methods.generateRefreshToken = async function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const Hospital = mongoose.model("Hospital",hospitalSchema)