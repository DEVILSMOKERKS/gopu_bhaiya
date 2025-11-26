# Shiprocket Integration & Email Notifications

## Overview
This document describes the integration of Shiprocket order management and automated email notifications for the Saanz e-commerce platform.

## Features Implemented

### 1. Shiprocket Integration
- **Automatic Order Creation**: Orders are automatically created in Shiprocket when placed (both COD and online payments)
- **Real-time Tracking**: Integration with Shiprocket's tracking API for real-time shipment updates
- **Courier Serviceability**: Check available couriers for specific pickup and delivery locations

### 2. Email Notifications
- **Order Confirmation**: Automated email sent when order is placed
- **Shipping Notification**: Email sent when order status is updated to "shipped"
- **Professional Templates**: Beautiful, responsive email templates with order details

## Configuration

### Shiprocket Credentials
```javascript
// server/utils/shiprocket.js
const SHIPROCKET_CONFIG = {
  baseURL: 'https://apiv2.shiprocket.in/v1',
  email: 'anishyaadv8461@gmail.com',
  password: 'kV42ddiNl&mGG9YC'
};
```

### Email Configuration
```javascript
// server/utils/emailSender.js
// Update these environment variables in your .env file
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
FRONTEND_URL=https://your-domain.com
```

## API Endpoints

### Public Endpoints

#### 1. Create Order (Razorpay)
```
POST /api/orders/create
```
Creates a Razorpay order for online payments.

#### 2. Create COD Order
```
POST /api/orders/create-cod
```
Creates a Cash on Delivery order with Shiprocket integration.

#### 3. Verify Payment
```
POST /api/orders/verify-payment
```
Verifies Razorpay payment and creates order with Shiprocket integration.

#### 4. Track Order
```
GET /api/orders/track/:orderNumber
```
Tracks order status with Shiprocket integration.

#### 5. Check Courier Serviceability
```
GET /api/orders/check-courier?pickup_pincode=123456&delivery_pincode=654321&weight=0.5
```
Checks available couriers for a route.

### Protected Endpoints (User Authentication Required)

#### 1. Get User Orders
```
GET /api/orders/my-orders
```

#### 2. Get Order Details
```
GET /api/orders/order/:orderId
```

#### 3. Cancel Order
```
POST /api/orders/cancel/:orderId
```

#### 4. Return Order
```
POST /api/orders/return/:orderId
```

### Admin Endpoints (Admin Authentication Required)

#### 1. Get All Orders
```
GET /api/orders/admin/all
```

#### 2. Get Order Details (Admin)
```
GET /api/orders/admin/order/:orderId
```

#### 3. Update Order Status
```
PUT /api/orders/admin/update-status/:orderId
```
Body: `{ "status": "shipped" }`

#### 4. Update Tracking Info
```
PUT /api/orders/admin/update-tracking/:orderId
```
Body: `{ "tracking_number": "AWB123456789" }`

#### 5. Get Order Analytics
```
GET /api/orders/admin/analytics?period=30
```

#### 6. Get Recent Orders
```
GET /api/orders/admin/recent-orders?limit=10
```

## Order Flow

### COD Order Flow
1. User places COD order
2. Order is created in database
3. Shiprocket order is created automatically
4. Order confirmation email is sent
5. Admin can update order status
6. Shipping notification email is sent when status changes to "shipped"

### Online Payment Flow
1. User places online order
2. Razorpay order is created
3. User completes payment
4. Payment is verified via webhook
5. Order is created in database
6. Shiprocket order is created automatically
7. Order confirmation email is sent
8. Admin can update order status
9. Shipping notification email is sent when status changes to "shipped"

## Email Templates

### Order Confirmation Email
- **Subject**: "Order Confirmed - [Order Number]"
- **Content**: Order details, items, shipping address, tracking link
- **Design**: Green gradient header with professional layout

### Order Shipped Email
- **Subject**: "Your Order is Shipped - [Order Number]"
- **Content**: Tracking information, courier details, estimated delivery
- **Design**: Orange gradient header with tracking focus

## Database Schema Updates

### Orders Table
- `tracking_number`: Stores Shiprocket AWB code
- `shipment_id`: Stores Shiprocket shipment ID (optional)

### Order Tracking Table
- Enhanced with Shiprocket tracking entries

## Error Handling

### Shiprocket Integration
- Shiprocket failures don't affect main order creation
- Errors are logged but don't break the order flow
- Fallback to manual tracking if Shiprocket is unavailable

### Email Notifications
- Email failures don't affect order processing
- Errors are logged for debugging
- Graceful degradation if email service is down

## Installation & Setup

### 1. Install Dependencies
```bash
npm install axios
```

### 2. Environment Variables
Add to your `.env` file:
```
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
FRONTEND_URL=https://your-domain.com
```

### 3. Shiprocket Setup
- Ensure Shiprocket credentials are correct in `server/utils/shiprocket.js`
- Test authentication with Shiprocket API
- Verify pickup location is configured in Shiprocket dashboard

### 4. Email Setup
- Configure Gmail or other email service
- Test email sending functionality
- Update support email and phone in email templates

## Testing

### Test Order Creation
1. Create a test order (COD or online)
2. Verify Shiprocket order creation
3. Check email delivery
4. Verify tracking functionality

### Test Order Status Updates
1. Update order status to "shipped"
2. Verify shipping email is sent
3. Check tracking information

### Test Courier Serviceability
1. Call the serviceability endpoint
2. Verify available couriers are returned
3. Test with different pincodes

## Troubleshooting

### Common Issues

#### 1. Shiprocket Authentication Failed
- Check email and password in configuration
- Verify Shiprocket account is active
- Check API rate limits

#### 2. Email Not Sending
- Verify email credentials
- Check Gmail app password setup
- Test with different email service

#### 3. Order Creation Fails
- Check database connection
- Verify required fields are present
- Check Razorpay configuration

#### 4. Tracking Not Working
- Verify tracking number format
- Check Shiprocket API status
- Test with valid AWB codes

## Security Considerations

1. **API Keys**: Store Shiprocket credentials securely
2. **Email Security**: Use app passwords for email services
3. **Data Validation**: Validate all input data
4. **Error Logging**: Don't expose sensitive information in error messages

## Performance Optimization

1. **Async Operations**: Shiprocket and email operations are non-blocking
2. **Connection Pooling**: Database connections are properly managed
3. **Error Handling**: Failures don't affect main order flow
4. **Caching**: Consider caching Shiprocket authentication tokens

## Future Enhancements

1. **Bulk Order Processing**: Handle multiple orders efficiently
2. **Advanced Tracking**: Real-time tracking updates
3. **SMS Notifications**: Add SMS for order updates
4. **Return Management**: Automated return processing
5. **Analytics Dashboard**: Enhanced order analytics

## Support

For technical support or questions:
- Email: support@saanz.com
- Documentation: Check this file for updates
- API Documentation: Refer to Shiprocket API docs
