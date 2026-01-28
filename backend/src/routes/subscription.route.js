import { Router } from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { activateSubscription } from "../controllers/subscription.controller.js";

const subscriptionRouter = Router();

subscriptionRouter.route("/subscribe").post(protect, activateSubscription);

export default subscriptionRouter;
