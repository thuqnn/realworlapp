var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/abc", async function (req, res, next) {
  return res.json({ test: "test" });
});

module.exports = router;
