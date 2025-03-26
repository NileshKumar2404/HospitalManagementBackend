import { asynchandler } from "../utils/asynchandler.js";
import {Patient} from "../models/patient.models.js"
import { Medical_Record } from "../models/medical_records.models.js";
import { ApiError } from "../utils/ApiError.js";
import mongoose from "mongoose";
import {ApiResponse} from "../utils/ApiResponse.js"

const createMedicalRecords = asynchandler(async(req, res) => {
    const{medicineStock, patientId} = req.body

    const patient = await Patient.findById(patientId)

    if (!patient) {
        throw new ApiError(400, "Patient not exist")
    }

    const medical_records = await Medical_Record.create({
        patients: patient,
        medicineStock
    })

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        "Medical record created successfully",
        medical_records
    ))
})

const getMedicalRecordsByPatient = asynchandler(async(req, res) => {
    const {patientId} = req.params

    const getMedicalRecords = await Medical_Record.aggregate([
        {
            $match: {
                "patients" : new mongoose.Types.ObjectId(patientId)
            }
        },
        {
            $lookup: {
                from: "patients",
                localField: "patients",
                foreignField: "_id",
                as: "patientDetails"
            }
        },
        {
            $unwind: "$patientDetails"
        },
        {
            $project: {
                _id: 1,
                "patientDetails.name": 1,
                "patientDetails.age": 1,
                "patientDetails.gender": 1,
                "patientDetails.disease": 1,
                "patientDetails.address": 1,
                medicineStock: 1,
                createdAt: 1,
                updatedAt: 1
            }
        }
    ])

    if (!getMedicalRecords) {
        throw new ApiError(400, "Something went wrong") 
    }

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        "Medical records of a patient fetched successfully",
        getMedicalRecords
    ))
})

const updateMedicalRecords = asynchandler(async(req, res) => {
    const {recordId} = req.params
    const {medicineStock} = req.body

    const updateMedicalRecord = await Medical_Record.findByIdAndUpdate(
        recordId,
        {
            $set: {
                medicineStock: medicineStock
            }
        },
        {new : true}
    )

    if (!updateMedicalRecord) {
        throw new ApiError(400, "Medical record does not exist")
    }

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        "Medical record updated successfully",
        updateMedicalRecord
    ))
})

const deleteMedicalRecords = asynchandler(async(req, res) => {
    const {recordId} = req.params

    await Medical_Record.findByIdAndDelete(recordId)

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        "Medical record deleted successfully",
        {}
    ))
})

const getAllMedicalRecords = asynchandler(async(req, res) => {
    const getMedicalRecords = await Medical_Record.aggregate([
        {
            $lookup: {
                from: "patients",
                localField: "patients",
                foreignField: "_id",
                as: "patientDetails"
            }
        },
        {
            $unwind: "$patientDetails"
        },
        {
            $project: {
                _id: 1,
                "patientDetails.name": 1,
                "patientDetails.age": 1,
                "patientDetails.gender": 1,
                "patientDetails.disease": 1,
                "patientDetails.address": 1,
                medicineStock: 1,
                createdAt: 1,
                updatedAt: 1
            }
        }
    ])

    if (!getAllMedicalRecords) {
        throw new ApiError(400, "No medical records found")
    }

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        "Medical Records fetched successfully",
        getMedicalRecords
    ))
})

export {
    createMedicalRecords,
    getMedicalRecordsByPatient,
    updateMedicalRecords,
    deleteMedicalRecords,
    getAllMedicalRecords
}