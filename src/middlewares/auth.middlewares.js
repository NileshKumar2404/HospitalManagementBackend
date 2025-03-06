import {asynchandler} from '../utils/asynchandler.js'
import jwt from 'jsonwebtoken'
import {ApiError} from  '../utils/ApiError.js'
import { Hospital } from '../models/Hospital.models.js'

export const verifyJWT = asynchandler(async (req, res, next) => {
try {
        const token = req.cookies?.accessToken ||
        req.header('Authorization')?.replace("Bearer: ", "")
    
        if (!token) {
            throw new ApiError(400, "Unauthorized request")
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const hospital = await Hospital.findById(decodedToken?._id).
        select("-password, -refreshToken")
    
        if (!hospital) {
            throw new ApiError(400, "Invalid access token")
        }
    
        req.hospital = hospital
    
        next()
    } catch (error) {
        console.error("JWT verification error: ", error.message);
        throw new ApiError(400, error?.message || "Invalid access token")
        
    }
})