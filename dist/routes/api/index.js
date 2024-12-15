import { Router } from "express";
const router = Router();
// import appRoutes from "./appRoutes.js";
import userRoutes from "./userRoutes.js";
import thoughtRoute from "./thoughtRoute.js";
// router.use("/apps", appRoutes);
router.use("/users", userRoutes);
router.use("/thoughts", thoughtRoute);
export default router;
