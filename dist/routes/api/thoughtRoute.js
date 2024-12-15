import { Router } from "express";
import { getThoughts, getThoughtById, createThought, deleteThought, updateThought, addReaction, deleteReaction, } from "../../controllers/thoughtController.js";
const router = Router();
router.route("/").get(getThoughts).post(createThought);
router
    .route("/:id")
    .get(getThoughtById)
    .delete(deleteThought)
    .put(updateThought);
// /api/thoughts/:id/reactions
router.route("/:id/reactions").post(addReaction);
router.route("/:id/reactions/:reactionId").delete(deleteReaction);
export default router;
