import {Router} from "express"
import { protectRoute } from "../middleware/auth.middleware.js";
import { getUsersForSidebar ,getMessages, sendMessages} from "../controllers/message.controller.js";

const router=Router();

router.route("/users").get(protectRoute,getUsersForSidebar);
router.route("/:id").get(protectRoute,getMessages)
router.route("/send/:id").post(protectRoute,sendMessages)
export default router