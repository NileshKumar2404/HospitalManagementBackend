import { Patient } from "../models/patient.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js"
import { asynchandler } from "../utils/asynchandler.js";
import { Doctor } from "../models/doctors.models.js"
import { Branch } from "../models/branch.models.js";
import mongoose from "mongoose";

const registerPatient = asynchandler(async (req, res) => {
    const {name, treatedBy, age, address, bloodGroup, gender, admittedIn, disease} = req.body

    if (!name || !treatedBy || !admittedIn || !address || !disease) {
        throw new ApiError(400, "Missing required fields");
    }

    const doctor = await Doctor.findById(treatedBy)

    if (!doctor) {
        throw new ApiError(400, "Doctor not found");
    }

    const branch = await Branch.findById(admittedIn)

    if (!branch) {
        throw new ApiError(400, "Branch not found");
    }

    const patient = await Patient.create({
        name,
        treatedBy,
        age,
        address,
        bloodGroup,
        gender,
        admittedIn,
        disease
    })

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        "Patient registered successfully",
        patient
    ))
})

const getAllPatients = asynchandler(async (req, res) => {
    const patients = await Patient.aggregate([
        {
            $lookup: {
                from: "doctors",
                localField: "treatedBy",
                foreignField: "_id",
                as: "doctorDetails"
            }
        },
        {
            $lookup: {
                from: "branches",
                localField: "admittedIn",
                foreignField: "_id",
                as: "branchDetails"
            }
        },
        {
            $unwind: {
                path: "$doctorDetails",
                preserveNullAndEmptyArrays: true //keeps the patient even if no doctor assigned
            }
        },
        {
            $unwind: {
                path: "$branchDetails",
                preserveNullAndEmptyArrays: true //keeps the patient even if no branch assigned
            }
        },
        {
            $project: {
                _id: 1,
                name: 1,
                age: 1,
                bloodGroup: 1,
                gender: 1,
                address: 1,
                "doctorDetials.name": 1,
                "doctorDetails.qualifications": 1,
                "branchDetails.name": 1,
                "branchDetails.address": 1
            }
        }
    ])

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        "All patients retrieved successfully",
        patients
    ))
})

const getPatientById = asynchandler(async(req, res) => {
    const {patientId} = req.params

    if (!patientId) {
        throw new ApiError(400, "PatientId is required")
    }

    const findPatient = await Patient.findById(patientId)
    
    if (!findPatient) {
        throw new ApiError(400, "Patient not registered")
    }

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        "Patient fetched successfully",
        findPatient
    ))
})

const updatePatientDetails = asynchandler(async(req, res) => {
    const {patientId} = req.params
    const {treatedBy, admittedIn, age, address, name, bloodGroup} = req.body

    if (!mongoose.Types.ObjectId.isValid(patientId)) {
        throw new ApiError(400, "Invalid patientId format");
    }

    if (!treatedBy || !admittedIn || !age || !address || !name || !bloodGroup) {
        throw new ApiError(400, "All fields are required")
    }

    const doctorExists = await Doctor.findById(treatedBy)

    if (!doctorExists) {
        throw new ApiError(400, "Doctor is not exist")
    }

    const branchExists = await Branch.findById(admittedIn)

    if (!branchExists) {
        throw new ApiError(400, "Branch is not exist")
    }

    const updatedDetails = await Patient.findByIdAndUpdate(
        patientId,
        {
            $set: {
                treatedBy,
                admittedIn,
                age,
                address,
                name,
                bloodGroup
            }
        },
        {new: true}
    )

    if (!updatedDetails) {
        throw new ApiError(404, "Patient not found");
    }

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        "Patient details update successfully",
        updatedDetails
    ))
})

const deletePatient = asynchandler(async(req, res) => {
    const {patientId} = req.params

    if (!patientId) {
        throw new ApiError(400, "PatientId is required")
    }

    await Patient.findByIdAndDelete(patientId)

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            "Patient deleted successfully",
            {}
        )
    )
})

const getPatientsByDoctor = asynchandler(async(req, res) => {
    const {doctorId} = req.params

    const patients = await Patient.aggregate([
        {
            $match:{
                treatedBy: new mongoose.Types.ObjectId(doctorId)
            }
        },
        {
            $lookup:{
                from: "doctors",
                localField: "treatedBy",
                foreignField: "_id",
                as: "doctorDetails"
            }
        },
        {
            $lookup: {
                from: "branches",
                localField: "admittedIn",
                foreignField: "_id",
                as: "branchDetails"
            }
        },
        {
            $project: {
                name: 1,
                age: 1,
                gender: 1,
                bloodGroup: 1,
                address: 1,
                "doctorDetails.name": 1,
                "doctorDetails.qualifications": 1,
                "branchDetails.address": 1,
            }
        }
    ])

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        "Patients by doctor fetched successfully",
        patients
    ))
})

const getPatientsByBranch = asynchandler(async(req, res) => {
    const {branchId} = req.params

    const patients = await Patient.aggregate([
        {
            $match:{
                admittedIn: new mongoose.Types.ObjectId(branchId)
            }
        },
        {
            $lookup: {
                from: "doctors",
                localField: "treatedBy",
                foreignField: "_id",
                as: "doctorDetails"
            }
        },
        {
            $lookup: {
                from: "branches",
                localField: "admittedIn",
                foreignField: "_id",
                as: "branchDetails"
            }
        },
        {
            $project: {
                name: 1,
                age: 1,
                gender: 1,
                address: 1,
                bloodGroup: 1,
                "doctorDetails.name": 1,
                "doctorDetails.qualifications": 1,
                "branchDetails.address" : 1
            }
        }
    ])

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        "Patients addmitted in which branch fetched successfully",
        patients
    ))
})

export {
    registerPatient,
    getAllPatients,
    getPatientById,
    updatePatientDetails,
    deletePatient,
    getPatientsByDoctor,
    getPatientsByBranch
}