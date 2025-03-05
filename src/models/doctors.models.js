import mongoose, { Schema } from "mongoose";

const hospitalHourSchema = new Schema({
    hospitalHour: {
        type: Number,
        required: true
    },
    charges: {
        type: Number,
        required: true
    }
})

const doctorsSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    salary: {
        type: Number,
        required: true,
    },
    qualifications: {
        type: String,
        required: true,
    },
    experience: {
        type: Number,
        required: true,
        default: 0
    },
    worksInHospitals: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Branch'
    },
    hospitalHour: {
        type: [hospitalHourSchema]
    }
},{timestamps: true})

export const Doctor = mongoose.model("Doctor",doctorsSchema)