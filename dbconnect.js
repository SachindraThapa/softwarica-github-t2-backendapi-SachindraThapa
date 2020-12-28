const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

mongoose
  .connect(`mongodb://${process.env.DB_HOST}/${process.env.DB_DATABASE}`, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log(
      `Database connection successful @ ${process.env.DB_HOST}/${process.env.DB_DATABASE}`
    );
  })
  .catch(err => {
    console.error("Database connection error");
  });
