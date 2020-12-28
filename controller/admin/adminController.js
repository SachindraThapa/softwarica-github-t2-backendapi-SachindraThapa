const Category = require("../../model/categoryModel");
const Product = require("../../model/ProductModel");
const BookGround = require("../../model/GroundBooking");
const Price = require("../../model/PriceModel");
const BookProduct = require("../../model/ProductBooking");
const slugify = require("slugify");
const fs = require("fs");

//to add product category by admin
exports.addCategory = (req, res, next) => {
  Category.create({
    name: req.body.name,
    slug: slugify(req.body.name, {
      lower: true
    }),
    image: req.file.filename,
    contents: req.body.contents
  })
    .then(categories => {
      res.status(201).json({
        status: "Categories Added. Success",
        categories
      });
    })
    .catch(err => console.log(err));
};

//to add products by admin
exports.addProduct = (req, res, next) => {
  const products = new Product({
    name: req.body.name,
    slug: slugify(`${req.body.name}`, {
      lower: true
    }),
    brand: req.body.brand,
    discount: req.body.discount,
    image: req.file.filename,
    price: req.body.price,
    category: req.body.category,
    rating: req.body.rating,
    stock: req.body.stock,
    description: req.body.description
  });
  products
    .save()
    .then(
      res.status(201).json({
        status: "success",
        products
      })
    )
    .catch(err => console.log(err));
};

exports.validateUpdate = (req, res, next) => {
  !req.body.slug ? new Error("Please provide slug") : req.body.slug;
  next();
};

exports.updateProduct = async (req, res, next) => {
  const products = await Product.findOne({ slug: req.params.slug });
  
  products.stock = req.body.stock;
  products.name = req.body.name;
  products.slug = req.body.slug;
  products.brand = req.body.brand;
  products.price = req.body.price;
  products.rating = req.body.rating;
  products.description = req.body.description;
  products.category = req.body.category;
  products.discount = req.body.discount;

  products
    .save()
    .then(updated => {
      res.send(updated);
    })
    .catch(err => {
      res.status(500).send(err);
    });
};

exports.updateImage =async (req,res) => {
  const products = await Product.findOne({ slug: req.params.slug });
  fs.unlinkSync("./public/uploads/products/" + products.image);
  
  products.image = req.file.filename;
  products
    .save()
    .then(updated => {
      res.send(updated);
    })
    .catch(err => {
      res.status(500).send(err);
    });
}

exports.deleteProduct = async (req, res) => {
  let prod = await Product.findOne({ slug: req.params.slug });
  if (prod != null) {
    if (prod.image !== null) {
      fs.unlinkSync("./public/uploads/products/" + prod.image);
    }

    await Product.findOneAndRemove(
      { slug: req.params.slug },
      {
        useFindAndModify: false
      }
    );
  } else {
    console.log("No Product Available");
  }

  await Product.find()
    .then(prods => {
      res.status(200).send(prods);
    })
    .catch(err => {
      res.status(500).send(err);
    });
};

exports.viewProductBooking = async (req, res, next) => {
  await BookProduct.aggregate([
    {
      $lookup: {
        from: "products",
        localField: "productId",
        foreignField: "_id",
        as: "products"
      }
    },
    {
      $unwind: {path: "$products"}
    }
  ])
    .then(booked => res.send(booked)).catch(err=>res.send(err))
};

exports.viewGroundBooking = (req, res, next) => {
  BookGround.find()
    .then(ground => res.send(ground))
    .catch(err => res.send(err));
};
// exports.allGround = (req,res,next)=>{
//   Ground.find().then(ground=>res.send(ground)).catch(err=>res.send(err))
// }

exports.onePrice = (req, res, next) => {
  Price.findById(req.params.id)
    .then(pricedetails => res.send(pricedetails))
    .catch(err => res.send(err));
};

exports.updatePrice = async (req, res, next) => {
  const singlePrice = await Price.findById(req.params.id);

  singlePrice.price = req.body.price

  singlePrice
    .save()
    .then(updated=> res.status(201).send({ status: "Success", updated }))
    .catch(err => res.send(err));
};

exports.updateCategory = async (req, res, next) => {
  const category = await Category.findOne({ slug: req.params.slug });
  // const imageFile = req.file ? req.file.filename : category.image;

  // req.file
  //   ? fs.unlinkSync("./public/uploads/categories/" + category.image)
  //   : console.log("No file uploaded");

  category.name = req.body.name;
  category.slug = req.body.slug;
  // category.image = imageFile;
  category.contents = req.body.description;

  category
    .save()
    .then(updated => {
      res.send(updated);
    })
    .catch(err => {
      res.status(500).send(err);
    });
};

exports.updateCatImage =async (req,res) => {
  const categories = await Category.findOne({ slug: req.params.slug });
  fs.unlinkSync("./public/uploads/categories/" + categories.image);
  
  categories.image = req.file.filename;
  categories
    .save()
    .then(updated => {
      res.send(updated);
    })
    .catch(err => {
      res.status(500).send(err);
    });
}

exports.allCarts = (req, res, next) => {
  BookProduct.find().then(
    booked => {
      res.send(booked)
    }
  ).catch(err=>res.send(err))
};
