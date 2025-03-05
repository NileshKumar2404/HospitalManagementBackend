import mongoose, { Schema } from "mongoose";

const branchSchema = new Schema({
    address: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: true
    },
    Hospital: {
        type: Schema.Types.ObjectId,
        ref: 'Hospital',
        required: true
    }
},{timestamps: true})

export const Branch = mongoose.model('Branch', branchSchema)