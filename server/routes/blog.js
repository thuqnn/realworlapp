const express = require("express");
const router = express.Router();
const Blog = require("../models/blog");
const auth = require("../middleware/auth");

//READ
router.get("/", auth, (req, res) => {
  Blog.find()
    .populate("postedBy", "_id name")
    .populate("comments.postedBy", "_id name")
    .then((posts) => {
      res.json(posts);
    })
    .catch((error) => {
      console.log(error);
    });
});

//READ
router.get("/getsubpost", auth, (req, res) => {
  Blog.find({ postedBy: { $in: req.user.following } })
    .populate("postedBy", "_id name")
    .populate("comments.postedBy", "_id name")
    .then((posts) => {
      res.json(posts);
    })
    .catch((error) => {
      console.log(error);
    });
});

//CREATE
router.post("/create", auth, (req, res) => {
  const { title, description, image } = req.body;
  if (!title || !description || !image) {
    return res.status(422).json({ error: "Plase add all the fields" });
  }
  req.user.password = undefined;
  const blog = new Blog({
    title,
    description,
    image,
    postedBy: req.user,
  });
  blog
    .save()
    .then((result) => {
      res.json({ blog: result });
    })
    .catch((err) => {
      console.log(err);
    });
});

//GET
router.get("/userposts", auth, async (req, res) => {
  Blog.find({ postedBy: req.user._id })
    .populate("postedBy", "_id name")
    .then((userposts) => {
      res.json(userposts);
    })
    .catch((err) => {
      res.json(err);
    });
});

//PUT
router.put("/like", auth, (req, res) => {
  Blog.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { likes: req.user.id },
    },
    {
      new: true,
    }
  ).exec((err, result) => {
    if (err) {
      return res.status(422).json({ error: err });
    } else {
      res.json(result);
    }
  });
});
router.put("/unlike", auth, (req, res) => {
  Blog.findByIdAndUpdate(
    req.body.postId,
    {
      $pull: { likes: req.user.id },
    },
    {
      new: true,
    }
  ).exec((err, result) => {
    if (err) {
      return res.status(422).json({ error: err });
    } else {
      res.json(result);
    }
  });
});

router.put("/comment", auth, (req, res) => {
  const comment = {
    text: req.body.text,
    postedBy: req.user._id,
  };
  Blog.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { comments: comment },
    },
    {
      new: true,
    }
  )
    .populate("comments.postedBy", "_id name")
    .populate("postedBy", "_id name")
    .exec((err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      } else {
        res.json(result);
      }
    });
});

//Delete
router.delete("/deletepost/:postId", auth, (req, res) => {
  Blog.findOne({ _id: req.params.postId })
    .populate("postedBy", "_id")
    .exec((err, post) => {
      if (err || !post) {
        return res.status(422).json({ error: err });
      }
      if (post.postedBy.id.toString() === req.user.id.toString()) {
        post
          .remove()
          .then((result) => {
            res.json(result);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
});
module.exports = router;
