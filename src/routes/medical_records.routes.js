import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { createMedicalRecords, deleteMedicalRecords, getAllMedicalRecords, getMedicalRecordsByPatient, updateMedicalRecords } from "../controllers/medical_records.controller.js";

const router = Router();

router.use(verifyJWT)


router.route("/register-records").post(createMedicalRecords).get(getMedicalRecordsByPatient)
router.route("/records/:recordId").patch(updateMedicalRecords).delete(deleteMedicalRecords)
router.route("/records").get(getAllMedicalRecords)


export default router;