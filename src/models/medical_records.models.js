import mongoose, { Schema } from "mongoose";

const medicalRecordSchema = new Schema({
    patients: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient'
    },
    medicineStock: {
        type: Number,
        required: true
    }
},{timestamps: true})

export const Medical_Record = mongoose.model('Medical_Record', medicalRecordSchema)