const response = require('../utils/response');

module.exports = (err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  const code = err.code || 'SERVER_ERROR';
  const message = err.message || 'Server error';
  response.error(res, code, message, status, err.details || null);
};
