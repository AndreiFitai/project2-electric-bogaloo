const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({
  dest: "public/images/uploads"
});
const User = require("../models/User");
const { ensureLoggedIn } = require("connect-ensure-login");

router.get("/", (req, res, next) => {
  res.render("index");
});

router.get(
  "/user-profile/",
  ensureLoggedIn("/auth/login"),
  (req, res, next) => {
    if (req.user._id === req.params.id || !req.params.id) {
      User.find({ _id: req.user._id }).then(data => {
        res.render("user-profile", data[0]);
      });
    } else {
      User.find({ _id: req.params.id }).then(data => {
        res.render("user-profile", data[0]);
      });
    }
  }
);

router.get("/user-edit", ensureLoggedIn("/auth/login"), (req, res, next) => {
  User.find({ _id: req.user._id }).then(data => {
    res.render("user-edit", data[0]);
  });
});

router.post("/user-edit", ensureLoggedIn("/auth/login"), upload.single("photo"), (req, res, next) => {
  const imgName = req.file.filename;
  const imgPath = `/images/uploads/${imgName}`;
  User.findOneAndUpdate({ _id: req.user._id }, 
    {
      name: req.body.name,
      email: req.body.email,
      picture: imgPath,
      bio: req.body.bio,
      options:
      {
        biweekly_email: req.body.mailopt1,
        event_msg_email: req.body.mailopt2,
        direct_msg_email: req.body.mailopt3,
      },
      interests:
      {
        interest_sports: req.body.sports,
        interest_charity: req.body.charity,
        interest_local: req.body.local,
        interest_lgbt: req.body.lgbt,
        interest_artistical: req.body.artistical,
        interest_politics: req.body.politics,
        interest_educational: req.body.educational,
      }
    }, {new: true})
    .then (data => {
      res.redirect("/user-profile")
    })
});

router.get("/organization", ensureLoggedIn("/auth/login"), (req, res, next) => {
  res.render("organization");
});

router.get("/about", (req, res, next) => {
  res.render("about");
});

module.exports = router;
