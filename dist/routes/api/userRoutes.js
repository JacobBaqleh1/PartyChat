import { Router } from "express";
const router = Router();
import { getUsers, getSingleUser, createUser, deleteUser, updateUser, addFriend, deleteFriend, } from "../../controllers/userController.js";
// /api/users
router.route("/").get(getUsers).post(createUser);
// /api/users/:userId
router.route("/:userId").get(getSingleUser).delete(deleteUser).put(updateUser);
// /api/users/:userId/friends/:friendsId
router.route("/:userId/friends/:friendsId").delete(deleteFriend);
//friend
router.route("/:userId/friends").post(addFriend);
export default router;
