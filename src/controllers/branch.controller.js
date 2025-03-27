import { asynchandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Branch } from "../models/branch.models.js";
import { Hospital } from "../models/Hospital.models.js";


const createBranch = asynchandler(async (req, res) => {
    const {address, contact, hospitalId} = req.body;

    if (!hospitalId) {
        throw new ApiError(400, "HospitalId is required")
    }

    const branch = await Branch.create({
        address,
        contact,
        Hospital: hospitalId
    })

    return res
    .status(200)
    .json(new ApiResponse(
        200,
        "Branch created successfully",
        branch
    ))
})

const getAllBranch = asynchandler(async (req, res) => {
    try {
        const branches = await Branch.aggregate([
            {
                $lookup:{
                    from: 'hospitals',
                    localField: 'Hospital',
                    foreignField: '_id',
                    as: 'hospitalDetails'
                }
            },
            {
                $unwind: '$hospitalDetails',
            },
            {
                $project: {
                    _id: 1,
                    address: 1,
                    contact: 1,
                    Hospital: '$hospitalDetails.hospitalName',
                    createdAt: 1,
                    updatedAt: 1
                }
            },
        ])

        console.log("Lookup Result:", JSON.stringify(branches, null, 2))

        if (!branches.length) {
            throw new ApiError(400, "No branches found")
        }

        return res
        .status(200)
        .json(new ApiResponse(
            200,
            "All branches are fetched successfully",
            branches
        ))
    } catch (error) {
        console.error("Error fetching branches:", error);
        throw new ApiError(500, "Internal server error");
    }
})

export {
    createBranch,
    getAllBranch,
}