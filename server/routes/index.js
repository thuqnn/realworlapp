var express = require("express");
var router = express.Router();

const MovieCtrl = require("../controllers/movies-ctr");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.post("/movie", MovieCtrl.createMovie);
router.put("/movie/:id", MovieCtrl.updateMovie);
router.delete("/movie/:id", MovieCtrl.deleteMovie);
router.get("/movie/:id", MovieCtrl.getMovieById);
router.get("/movies", MovieCtrl.getMovies);

module.exports = router;
