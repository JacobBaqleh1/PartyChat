import connection from "../config/connection.js";
import User from "../models/User.js";
import { Thought } from "../models/Thought.js";
import {
  getRandomUsername,
  getRandomEmail,
  getRandomArrItem,
  // Ensure this is exported from your data.js
} from "./data.js";

connection.on("error", (err) => console.error(err));

connection.once("open", async () => {
  console.log("connected");

  try {
    // Safely check if `connection.db` exists
    if (connection.db) {
      await connection.db.dropDatabase();
      console.log("Database cleared!");
    } else {
      console.error("Database connection not initialized.");
      process.exit(1);
    }

    // Create random users
    const users = Array.from({ length: 10 }, () => ({
      username: getRandomUsername(),
      email: getRandomEmail(),
      friends: [],
      thoughts: [],
    }));

    // Generate thoughts and associate them with users
    const thoughtsArray = [
      "This is a great thought!",
      "I love coding in JavaScript.",
      "Mongoose makes life easier.",
      "Learning new things is so fun!",
      "Have you tried TypeScript yet?",
      "React is my favorite framework!",
      "Node.js rocks!",
      "MongoDB is so flexible.",
      "Keep calm and write clean code.",
      "Debugging is like being a detective!",
    ];
    // Insert users into the database
    const insertedUsers = await User.insertMany(users);

    const thoughts = insertedUsers.map((user) => ({
      thoughtText: getRandomArrItem(thoughtsArray),
      username: user.username,
      userId: user._id, // Associate with user's ID
      createdAt: new Date(),
      reactions: [],
    }));

    const insertedThoughts = await Thought.insertMany(thoughts);

    // Update users with their associated thoughts
    for (let thought of insertedThoughts) {
      await User.findByIdAndUpdate(
        thought.userId,
        { $push: { thoughts: thought._id } },
        { new: true }
      );
    }

    console.table(insertedUsers);
    console.table(thoughts);

    console.log("Seeding complete! 🌱");
    process.exit(0);
  } catch (err) {
    console.error("Error during seeding:", err);
    process.exit(1);
  }
});
