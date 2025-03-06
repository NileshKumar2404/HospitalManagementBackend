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

export {createBranch}