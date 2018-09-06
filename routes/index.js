const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({
  dest: "public/images/uploads"
});
const User = require("../models/User");
const Event = require("../models/Event");
const { ensureLoggedIn } = require("connect-ensure-login");

router.get("/", (req, res, next) => {
  Event.find({}).then(data => {
    data = data.slice(0, 4);
    res.render("index", { data });
  });
});

router.get(
  "/user-profile/:id",
  ensureLoggedIn("/auth/login"),
  (req, res, next) => {
    User.find({ _id: req.params.id })
      .populate("event")
      .exec()
      .then(data => {
        res.render("user-profile", data);
      });
  }
);

router.get("/user-edit", ensureLoggedIn("/auth/login"), (req, res, next) => {
  User.find({ _id: req.user._id }).then(data => {
    res.render("user-edit", data[0]);
  });
});

router.post(
  "/user-edit",
  ensureLoggedIn("/auth/login"),
  upload.single("photo"),
  (req, res, next) => {
    let params = {
      name: req.body.name,
      email: req.body.email,
      bio: req.body.bio,
      options: {
        biweekly_email: req.body.mailopt1,
        event_msg_email: req.body.mailopt2,
        direct_msg_email: req.body.mailopt3
      },
      interests: {
        interest_sports: req.body.sports,
        interest_charity: req.body.charity,
        interest_local: req.body.local,
        interest_lgbt: req.body.lgbt,
        interest_artistical: req.body.artistical,
        interest_politics: req.body.politics,
        interest_educational: req.body.educational
      }
    };

    if (req.file) {
      const imgName = req.file.filename;
      const imgPath = `/images/uploads/${imgName}`;
      params.picture = imgPath;
    }
    User.findOneAndUpdate({ _id: req.user._id }, params, { new: true }).then(
      data => {
        res.redirect("/user-profile/" + req.user._id);
      }
    );
  }
);

router.get("/organization", ensureLoggedIn("/auth/login"), (req, res, next) => {
  res.render("organization");
});

router.get("/about", (req, res, next) => {
  res.render("about");
});

module.exports = router;

//algolia
