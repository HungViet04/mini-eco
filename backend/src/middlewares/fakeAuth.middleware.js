module.exports = (req, res, next) => {
    // Giả lập user đã đăng nhập
    req.user = {
        id: 1,
        username: 'testuser',
        role: 'admin' // đổi thành 'admin' để test admin
    };  

    next();
};
