
const bcrypt = require("bcrypt");
const User = require("../modals/User");


exports.getlogin = (req, res, next) => {
  let flash = req.flash("error");
  let errormssg = null;
  if (flash) {
    errormssg = flash[0];
  } else {
    errormssg = null;
  }
  return res.render("auth/login", { title: "Login", flash: errormssg });
};

exports.getsignup = (req, res, next) => {
  res.render("auth/signup", { title: "Signup" });
};

exports.postsignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const fname=req.body.fname
  const mname=req.body.mname
  const lname=req.body.lname
  User.findOne({ email: email }).then(user => {
    if (user) {
      req.flash("error", "Account with that email already exists !");
      return res.redirect("/login");
    }
    bcrypt
      .hash(password, 12)
      .then(result => {
        const user = new User({
          email: email,
          password: result,
          resettoken: undefined,
          firstname:fname,
          middlename:mname,
          lastname:lname
        });
        return user.save();
      })
      .then(() => {
        res.redirect("/login");
      });
  });
};

exports.postlogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email }).then(user => {
    if (!user) {
      req.flash("error", "No account with that email found !");
      return res.redirect("/login");
    }
    bcrypt.compare(password, user.password).then(result => {
      if (result) {
        req.session.user = user;
        req.session.isauth = true;
        return req.session.save(() => {
          res.redirect("/");
        });
      }
    });
  });
};

exports.getlogout = (req, res, next) => {
  req.session.destroy(() => {
    return res.redirect("/login");
  });
};

