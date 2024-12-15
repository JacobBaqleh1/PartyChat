import { User } from "../models/index.js";
import { Thought } from "../models/Thought.js";
import mongoose from "mongoose";
// Get all users
export const getUsers = async (_req, res) => {
    try {
        const users = await User.find()
            .populate({
            path: "thoughts",
            select: "thoughtText createdAt reactionCount",
            populate: {
                path: "reactions", // Populate the reactions inside each thought
                select: "reactionBody username createdAt", // Customize fields you want from reactions
            },
        })
            .select("-__v");
        return res.json(users);
    }
    catch (err) {
        return res.status(500).json(err);
    }
};
// Get a single user
export const getSingleUser = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.userId })
            .populate({
            path: "thoughts",
            select: "thoughtText createdAt reactionCount",
            populate: {
                path: "reactions", // Populate the reactions inside each thought
                select: "reactionBody username createdAt", // Customize fields you want from reactions
            },
        })
            .select("-__v");
        if (!user) {
            return res.status(404).json({ message: "No user with that ID" });
        }
        return res.json(user);
    }
    catch (err) {
        res.status(500).json(err);
        return;
    }
};
// create a new user
export const createUser = async (req, res) => {
    try {
        const user = await User.create(req.body);
        res.json(user);
    }
    catch (err) {
        res.status(500).json(err);
    }
};
// Delete a user and associated apps
export const deleteUser = async (req, res) => {
    try {
        const user = await User.findOneAndDelete({ _id: req.params.userId });
        if (!user) {
            return res.status(404).json({ message: "No user with that ID" });
        }
        await Thought.deleteMany({ _id: { $in: user.thoughts } });
        res.json({ message: "User and associated apps deleted!" });
        return;
    }
    catch (err) {
        res.status(500).json(err);
        return;
    }
};
//Update a user
export const updateUser = async (req, res) => {
    try {
        const user = await User.findOneAndUpdate({ _id: req.params.userId }, req.body, { new: true, runValidators: true });
        if (!user) {
            return res.status(404).json({ message: "No user with that ID" });
        }
        // Skip updating Thoughts if the array is empty
        if (user.thoughts.length > 0) {
            await Thought.updateMany({ _id: { $in: user.thoughts } }, { $set: { updatedField: "New Value" } } // Replace `updatedField` with the actual field
            );
        }
        return res.json({ message: "User updated successfully!", user });
    }
    catch (err) {
        console.error(err);
        return res
            .status(500)
            .json({ message: "Failed to update user.", error: err });
    }
};
//add friend
export const addFriend = async (req, res) => {
    try {
        const { userId, friendsId } = req.params;
        const user = await User.findById(userId);
        // const friend = await User.findById(friendId);
        if (!user) {
            return res.status(404).json({ message: "User or friend not found" });
        }
        // Convert friendId to ObjectId
        const friendsObjectId = new mongoose.Types.ObjectId(friendsId);
        // Check if the friend is already added
        if (user.friends.includes(friendsObjectId)) {
            return res.status(400).json({ message: "Friend already added" });
        }
        //Add friend to users friends array
        user.friends.push(friendsObjectId);
        await user.save();
        console.log(user.friends);
        return res.json({ message: "friend added successfully", user });
    }
    catch (err) {
        console.error("Error adding friend:", err); // Log the full error
        return res.status(500).json({
            message: "failed to add friend",
            error: err.message || "Unknown error occurred",
        });
    }
};
//delete friend
export const deleteFriend = async (req, res) => {
    try {
        const { userId, friendsId } = req.params;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Convert friendId to ObjectId
        const friendsObjectId = new mongoose.Types.ObjectId(friendsId);
        // Check if the friend is in the user's friends list
        if (!user.friends.some((id) => id.equals(friendsObjectId))) {
            return res
                .status(404)
                .json({ message: "Friend not found in user's friends list" });
        }
        // Remove the friend from the friends array
        user.friends = user.friends.filter((id) => !id.equals(friendsObjectId));
        await user.save();
        return res.json({ message: "Friend removed successfully", user });
    }
    catch (err) {
        console.error(err);
        return res
            .status(500)
            .json({ message: "Failed to remove friend", error: err });
    }
};
