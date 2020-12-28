const multer = require("multer");

var userstorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads/users");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  }
});

var productstorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads/products");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  }
});

var categorystorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads/categories");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(JPG|JPEG|PNG|GIF|jpg|jpeg|png|gif)$/)) {
    return cb(new Error("Please upload only image files!"), false);
  }
  cb(null, true);
};

var uupload = multer({ storage: userstorage, fileFilter: fileFilter });
var pupload = multer({ storage: productstorage, fileFilter: fileFilter });
var cupload = multer({ storage: categorystorage, fileFilter: fileFilter });

exports.uploadImage = uupload.single("image");
exports.productImage = pupload.single("image");
exports.categoryImage = cupload.single("image");
exports.fileUpload = uupload.single("file");
