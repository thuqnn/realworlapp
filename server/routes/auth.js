const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");

//Register
router.post("/register", function (req, res) {
  const { name, password, email } = req.body;
  //if email password email null
  if (!name || !password || !email) {
    res.status(402).json({ message: "please enter your field!" });
  }
  //else
  res.status(202).json({
    message: "Thanks for your registration !",
  });
  //if null or undefined  return 402
  User.findOne({ email: email })
    .then((savedUser) => {
      if (savedUser) {
        res.status(402).json({ message: "please enter 402 your field!" });
      }
      //hash password to database
      bcrypt.hash(password, 12).then((hashPassword) => {
        const user = new User({
          name,
          email,
          password: hashPassword,
        });
        //after hash passworded saved to database
        user
          .save()
          .then((user) => {
            res.json({ message: "saved successfully" });
          })
          .catch((error) => {
            console.log(error);
          });
      });
    })
    .catch((error) => {
      console.log(error);
    });
});

/* POST users listing. */
router.post("/login", function (req, res, next) {
  const { password, email } = req.body;

  //simple validate
  if (!password || !email) {
    return res
      .status(400)
      .json({ message: "Please enter your email or password ?" });
  }

  //check for editing user search user follow email if not see user return 400
  User.findOne({ email }).then((user) => {
    if (!user) return res.status(400).json({ message: "User does not exists" });

    // if see validate password if match login compare password: user vs user.password: database
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (!isMatch) return res.status(400).json({ message: "Password Wrong" }); //if false return 400
      //if true match
      jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET,
        // { expiresIn: 3600 },
        (err, token) => {
          if (err) throw err;
          res.json({
            token,
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              followers: user.followers,
              following: user.following,
            },
          });
        }
      );
    });
  });
});

module.exports = router;
