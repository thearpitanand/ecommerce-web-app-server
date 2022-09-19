// Swagger Import
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// Express Import
const express = require("express");
const router = express.Router();

// Swagger Definitions
const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Shopping ASAP Server",
    version: "1.0.0",
    description:
      "This is a REST API application made with Express. Shopping ASAP is an E-Commerce Website, also known as Electronic commerce or internet commerce, refers to the buying and selling of goods or services using the internet, and the transfer of money and data to execute these transactions.",
    license: {
      name: "Licensed Under MIT",
      url: "https://spdx.org/licenses/MIT.html",
    },
    contact: {
      name: "Arpit Anand",
      url: "https://www.thearpitanand.com",
    },
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Development server",
    },
  ],
};

// Swagger Options
const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ["../routes/*.js"],
};
const swaggerSpec = swaggerJSDoc(options);

// Documentation Route URL
router.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

module.exports = router;
