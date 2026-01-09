const express = require("express");
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/auth.route"));
app.use("/api/products", require("./routes/product.routes"));
app.use("/api/orders", require("./routes/order.route"));
app.use("/api/health", require("./routes/health.route"));

// global error handler (last middleware)
const errorHandler = require('./middlewares/error.middleware');
app.use(errorHandler);

module.exports = app;
