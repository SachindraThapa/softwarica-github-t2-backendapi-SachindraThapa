

// const validation = body.checkSchema({
//   password : {
//   isLength: {
//     errorMessage: 'Password should be at least 6 chars long',
//     // Multiple options would be expressed as an array
//     options: { min: 6 }
//   }
// },
// })


/////////////////////////////////////////////////////////////////////

const register = () => [
  //* name valaidation
  check('name')
      .notEmpty().withMessage('Please enter your first Name')
      .isAlpha()
      .withMessage('Name must contain alphabets')
      .isLength({ min: 3 })
      .withMessage('Name must contain atleast 3 alphabets'),

  //* last name validation
  // check('last_Name')
  //     .notEmpty().withMessage('Please enter your last name')
  //     .isAlpha()
  //     .withMessage('Last Name must contain alphabets')
  //     .isLength({ min: 2 })
  //     .withMessage('Last Name must contain atleast 2 alphabets'),

  //* email validation
  check('email')
      .notEmpty().withMessage('Please enter your email')
      .isEmail()
      .withMessage('Please enter the valid Email'),


  //* password validation
  check('password')
      .notEmpty().withMessage('Required Password')
      .isLength({ min: 7 })
      .withMessage('Password should not be empty, minimum eigh characters, at least one letter, one number and one special character'),


  //* confirm password validation
  // check('Confirm_Password')
  // .custom(Confirm_Password =>{
  //  if(Password !== Confirm_Password){
  //         throw new Error('Password do not match with confirm password')
  //     }
  // }),

  //* phone no validation
  check('phone')
      .notEmpty().withMessage('Required mobile number')
      .isLength({ max: 10 })
      .withMessage('Invalid mobile number')
      .isNumeric()
      .withMessage('Mobile No. should be numeric'),


  //* address validation
  // check('address')
  //     .notEmpty().withMessage('Required Address'),

];

//* post  form api router
// eslint-disable-next-line consistent-return
router.post('/signup',register(), (req, res) => {
  const error = validationResult(req); //* field validation request

  if (!error.isEmpty()) {
      return res.status(400).json(error.array());
  }
})

module.exports = router