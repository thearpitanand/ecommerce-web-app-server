require("dotenv").config();

const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

//Routes
const authRoutes = require("./routes/authentication");
const userRoutes = require("./routes/user");
const categoryRoute = require("./routes/category");
const productRoute = require("./routes/product");
const orderRoute = require("./routes/order");

//Middleware
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

//DB Connections
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("DB CONNECTED");
  });

//Routes
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", categoryRoute);
app.use("/api", productRoute);
app.use("/api", orderRoute);

//PORT
const port = 8000 || process.env.PORT;

//Starting a Server
app.listen(port, () => {
  console.log(`app is running at ${port}`);
});
