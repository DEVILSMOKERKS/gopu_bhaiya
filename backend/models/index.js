// Export all models for easy importing
const User = require('./User');
const Product = require('./Product');
const Order = require('./Order');
const Review = require('./Review');
const CustomRequest = require('./CustomRequest');

// Define associations
Order.belongsTo(User, { foreignKey: 'userId' });
Review.belongsTo(User, { foreignKey: 'userId' });
Review.belongsTo(Product, { foreignKey: 'productId' });
CustomRequest.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
  User,
  Product,
  Order,
  Review,
  CustomRequest,
};

