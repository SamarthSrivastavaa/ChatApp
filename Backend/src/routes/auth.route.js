import {Router} from "express"
import {updateProfile, login,logout,signup, checkAuth} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
const router=Router();

// router.route("/signup").post(signupfuncincontroller)
router.route("/signup").post(signup)
router.route("/login").post(login)
router.route("/logout").post(logout)
router.route("/update-profile").put(protectRoute,updateProfile)   //post to put while writing the frontend did
router.route("/check").get(protectRoute,checkAuth)
// router.route("/getCurrentUser").post(getCurrentUser)

export default router