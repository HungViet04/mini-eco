const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const response = require('../utils/response');

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET || 'access_secret_key';

// REGISTER: require username, email, password
exports.register = async (req, res) => {
  const name = (req.body.name || req.body.username || '').trim();
  const { email = '', password = '' } = req.body;
  const role = 'user'; // force role to 'user' on public registration to prevent spoofing

  if (!name || !email || !password) {
    return response.error(res, 'INVALID_INPUT', 'Missing name, email or password', 400);
  }

  // basic validations
  if (name.length < 2) return response.error(res, 'INVALID_INPUT', 'Name too short', 400);
  const emailRe = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  if (!emailRe.test(String(email).toLowerCase())) return response.error(res, 'INVALID_INPUT', 'Invalid email', 400);
  if (String(password).length < 6) return response.error(res, 'INVALID_INPUT', 'Password must be at least 6 characters', 400);

  const hash = await bcrypt.hash(password, 10);

  try {
    await db.execute(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, hash, role]
    );

    return response.success(res, null, 'Register success', 201);
  } catch (err) {
    console.error(err);
    if (err && err.code === 'ER_DUP_ENTRY') {
      return response.error(res, 'DUPLICATE_EMAIL', 'Email already exists', 409);
    }
    return response.error(res, 'DB_ERROR', 'Database error', 500, err.message);
  }
};

// LOGIN: allow login by username or email
exports.login = async (req, res) => {

  const { identifier, password } = req.body; // identifier can be name or email

  if (!identifier || !password) return response.error(res, 'INVALID_INPUT', 'Missing credentials', 400);

  const [rows] = await db.execute(
    "SELECT * FROM users WHERE name = ? OR email = ?",
    [identifier, identifier]
  );

  if (rows.length === 0) return response.error(res, 'AUTH_FAILED', 'User not found', 401);

  const user = rows[0];
  const match = await bcrypt.compare(password, user.password);
  if (!match) return response.error(res, 'AUTH_FAILED', 'Wrong password', 401);

  const accessToken = jwt.sign(
    { id: user.id, role: user.role },
    ACCESS_SECRET,
    { expiresIn: '15m' }
  );

  return response.success(res, { accessToken }, 'Login success');
};

