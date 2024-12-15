import { Request, Response } from "express";
import { Thought } from "../models/Thought.js";
import User from "../models/User.js";
import mongoose from "mongoose";

export const getThoughts = async (_req: Request, res: Response) => {
  try {
    const result = await Thought.find({});
    return res.status(200).json(result);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Failed to retrieve thought", error: err });
  }
};

export const getThoughtById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await Thought.findById(id).select("-__v");
    if (!result) {
      return res.status(400).json({ message: "no thought with that id" });
    }
    return res.status(200).json(result);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Failed to retrieve thought", error: err });
  }
};

export const createThought = async (req: Request, res: Response) => {
  try {
    const { thoughtText, username, userId } = req.body;

    // Validate the required fields
    if (!thoughtText || !username || !userId) {
      return res
        .status(400)
        .json({ message: "thoughtText, username, and userId are required" });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create the thought
    const newThought = await Thought.create({ thoughtText, username, userId });

    // Add the thought to the user's thoughts array
    user.thoughts.push(newThought._id as mongoose.Types.ObjectId);
    await user.save();

    return res.status(201).json(newThought);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Failed to create thought", error: err });
  }
};

export const deleteThought = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Find and delete the thought
    const thought = await Thought.findByIdAndDelete(id);
    if (!thought) {
      return res.status(404).json({ message: "Thought not found" });
    }

    // Remove the thought from the user's thoughts array
    await User.updateOne({ _id: thought.userId }, { $pull: { thoughts: id } });

    return res.status(200).json({ message: "Thought deleted successfully" });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Failed to delete thought", error: err });
  }
};

export const updateThought = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    //find and update
    const thought = await Thought.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!thought) {
      return res.status(400).json({ message: "thought not found" });
    } // Update related user, if needed
    if (thought.userId) {
      const user = await User.findById(thought.userId);

      if (user) {
        // You can perform specific updates to the related user here
        // For example: Add logic if `req.body` impacts user data
        await user.save();
      }
    }
    return res
      .status(200)
      .json({ message: "thought updated successfully", thought });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Failed to delete thought", error: err });
  }
};

//add reaction
export const addReaction = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const thought = await Thought.findByIdAndUpdate(
      id,
      { $addToSet: { reactions: req.body } },
      { runValidators: true, new: true }
    );
    if (!thought) {
      return res.status(400).json({ message: "Thought not found" });
    }

    return res
      .status(200)
      .json({ message: "reaction add successfully", thought });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Failed to add reaction.", error: err });
  }
};
export const deleteReaction = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const thought = await Thought.findByIdAndUpdate(
      id,
      { $pull: { reactions: req.body } },
      { runValidators: true, new: true }
    );
    if (!thought) {
      return res.status(400).json({ message: "Thought not found" });
    }

    return res
      .status(200)
      .json({ message: "reaction deleted successfully", thought });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Failed to delete reaction.", error: err });
  }
};
