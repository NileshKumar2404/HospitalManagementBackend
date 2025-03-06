import { Router } from "express";
import {verifyJWT} from "../middlewares/auth.middlewares.js"
import { deleteDoctor, getAllDoctors, getDoctorById, registerDoctor, updateDoctor } from "../controllers/doctors.controller.js";


const router = Router();

router.route("/register-doctor").post(verifyJWT, registerDoctor)
router.route("/get-doctor").get(verifyJWT, getAllDoctors)
router.route("/get/:doctorId").get(verifyJWT, getDoctorById)
router.route("/update-details/:doctorId").patch(verifyJWT, updateDoctor)
router.route("/delete-doctor/:doctorId").delete(verifyJWT, deleteDoctor)

export default router;