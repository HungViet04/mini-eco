const products = require('../data/product.data');

exports.createOrder = (userId, productId, quantity) => {
    const product = products.find(p => p.id === productId);

    if (!product) {
        return { error: 'PRODUCT_NOT_FOUND' };
    }

    if (product.stock < quantity) {
        return { error: 'OUT_OF_STOCK' };
    }

    // Trừ kho (fake)
    product.stock -= quantity;

    const order = {
        id: Date.now(),
        userId,
        productId,
        quantity,
        price: product.price,
        total: product.price * quantity,
        createdAt: new Date()
    };

    return { order };
};
