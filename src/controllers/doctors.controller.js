import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js"
import { asynchandler } from "../utils/asynchandler.js";
import { Doctor } from "../models/doctors.models.js";

const registerDoctor = asynchandler(async(req, res) => {
    const {name, salary, qualifications, experience, worksInBranch, hospitalHour} = req.body

    if(!name && !qualifications && !worksInBranch){
        throw new ApiError(400, "Please fill in all fields")
    }

    const doctor = await Doctor.create({
        name,
        salary,
        qualifications,
        experience,
        worksInBranch,
        hospitalHour
    })

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        "Doctor created successfully",
        doctor
    ))
})

const getAllDoctors = asynchandler(async(req, res) => {
    const doctors = await Doctor.find().populate("worksInBranch", "address")

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        "All doctors retrieved successfully",
        doctors
    ))
})

const getDoctorById = asynchandler(async(req, res) => {
    const {doctorId} = req.params

    if (!doctorId) {
        throw new ApiError(400, "Doctor id is required")
    }

    const doctorDetails = await Doctor.findById(doctorId)

    if (!doctorDetails) {
        throw new ApiError(400, "Doctor is not registered")
    }

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        "Doctor details retrieved successfully",
        doctorDetails
    ))
})

const updateDoctor = asynchandler(async(req, res) => {
    const {doctorId} = req.params
    const {name, qualifications, experience, salary, hospitalHour, worksInBranch} = req.body

    if (!doctorId) {
        throw new ApiError(400, "Doctor id is required")
    }

    const updatedDetails = await Doctor.findByIdAndUpdate(
        doctorId,
        {
            $set: {
                name,
                experience,
                qualifications,
                salary,
                hospitalHour,
                worksInBranch
            }
        },
        {new: true}
    )

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        "Doctor details updated successfully",
        updatedDetails
    ))
})

const deleteDoctor = asynchandler(async(req, res) => {
    const {doctorId} = req.params

    if (!doctorId) {
        throw new ApiError(400, "Doctor id is required")
    }

    await Doctor.findByIdAndDelete(doctorId)

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        "Doctor deleted successfully",
        {}
    ))
})

export {registerDoctor,
    getAllDoctors,
    getDoctorById,
    updateDoctor,
    deleteDoctor
}