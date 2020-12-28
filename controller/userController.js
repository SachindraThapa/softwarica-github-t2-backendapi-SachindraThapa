const User = require("../model/userModel");
const Price = require("../model/PriceModel");
const BookGround = require("../model/GroundBooking");
const BookProduct = require("../model/ProductBooking");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const jwToken = id => {
  return jwt.sign({ id: id }, process.env.TOKEN, { expiresIn: "30d" });
};

exports.registerUser = async (req, res) => {
  console.log(req.body);
  let password = req.body.password;
  bcrypt.hash(password, 10, function(err, hash) {
    if (err) {
      res.send({ Status: "Failure", message: err });
      return;
    }
    let imageFile;
    if (req.file) {
      imageFile = `${req.file.filename}`;
    }

    // console.log(imageFile);
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      username: req.body.username,
      profile_image: imageFile,
      password: hash
    });
    user
      .save()
      .then(user => {
        let token = jwToken(user._id);
        // console.log(cookieOptions.secure);
        // res.cookie("jwt", token, cookieOptions);
        res.status(201).json({
          status: "Registration success!",
          token: token
        });
      })
      .catch(err => res.send(err));
  });
};

exports.getAllUser = async (req, res) => {
  const users = await User.find();
  try {
    res.status(200).send(users);
  } catch (err) {
    res.status(200).json({
      status: "success",
      requestTime: req.requestTime,
      message: err
    });
  }
};

exports.getSingleUser = async (req, res, next) => {
  try {
    res.status(200).json(req.user);
  } catch (err) {
    res.status(400).json({
      status: "Failure",
      message: err
    });
  }
};

exports.updateUser = async (req, res, next) => {
  const userData = await User.findOne({ username: req.user.username });
  console.log(req.body);
  userData.name = req.body.name;
  userData.email = req.body.email;
  userData.phone = req.body.phone;

  userData
    .save()
    .then(result => {
      res.status(200).json({
        status: "success",
        message: `${req.user.username}'s data is updated`
      });
    })
    .catch(err => res.status(400).json({ status: "Failure", message: err }));
};

exports.updateImage = async (req, res, next) => {
  // console.log(req.file.filename);
  const userData = await User.findOne({ username: req.user.username });

  await userData
    .updateOne({ profile_image: req.body.image })
    .then( updated => {
      res.status(200).json({
        status: "Success",
        message: `${req.user.username}'s profile picture updated`
      })
    }
    )
    .catch(err => res.status(400).json({ status: "Failure", message: err }));
};

exports.updatePassword = async (req, res, next) => {
  const user = await User.findOne({ username: req.user.username });

  bcrypt
    .compare(req.body.password, user.password)
    .then(isMatch => {
      if (!isMatch) {
        let err = new Error("Incorrect Password!");
        err.status = 401;
        return next(err);
      }
      bcrypt.hash(req.body.newpassword, 10, (err, hash) => {
        if (err) {
          let err = new Error();
          err.status = 500;
          return next(err);
        } else {
          user.password = hash;
          user.save();
          let token = jwToken(user._id);
          res.json({
            status: "Successful",
            token: token
          });
        }
      });
    })
    .catch(err => res.send(err));
};

exports.login = (req, res, next) => {
  User.findOne({
    $or: [{ username: req.body.email }, { email: req.body.email }]
  })
    .then(user => {
      if (user == null) {
        let err = new Error("User not found! Please Check tour username/email");
        err.status = 400;
        return next(err);
      } else {
        bcrypt
          .compare(req.body.password, user.password)
          .then(isMatch => {
            if (!isMatch) {
              let err = new Error("Incorrect Password!");
              err.status = 401;
              return next(err);
            }
            let token = jwToken(user._id);
            res.json({
              status: "Successful",
              token: token
            });
          })
          .catch(next);
      }
    })
    .catch(next);
};

exports.bookGround = (req, res) => {
  BookGround.find({ date_and_time: req.body.date + " : " + req.body.time })
    .exec()
    .then(ground => {
      if (ground.length >= 1) {
        res.status(406).json({
          status: "Booking not available"
        });
      } else if (req.body.date < new Date().toISOString()) {
        res.status(400).send({
          status: "Please choose valid date"
        });
      } else {
        BookGround.create({
          date_and_time: req.body.date + " : " + req.body.time,
          username: req.user.username
        })
          .then(booking =>
            res
              .status(201)
              .send({ status: "Success", message: "Ground is booked", booking })
          )
          .catch(err => res.send({ status: "Booking already exits", err }));
      }
    })
    .catch(err =>
      res.send({
        status: "Booking already exits",
        err
      })
    );
};

exports.allGround = (req, res, next) => {
  BookGround.find()
  .sort('-date_and_time').exec()
    .then(ground => {
      var groundData = [];
      ground.forEach(element => {
        var dt = element.date_and_time
        groundData.push({
          id: element._id,
          date: dt.split(" : ")[0],
          time: dt.split(" : ")[1],
          username: element.username,
          username: element.username,
          username: element.username,
        })
      });
      res.status(200).send(groundData);
      // var date = ground.date_and_time.split(" : ")[0];
      // var time = ground.date_and_time.split(" : ")[1];
    }).catch(err=>res.send(err))
}

exports.viewPrice = (req, res, next) => {
  Price.find()
    .then(pricedetails => res.send(pricedetails))
    .catch(err => res.send(err));
};

exports.myCart = (req,res,next) => {
  BookProduct.aggregate([
    { $match: {username: req.user.username} },
    {
      $lookup: {
        from: "products",
        localField: "productId",
        foreignField: "_id",
        as: "products"
      }
    },
    {
      $unwind: {
        path: "$products",
        preserveNullAndEmptyArrays: true
      }
    },
    {$sort: {"delivered": 1}}
  ]).then(result=>res.send(result))
  .catch(err=>res.send(err))
}

exports.myGround = (req,res,next) => {
  BookGround.find({username: req.user.username})
  .sort('-date_and_time').exec()
  .then(ground => {
    var groundData = [];
    ground.forEach(element => {
      var dt = element.date_and_time
      groundData.push({
        id: element._id,
        date: dt.split(" : ")[0],
        time: dt.split(" : ")[1],
        username: element.username})
    });
    res.status(200).send(groundData);
    // var date = ground.date_and_time.split(" : ")[0];
    // var time = ground.date_and_time.split(" : ")[1];
  }).catch(err=>res.send(err))
}

exports.deleteCart = (req,res,next)=> {
  const del = BookProduct.findById(req.params.id);

  BookProduct.deleteOne(del).then(deleted => res.send({status: "Product deleted from Cart"}))
  .catch(err=>res.send(err));
}
exports.deleteGround = (req,res,next)=> {
  const del = BookGround.findById(req.params.id);

  BookGround.deleteOne(del).then(deleted => res.send({status: "Ground booking deleted."}))
  .catch(err=>res.send(err));
}