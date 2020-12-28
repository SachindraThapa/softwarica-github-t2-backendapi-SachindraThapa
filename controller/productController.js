const Product = require("../model/ProductModel");
const Category = require("../model/categoryModel");
const BookProduct = require("../model/ProductBooking");
const BookGround = require("../model/GroundBooking");

exports.showProduct = async (req, res, next) => {
  const queryObj = { ...req.query };
  const excludeFields = ["page", "limit", "sort", "fields"];
  excludeFields.forEach(el => delete queryObj[el]);

  var queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
  // console.log(JSON.parse(queryStr));

  await Product.aggregate([
    {
      $lookup: 
      {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "category_name"
      }
    },
    {
      $unwind: {
        path: "$category_name",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $match: JSON.parse(queryStr)
    }
  ])
  // Product.find(JSON.parse(queryStr))
    .then(products => res.status(200).send(products))
    .catch(err => res.status(500).send("Error " + err));
};

exports.filteredProducts = (req,res,next) => {
  const queryObj = { ...req.query };
  const excludeFields = ["page", "limit", "sort", "fields"];
  excludeFields.forEach(el => delete queryObj[el]);

  var queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
  console.log(JSON.parse(queryStr));

  Product.find(JSON.parse(queryStr))
  .then(prod=>res.send(prod)).catch(err=>res.send(err));
}

exports.countProduct = async (req, res) => {
  console.log("asd");
  // console.log(req.user.username);
  // const ground = await BookGround.find({ username: req.user.username });
  // const booked = await BookProduct.find({
  //   $and: [{ username: req.user.username }, { delivered: false }]
  // });
  await Product.find()
    .then(prods => {
      res.send({
        // ground: ground.length,
        // bookedProds: booked.length,
        productCount: prods.length
      });
    })
    .catch(err => res.send(err));
};

exports.singleProduct = async (req, res, next) => {
  var products = await Product.findOne({ slug: req.params.slug });
  console.log(products)
  const cats = await Category.findById(products.category);

  try {
    res.status(200).send({
      id: products._id,
      discount: products.discount,
      rating: products.name.rating,
      stock: products.name.stock,
      name: products.name,
      slug: products.slug,
      stock: products.stock,
      brand: products.brand,
      image: products.image,
      price: products.price,
      rating: products.rating,
      description: products.description,
      category: cats.name,
      cat_slug: cats.slug,
      category_id: products.category
    });
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.prodBook = async (req, res, next) => {
  var products = await Product.findOne({ slug: req.params.slug });
  console.log(products._id);
  BookProduct.create({
    productId: products._id,
    username: req.user.username,
    quantity: req.body.quantity
  })
    .then(booking =>
      res.send({ status: "Success", message: "Product Added to cart", booking })
    )
    .catch(err => res.send(err));
};
