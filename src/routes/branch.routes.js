import { Router } from "express";
import {verifyJWT} from "../middlewares/auth.middlewares.js"
import { createBranch, getAllBranch } from "../controllers/branch.controller.js";

const router = Router();

router.route("/create-branch").post(createBranch)
router.route("/get-branch").get(verifyJWT, getAllBranch)


export default router;