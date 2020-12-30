const mongoose = require("mongoose");

const { ObjectId } = mongoose.SchemaTypes;

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    image: { type: String, required: true },
    likes: [{ type: ObjectId, ref: "User" }],
    comments: [
      {
        text: String,
        postedBy: { type: ObjectId, ref: "User" },
      },
    ],
    postedBy: { type: ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Blog = mongoose.model("blog", blogSchema);

module.exports = Blog;
