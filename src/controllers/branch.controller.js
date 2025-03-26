import { asynchandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Branch } from "../models/branch.models.js";

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
    const branch = await Branch.aggregate([
        {
            $lookup: {
                from: 'hospitals',
                localField: 'Hospital',
                foreignField: '_id',
                as: 'hospitalDetails'
            }
        }, 
        {
            $unwind: '$hospitalDetails'
        },
        {
            $project: {
                _id: 1,
                address: 1,
                contact: 1,
                "hospitalDetails.name" : 1,
                createdAt: 1,
                updatedAt: 1
            }
        }
    ])

    if (!branch) {
        throw new ApiError(400, "No hospital found")
    }

    return res
    .status(200)
    .json(new ApiResponse(
        400,
        "Branches are successfully fetched",
        branch
    ))
})

export {createBranch,
    getAllBranch
}