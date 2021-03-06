const express = require("express");
const User = require("../models/users.js");
const bcrypt = require("bcrypt");
const router = express.Router();

router.get("/new", (req, res) => {
  res.render("sessions/new.ejs");
});

router.post("/", (req, res) => {
  User.findOne({ username: req.body.username }, (err, foundUser) => {
    if (bcrypt.compareSync(req.body.password, foundUser.password)) {
      req.session.currentUser = foundUser;
      res.redirect("/");
    } else {
      res.send("Wrong Password");
    }
  });
});
router.delete("/", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});
module.exports = router;
