import { Router } from "express";
import {verifyJWT} from "../middlewares/auth.middlewares.js"
import { createBranch } from "../controllers/branch.controller.js";

const router = Router();

router.route("/create-branch").post(createBranch)


export default router;