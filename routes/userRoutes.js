const express = require("express");
const bodyParser = require("body-parser");
const userController = require("../controller/userController");
const routes = express.Router();
const auth = require('../middlewares/auth');
// const valid = require('../middlewares/validation');
const image = require('../middlewares/ImageUpload');
const { check , validationResult }=require('express-validator')

const registerFun = () => [
  //* name valaidation
  // check('name')
  //     .notEmpty().withMessage('Please enter your Name'),
      // .isAlpha()
      // .withMessage('Name must contain alphabets')
      // .isLength({ min: 3 })
      // .withMessage('Name must contain atleast 3 alphabets'),

  //* last name validation
  // check('last_Name')
  //     .notEmpty().withMessage('Please enter your last name')
  //     .isAlpha()
  //     .withMessage('Last Name must contain alphabets')
  //     .isLength({ min: 2 })
  //     .withMessage('Last Name must contain atleast 2 alphabets'),

  //* email validation
  // check('email')
  //     .notEmpty().withMessage('Please enter your email'),
      // .isEmail()
      // .withMessage('Please enter the valid Email'),


  //* password validation
  // check('password')
  //     .notEmpty().withMessage('Required Password'),
      // .isLength({ min: 7 })
      // .withMessage('Password should not be empty, minimum eigh characters, at least one letter, one number and one special character'),


  //* confirm password validation
  // check('Confirm_Password')
  // .custom(Confirm_Password =>{
  //  if(Password !== Confirm_Password){
  //         throw new Error('Password do not match with confirm password')
  //     }
  // }),

  //* phone no validation
  // check('phone')
  //     .notEmpty().withMessage('Required mobile number')
      // .isLength({ max: 10 })
      // .withMessage('Invalid mobile number')
      // .isNumeric()
      // .withMessage('Mobile No. should be numeric'),


  //* address validation
  // check('address')
  //     .notEmpty().withMessage('Required Address'),

];


routes.use(bodyParser.urlencoded({ extended: true }));

routes.post("/upload", image.uploadImage,(req,res)=>{
  console.log(req.file.filename)
  res.json(req.file)
});

routes
  .route("/register")
  .get(auth.verifyUser,auth.verifyAdmin,userController.getAllUser)
  .post(image.uploadImage, userController.registerUser);

routes.post('/login',userController.login);

routes
  .route("/me")
  .get(auth.verifyUser,userController.getSingleUser)
  .patch(auth.verifyUser,userController.updateUser)

  routes.patch("/me/image",auth.verifyUser,userController.updateImage);
  routes.patch("/me/password",auth.verifyUser,userController.updatePassword);

  routes.route("/ground-booking")
  .get(userController.allGround)
  .post(auth.verifyUser, userController.bookGround);

  routes.get("/price",userController.viewPrice)

  routes.get("/carts", auth.verifyUser,userController.myCart)
  routes.delete("/carts/:id", auth.verifyUser, userController.deleteCart);
  
  routes.get("/grounds", auth.verifyUser,userController.myGround)
  routes.delete("/grounds/:id", auth.verifyUser, userController.deleteGround);

  module.exports = routes;