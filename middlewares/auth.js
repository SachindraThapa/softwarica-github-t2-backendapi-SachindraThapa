const jwt = require("jsonwebtoken");
const User = require("../model/userModel");

exports.verifyUser = (req, res, next) => {
  let authHeader = req.headers.authorization;
  if (!authHeader) {
    // let err = new Error("Bearer token is not set!");
    // err.status = 401;
    // return next(err);
    res.status(401).send({ status: "Failed", message: "Please Login first"})
  }
  let token = authHeader.split(" ")[1];
  // console.log(token)
  let data;
  try {
    data = jwt.verify(token, process.env.TOKEN);
  } catch (err) {
    res.status(401).send({ status: "Failed", message: "Token invalid. Login again."})
  }

  User.findById(data.id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(new Error("ERROR"));
};

exports.verifyAdmin = (req, res, next) => {
  if (!req.user) {
    let err = new Error("Go Login First");
    err.status = 401;
    return next(err);
  }
  if (req.user.user_type == "admin") {
    next();
  } else {
    err = "ERROR 403! NO ACCESS";
    next();
  }
};
