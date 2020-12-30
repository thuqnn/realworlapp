const mongoose = require("mongoose");
const { ObjectId } = mongoose.SchemaTypes;
const userSchema = new mongoose.Schema(
  {
    name: { type: String },
    password: { type: String, required: true },
    email: { type: String, required: true },
    followers: [{ type: ObjectId, ref: "User" }],
    following: [{ type: ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
