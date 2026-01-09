const users = require('../data/user.data');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const SECRET_KEY = process.env.JWT_SECRET || 'MY_SECRET_KEY';

exports.login = async (username, password) => {
    const user = users.find(u => u.username === username);
    if (!user) return null;

    // Accept if stored password matches plain OR matches when hashed
    let ok = false;
    try {
        ok = await bcrypt.compare(password, user.password);
    } catch (e) {
        ok = false;
    }

    if (!ok && user.password !== password) {
        return null;
    }

    const payload = {
        id: user.id,
        username: user.username,
        role: user.role
    };

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
    return token;
};

exports.SECRET_KEY = SECRET_KEY;
