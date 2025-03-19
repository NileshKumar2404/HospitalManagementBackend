import mongoose, { Schema } from "mongoose";

const hospitalHourSchema = new Schema({
    day: {
        type: String,
        enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        required: true
    },
    startTime: {
        type: String, // Example: "09:00 AM"
        required: true
    },
    endTime: {
        type: String, // Example: "05:00 PM"
        required: true
    },
    charges: {
        type: Number,
        required: true
    }
});

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
        type: [String],
        required: true,
    },
    experience: {
        type: Number,
        required: true,
        default: 0
    },
    worksInBranch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Branch'
    },
    contact: {
        type: String,
        required: true
    },
    hospitalHour: {
        type: [hospitalHourSchema]
    }
},{timestamps: true})

export const Doctor = mongoose.model("Doctor",doctorsSchema)