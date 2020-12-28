const Category = require("../model/categoryModel");
const image = require('../middlewares/ImageUpload')

exports.showCategory = async (req, res, next) => {
  const category = await Category.find();
  try{
    res.status(200).send(category) 
  }
  catch(err) {
    res.status(500).send(err)
  }
};

exports.showOneCategory = async (req, res) => {
 await Category.findOne({slug: req.params.slug}).then(categories => {
    res.send(categories);
  }).catch(err=>res.status(500).send(err));
};


