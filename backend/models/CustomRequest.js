const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const CustomRequest = sequelize.define('CustomRequest', {
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
  designDescription: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  preferredMaterial: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  dimensions: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  imageUpload: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'in_progress', 'completed', 'cancelled'),
    defaultValue: 'pending'
  },
  estimatedPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'custom_requests',
  timestamps: true
});

CustomRequest.belongsTo(User, { foreignKey: 'userId' });

module.exports = CustomRequest;

