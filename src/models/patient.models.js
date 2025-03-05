import mongoose, { Schema } from "mongoose";

const patientSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    treatedBy: {
        type: Schema.Types.ObjectId,
        ref: 'Doctor',
    },
    age: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    bloodGroup: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: ['Male', 'Female','Others'],
        required: true
    },
    admittedIn: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Branch'
    }
},{timestamps: true})

export const Patient = mongoose.model('Patient', patientSchema)