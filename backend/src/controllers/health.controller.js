const db = require('../config/db');
const response = require('../utils/response');

exports.db = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT 1 as ok');
    return response.success(res, { db: rows && rows.length ? true : false }, 'DB OK');
  } catch (err) {
    console.error('DB health error', err);
    return response.error(res, 'DB_ERROR', 'Database unreachable', 500, err.message);
  }
};

exports.ping = (req, res) => response.success(res, { uptime: process.uptime() }, 'pong');
