const express = require("express");
const admin = require("../controller/admin/adminController");
const products = require("../controller/productController");
const category = require("../controller/categoryController");
const image = require("../middlewares/ImageUpload");
const routes = express.Router();

routes
  .route("/product")
  .get(products.showProduct)
  .post(image.productImage,admin.addProduct);

  routes.patch("/product/:slug",admin.validateUpdate,admin.updateProduct)
  
  routes.patch("/product/image/:slug",image.productImage,admin.updateImage)
  routes.patch("/category/image/:slug",image.categoryImage,admin.updateCatImage)
  
  routes
  .route("/category")
  .get(category.showCategory)
  .post(image.categoryImage,admin.addCategory);

  routes.route("/category/:slug")
  .get(category.showOneCategory)
  .patch(image.categoryImage,admin.validateUpdate,admin.updateCategory)
  // .delete(admin.deleteCategory)

  routes.route("/price/:id").get(admin.onePrice).patch(admin.updatePrice)

  // routes.get("/grounds",admin.allGround)
  routes.get("/product-booking",admin.viewProductBooking)
  
  routes.get("/carts", admin.allCarts);
  // routes.post("/addAdmin",admin.register)
  // routes.route("/company").get(admin.viewCompanyDetails).patch(admin.updateCompanyDetails);
  // routes.route("/company").get(admin.viewCompanyDetails).patch(admin.updateCompanyDetails);

module.exports = routes;