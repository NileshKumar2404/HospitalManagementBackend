import { Router } from "express";
import {verifyJWT} from "../middlewares/auth.middlewares.js"
import { changeCurrentPassword, listOfBranch, loginHospital, logoutHospital, refreshAccessToken, registerHospital } from "../controllers/hospital.controller.js";

const router = Router();

router.route("/register-hospital").post(registerHospital)
router.route("/login").post(loginHospital)
router.route("/logout").post(verifyJWT, logoutHospital)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post(verifyJWT, changeCurrentPassword)
router.route("/branch").get(listOfBranch)


export default router;