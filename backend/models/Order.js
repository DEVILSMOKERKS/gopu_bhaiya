const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  items: {
    type: DataTypes.JSON,
    allowNull: false
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled'),
    defaultValue: 'pending'
  },
  paymentMethod: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  paymentStatus: {
    type: DataTypes.ENUM('pending', 'completed', 'failed'),
    defaultValue: 'pending'
  },
  razorpayOrderId: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  razorpayPaymentId: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  shippingAddress: {
    type: DataTypes.JSON,
    allowNull: true
  },
  trackingNumber: {
    type: DataTypes.STRING(100),
    allowNull: true
  }
}, {
  tableName: 'orders',
  timestamps: true
});

Order.belongsTo(User, { foreignKey: 'userId' });

module.exports = Order;

