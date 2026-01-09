const db = require('../config/db');
const response = require('../utils/response');

// Create an order with multiple items in a single transaction.
// Request body: { items: [{ productId, quantity }, ...], userId? }
exports.createOrder = async (req, res) => {
  // allow admin to create order for another user by passing userId in body
  const items = Array.isArray(req.body.items) ? req.body.items : null;
  const requestedUserId = req.body.userId;

  if (requestedUserId && req.user.role !== 'admin') {
    return response.error(res, 'FORBIDDEN', 'Only admin can create orders for other users', 403);
  }

  const userId = requestedUserId ? Number(requestedUserId) : (req.user && req.user.id);
  if (!userId) return response.error(res, 'UNAUTHORIZED', 'Unauthorized', 401);
  if (!items || items.length === 0) return response.error(res, 'INVALID_INPUT', 'Missing items', 400);

  // aggregate quantities per product id to avoid duplicates causing stock issues
  const agg = new Map();
  for (const it of items) {
    const pid = Number(it.productId);
    const qty = Number(it.quantity);
    if (!pid || !qty || qty <= 0 || !Number.isInteger(qty)) {
      return response.error(res, 'INVALID_INPUT', 'Invalid productId or quantity', 400);
    }
    agg.set(pid, (agg.get(pid) || 0) + qty);
  }

  const productIds = Array.from(agg.keys());
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const placeholders = productIds.map(() => '?').join(',');
    const [prodRows] = await conn.execute(
      `SELECT * FROM products WHERE id IN (${placeholders}) FOR UPDATE`,
      productIds
    );

    const prodMap = new Map(prodRows.map(p => [p.id, p]));

    let total = 0;
    for (const [pid, qty] of agg.entries()) {
      const product = prodMap.get(pid);
      if (!product) {
        await conn.rollback(); conn.release();
        return response.error(res, 'NOT_FOUND', `Product ${pid} not found`, 404);
      }
      if (product.stock < qty) {
        await conn.rollback(); conn.release();
        return response.error(res, 'OUT_OF_STOCK', `Out of stock for product ${pid}`, 400);
      }
      total += Number(product.price) * qty;
    }

    const [orderResult] = await conn.execute('INSERT INTO orders (user_id, total, status) VALUES (?, ?, ?)', [userId, total, 'pending']);
    const orderId = orderResult.insertId;

    for (const [pid, qty] of agg.entries()) {
      const product = prodMap.get(pid);
      await conn.execute('INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)', [orderId, pid, qty, product.price]);
      await conn.execute('UPDATE products SET stock = stock - ? WHERE id = ?', [qty, pid]);
    }

    await conn.commit(); conn.release();
    return response.success(res, { orderId }, 'Order created', 201);
  } catch (err) {
    try { await conn.rollback(); } catch (e) {}
    try { conn.release(); } catch (e) {}
    console.error(err);
    return response.error(res, 'SERVER_ERROR', 'Server error', 500, err.message);
  }
};

exports.getMyOrders = async (req, res) => {
  const userId = req.user && req.user.id;
  if (!userId) return response.error(res, 'UNAUTHORIZED', 'Unauthorized', 401);

  const [rows] = await db.execute(`SELECT o.id as order_id, o.total, o.status, o.created_at, oi.product_id, oi.quantity, oi.price FROM orders o LEFT JOIN order_items oi ON oi.order_id = o.id WHERE o.user_id = ?`, [userId]);

  const ordersMap = new Map();
  for (const r of rows) {
    const id = r.order_id;
    if (!ordersMap.has(id)) ordersMap.set(id, { id, total: r.total, status: r.status, created_at: r.created_at, items: [] });
    if (r.product_id) ordersMap.get(id).items.push({ productId: r.product_id, quantity: r.quantity, price: r.price });
  }

  return response.success(res, Array.from(ordersMap.values()));
};
