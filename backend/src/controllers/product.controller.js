const db = require("../config/db");
const response = require('../utils/response');

exports.createProduct = async (req, res) => {
  try {
    const { name, price, stock = 0 } = req.body;
    const category_id = req.body.category_id ?? null;

    if (!name || price == null) {
      return response.error(res, 'INVALID_INPUT', 'Missing name or price', 400);
    }

    const priceNum = Number(price);
    if (!Number.isFinite(priceNum) || priceNum < 0) return response.error(res, 'INVALID_INPUT', 'Invalid price', 400);

    const stockNum = Number(stock);
    if (!Number.isFinite(stockNum) || stockNum < 0 || !Number.isInteger(stockNum)) return response.error(res, 'INVALID_INPUT', 'Invalid stock', 400);

    const categoryIdNum = category_id == null ? null : Number(category_id);
    if (category_id != null && (!Number.isFinite(categoryIdNum) || !Number.isInteger(categoryIdNum))) return response.error(res, 'INVALID_INPUT', 'Invalid category_id', 400);

    const [result] = await db.execute(
      "INSERT INTO products (name, price, stock, category_id) VALUES (?, ?, ?, ?)",
      [name, priceNum, stockNum, categoryIdNum]
    );

    return response.success(res, { id: result.insertId, name, price: priceNum, stock: stockNum, category_id: categoryIdNum }, 'Product created', 201);
  } catch (err) {
    console.error(err);
    return response.error(res, 'SERVER_ERROR', 'Server error', 500, err.message);
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM products");
    return response.success(res, rows);
  } catch (err) {
    console.error(err);
    return response.error(res, 'SERVER_ERROR', 'Server error', 500, err.message);
  }
};

exports.getProductById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) return response.error(res, 'INVALID_INPUT', 'Invalid id', 400);

    const [rows] = await db.execute("SELECT * FROM products WHERE id = ?", [id]);
    const product = rows[0];
    if (!product) return response.error(res, 'NOT_FOUND', 'Product not found', 404);

    return response.success(res, product);
  } catch (err) {
    console.error(err);
    return response.error(res, 'SERVER_ERROR', 'Server error', 500, err.message);
  }
};

exports.searchProducts = async (req, res) => {
  try {
    const q = (req.query.q || '').trim();
    if (!q) return response.success(res, []);

    const [rows] = await db.execute("SELECT * FROM products WHERE name LIKE ?", [`%${q}%`]);
    return response.success(res, rows);
  } catch (err) {
    console.error(err);
    return response.error(res, 'SERVER_ERROR', 'Server error', 500, err.message);
  }
};
