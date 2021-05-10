const Product = require("../models/product");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");

exports.createProduct = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "There is some problem with the image",
      });
    }
    //Restructure of the fields.
    const { name, description, price, category, stock } = fields;
    if (!name || !description || !price || !category || !stock) {
      return res.status(400).json({
        error: "Please Provide all the fields.",
      });
    }

    let product = new Product(fields);
    //Handle File Hear
    if (file.photo) {
      if (file.photo.size > 3145728) {
        return res.status(400).json({
          error: "The File is Too big.",
        });
      }
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }
    //Save to the Database
    product.save((err, product) => {
      if (err) {
        return res.status(400).json("Saving photo to the DB Failed");
      }
      res.json(product);
    });
  });
};

exports.getProduct = (req, res) => {
  try {
    req.product.photo = undefined;
    return res.json(req.product);
  } catch (err) {
    console.log(err);
  }
};

exports.removeProduct = (req, res) => {
  let product = req.product;
  product.remove((err, removedProduct) => {
    if (err) {
      return res.status(400).json({
        error: "Unable to delete the product : " + removedProduct.name,
      });
    }
    res.json({
      massage: "Successfully Deleted Product ( " + removedProduct.name + " ).",
    });
  });
};

exports.updateProduct = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "There is some problem with the image",
      });
    }
    //Update product code
    let product = req.product;
    product = _.extend(product, fields);

    //Handle File Hear
    if (file.photo) {
      if (file.photo.size > 3145728) {
        return res.status(400).json({
          error: "The File is Too big.",
        });
      }
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }
    //Save to the Database
    product.save((err, product) => {
      if (err) {
        return res.status(400).json("Product Failed to Update");
      }
      res.json(product);
    });
  });
};

exports.getAllProduct = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 8;
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  Product.find()
    .select("-photo")
    .populate("category")
    .limit(limit)
    .sort([[sortBy, "asc"]])
    .exec((err, products) => {
      if (err) {
        return res.status(400).json({
          error: "No Products Found",
        });
      }
      res.json(products);
    });
};

exports.getAllUniqueCategory = (req, res) => {
  Product.distinct(category, {}, (err, category) => {
    if (err) {
      return res.status(400).json({
        error: "No Category Found",
      });
    }
    res.json(category);
  });
};

//Middleware
exports.getProductById = (req, res, next, id) => {
  Product.findById(id)
    .populate("category")
    .exec((err, product) => {
      if (err) {
        return res.status(400).json({
          error: "Product Not Found",
        });
      }
      req.product = product;
      next();
    });
};

exports.photo = (req, res, next) => {
  if (req.product.photo.data) {
    res.set("Content-Type", req.product.photo.contentType);
    res.send(req.product.photo.data);
  }
  next();
};

exports.updateStock = (req, res, next) => {
  let task = req.body.order.product.map((prod) => {
    return {
      updateOne: {
        filter: { _id: prod._id },
        update: { $inc: { stock: -prod.count, sold: +prod.count } },
      },
    };
  });
  Product.bulkWrite(task, {}, (err, products) => {
    if (err) {
      return res.status(400).json({
        error: "Bulk Operation Failed.",
      });
    }
    next();
  });
};
