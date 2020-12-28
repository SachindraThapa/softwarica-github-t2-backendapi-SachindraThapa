const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const UserRoute = require("./routes/userRoutes");
const AdminRoute = require("./routes/AdminRoutes");
const productRoute = require("./routes/productRoute");
const categoryRoute = require("./routes/categoryRoute");
const auth = require("./middlewares/auth");
const app = express();
const cors = require("cors");

require("dotenv").config();
// console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.static(`${__dirname}/public`));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// app.use(express.urlencoded({extended: true}));
app.options("*", cors());
app.use(cors());

app.use((req, res, next) => {
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT,PATCH,POST,DELETE,GET");
    return res.status(200).json({});
  }
  next();
});

app.get("/", (req, res) => {
  res.send("FUTSAL API");
});
app.use("/user", UserRoute);
// app.use("/ground", ground);
app.use("/product", productRoute);
app.use("/category", categoryRoute);

app.use("/admin", auth.verifyUser, auth.verifyAdmin, AdminRoute);

module.exports = app;
