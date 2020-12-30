const express = require("express");
const router = express.Router();
const moogoose = require("mongoose");

const User = require("../models/user");
const Blog = require("../models/blog");
const auth = require("../middleware/auth");

router.get("/:id", auth, (req, res) => {
  User.findOne({ _id: req.params.id })
    .select("-password")
    .then((user) => {
      Blog.find({ postedBy: req.params.id })
        .populate("postedBy", "_id name")
        .exec((err, posts) => {
          if (err) {
            return res.status(422).json({ error: err });
          }
          res.json({ user, posts });
        });
    })
    .catch((err) => {
      return res.status(404).json({ error: "User not found" });
    });
});

router.put("/follow", auth, (req, res) => {
  User.findByIdAndUpdate(
    req.body.followId,
    {
      $push: { followers: req.user.id },
    },
    {
      new: true,
    },
    (err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      }
      User.findByIdAndUpdate(
        req.user.id,
        {
          $push: { following: req.body.followId },
        },
        { new: true }
      )
        .select("-password")
        .then((result) => {
          res.json(result);
        })
        .catch((err) => {
          return res.status(422).json({ error: err });
        });
    }
  );
});
router.put("/unfollow", auth, (req, res) => {
  User.findByIdAndUpdate(
    req.body.unfollowId,
    {
      $pull: { followers: req.user.id },
    },
    {
      new: true,
    },
    (err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      }
      User.findByIdAndUpdate(
        req.user.id,
        {
          $pull: { following: req.body.unfollowId },
        },
        { new: true }
      )
        .select("-password")
        .then((result) => {
          res.json(result);
        })
        .catch((err) => {
          return res.status(422).json({ error: err });
        });
    }
  );
});
module.exports = router;
