const http = require("http");
const dotenv = require("dotenv").config();
const app = require("./app");

require("./dbconnect");
const server = http.createServer(app);

server.listen(process.env.PORT, () =>
  console.log(`Server started on port ${process.env.PORT}`)
);
