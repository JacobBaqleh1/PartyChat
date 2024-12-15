import { Schema, model } from "mongoose";
const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },
    thoughts: [
        {
            type: Schema.Types.ObjectId,
            ref: "Thought",
        },
    ],
    friends: [
        {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, {
    toJSON: {
        virtuals: true,
        getters: true,
    },
    id: false,
});
userSchema.virtual("friendCount").get(function () {
    return this.friends.length;
});
userSchema.virtual("formattedCreatedAt").get(function () {
    return this.createdAt.toLocaleString();
});
const User = model("User", userSchema);
export default User;
