module.exports = {
  success: (res, data = null, message = 'OK', status = 200) => {
    return res.status(status).json({ success: true, message, data });
  },
  error: (res, code = 'SERVER_ERROR', message = 'Server error', status = 500, details = null) => {
    const payload = { success: false, error: { code, message } };
    if (details) payload.error.details = details;
    return res.status(status).json(payload);
  }
};
