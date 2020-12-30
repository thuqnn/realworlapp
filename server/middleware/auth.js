const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = mongoose.model("User");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  //authorization === Thu Pham
  if (!authorization) {
    return res.status(401).json({ error: "you must be logged in !" });
  }
  const token = authorization.replace("Thu Pham", "");
  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) {
      return res.status(401).json({ error: "you must be logged in" });
    }

    const { id } = payload; //id of user login
    console.log(payload);
    User.findById(id).then((userdata) => {
      req.user = userdata;
      next();
    });
  });
};
