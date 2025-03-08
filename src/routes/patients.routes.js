import { Router } from "express";
import {verifyJWT} from "../middlewares/auth.middlewares.js"
import { deletePatient, getAllPatients, getPatientById, getPatientsByBranch, getPatientsByDoctor, registerPatient, updatePatientDetails } from "../controllers/patient.controller.js";


const router = Router();

router.route("/register-patient").post(verifyJWT, registerPatient)
router.route("/get-patients").get(verifyJWT, getAllPatients)
router.route("/get/:patientId").get(verifyJWT, getPatientById)
router.route("/update-details/:patientId").patch(verifyJWT, updatePatientDetails)
router.route("/delete-patient/:patientId").delete(verifyJWT, deletePatient)
router.route("/get-patient-byDoctor/:doctorId").get(verifyJWT, getPatientsByDoctor)
router.route("/get-patient-byBranch/:branchId").get(verifyJWT, getPatientsByBranch)


export default router;