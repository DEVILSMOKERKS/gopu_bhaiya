// Email template colors - matching index.css variables
const EMAIL_COLORS = {
  // Primary Colors
  primary: '#B68126',
  primaryDark: '#956213',
  primaryGreen: '#128737',

  // Text Colors
  textPrimary: '#1a1a2e',
  textSecondary: '#333',
  textTertiary: '#666',
  textQuaternary: '#999',
  textWhite: '#ffffff',

  // Background Colors
  bgPrimary: '#ffffff',
  bgSecondary: '#f8f9fa',
  bgLight: '#f5f5f5',
  bgDark: '#1a1a2e',

  // Accent Colors
  accentGold: '#B68126',
  accentError: '#e74c3c',
  accentRed: '#ff4757',
  accentOrange: '#f59e0b',
  accentBlue: '#3b82f6',

  // Border Colors
  borderLight: '#ccc',
  borderMedium: '#e5e7eb',

  // Additional colors for gradients
  gradientPurple: '#764ba2',
  gradientBlue: '#667eea',
};

// Use shared email service (SMTP host config + rate limit)
const { getTransporter, sendMail: sendMailViaService, sendOTP } = require('./emailService');

const createTransporter = () => getTransporter();

// Email templates
const emailTemplates = {
  passwordReset: (resetLink, adminName) => ({
    subject: 'Password Reset Request - Welcome To Mateshwari Moorti Bhanda Admin',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, ${EMAIL_COLORS.primary} 0%, ${EMAIL_COLORS.primaryDark} 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: ${EMAIL_COLORS.textWhite}; margin: 0; font-size: 24px;">Welcome To Mateshwari Moorti Bhanda Admin</h1>
          <p style="color: ${EMAIL_COLORS.textWhite}; margin: 10px 0 0 0; opacity: 0.9;">Password Reset Request</p>
        </div>
        
        <div style="background: ${EMAIL_COLORS.bgPrimary}; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <h2 style="color: ${EMAIL_COLORS.textPrimary}; margin: 0 0 20px 0;">Hello ${adminName},</h2>
          
          <p style="color: ${EMAIL_COLORS.textTertiary}; line-height: 1.6; margin: 0 0 20px 0;">
            We received a request to reset your password for your Welcome To Mateshwari Moorti Bhanda Admin account. 
            If you didn't make this request, you can safely ignore this email.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" 
               style="background: ${EMAIL_COLORS.primary}; color: ${EMAIL_COLORS.textWhite}; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 500;">
              Reset Password
            </a>
          </div>
          
          <p style="color: ${EMAIL_COLORS.textTertiary}; line-height: 1.6; margin: 0 0 20px 0;">
            This link will expire in <strong>1 hour</strong> for security reasons. 
            If you need to reset your password again, please request a new link.
          </p>
          
          <div style="background: ${EMAIL_COLORS.bgSecondary}; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="color: ${EMAIL_COLORS.textTertiary}; margin: 0; font-size: 14px;">
              <strong>Security Tip:</strong> Never share this link with anyone. 
              Our team will never ask for your password or this reset link.
            </p>
          </div>
          
          <p style="color: ${EMAIL_COLORS.textTertiary}; line-height: 1.6; margin: 0 0 20px 0;">
            If you're having trouble clicking the button, copy and paste this URL into your browser:
          </p>
          
          <p style="color: ${EMAIL_COLORS.primary}; word-break: break-all; margin: 0 0 30px 0; font-size: 14px;">
            ${resetLink}
          </p>
          
          <hr style="border: none; border-top: 1px solid ${EMAIL_COLORS.borderMedium}; margin: 30px 0;">
          
          <p style="color: ${EMAIL_COLORS.textQuaternary}; font-size: 12px; margin: 0; text-align: center;">
            This email was sent from Welcome To Mateshwari Moorti Bhanda Admin Panel. 
            If you have any questions, please contact support.
          </p>
        </div>
      </div>
    `,
    text: `
      Password Reset Request - Welcome To Mateshwari Moorti Bhanda Admin
      
      Hello ${adminName},
      
      We received a request to reset your password for your Welcome To Mateshwari Moorti Bhanda Admin account. 
      If you didn't make this request, you can safely ignore this email.
      
      Click the following link to reset your password:
      ${resetLink}
      
      This link will expire in 1 hour for security reasons.
      
      If you're having trouble, copy and paste the URL into your browser.
      
      Best regards,
      Welcome To Mateshwari Moorti Bhanda Admin Team
    `
  }),

  welcomeAdmin: (adminName, loginUrl) => ({
    subject: 'Welcome To Mateshwari Moorti Bhanda Admin Panel',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, ${EMAIL_COLORS.primary} 0%, ${EMAIL_COLORS.primaryDark} 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: ${EMAIL_COLORS.textWhite}; margin: 0; font-size: 24px;">Welcome To Mateshwari Moorti Bhanda</h1>
          <p style="color: ${EMAIL_COLORS.textWhite}; margin: 10px 0 0 0; opacity: 0.9;">Admin Panel Access</p>
        </div>
        
        <div style="background: ${EMAIL_COLORS.bgPrimary}; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <h2 style="color: ${EMAIL_COLORS.textPrimary}; margin: 0 0 20px 0;">Hello ${adminName},</h2>
          
          <p style="color: ${EMAIL_COLORS.textTertiary}; line-height: 1.6; margin: 0 0 20px 0;">
            Welcome to the Welcome To Mateshwari Moorti Bhanda Admin Panel! Your account has been successfully created and you can now access the admin dashboard.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${loginUrl}" 
               style="background: ${EMAIL_COLORS.primary}; color: ${EMAIL_COLORS.textWhite}; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 500;">
              Access Admin Panel
            </a>
          </div>
          
          <div style="background: ${EMAIL_COLORS.bgSecondary}; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: ${EMAIL_COLORS.textPrimary}; margin: 0 0 10px 0;">What you can do:</h3>
            <ul style="color: ${EMAIL_COLORS.textTertiary}; margin: 0; padding-left: 20px;">
              <li>Manage products and inventory</li>
              <li>View and process orders</li>
              <li>Manage customer accounts</li>
              <li>View analytics and reports</li>
              <li>Update store settings</li>
            </ul>
          </div>
          
          <p style="color: ${EMAIL_COLORS.textTertiary}; line-height: 1.6; margin: 0 0 20px 0;">
            If you have any questions or need assistance, please don't hesitate to contact our support team.
          </p>
          
          <hr style="border: none; border-top: 1px solid ${EMAIL_COLORS.borderMedium}; margin: 30px 0;">
          
          <p style="color: ${EMAIL_COLORS.textQuaternary}; font-size: 12px; margin: 0; text-align: center;">
            Welcome To Mateshwari Moorti Bhanda Admin Panel
          </p>
        </div>
      </div>
    `,
    text: `
      Welcome To Mateshwari Moorti Bhanda Admin Panel
      
      Hello ${adminName},
      
      Welcome to the Welcome To Mateshwari Moorti Bhanda Admin Panel! Your account has been successfully created and you can now access the admin dashboard.
      
      Access your admin panel here: ${loginUrl}
      
      What you can do:
      - Manage products and inventory
      - View and process orders
      - Manage customer accounts
      - View analytics and reports
      - Update store settings
      
      If you have any questions or need assistance, please don't hesitate to contact our support team.
      
      Best regards,
      Welcome To Mateshwari Moorti Bhanda Admin Team
    `
  }),

  orderConfirmation: (orderData) => ({
    subject: `Order Confirmed - ${orderData.order_number}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, ${EMAIL_COLORS.primaryGreen} 0%, ${EMAIL_COLORS.primaryGreen} 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: ${EMAIL_COLORS.textWhite}; margin: 0; font-size: 24px;">🎉 Order Confirmed!</h1>
          <p style="color: ${EMAIL_COLORS.textWhite}; margin: 10px 0 0 0; opacity: 0.9;">Thank you for your order</p>
        </div>
        
        <div style="background: ${EMAIL_COLORS.bgPrimary}; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <h2 style="color: ${EMAIL_COLORS.textPrimary}; margin: 0 0 20px 0;">Hello ${orderData.customer_name},</h2>
          
          <p style="color: ${EMAIL_COLORS.textTertiary}; line-height: 1.6; margin: 0 0 20px 0;">
            Great news! Your order has been confirmed and we're preparing it for shipment. 
            We'll notify you once your package is on its way.
          </p>
          
          <div style="background: ${EMAIL_COLORS.bgSecondary}; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid ${EMAIL_COLORS.primary};">
            <h3 style="color: ${EMAIL_COLORS.textPrimary}; margin: 0 0 10px 0;">Order Details</h3>
            <p style="color: ${EMAIL_COLORS.textTertiary}; margin: 5px 0;"><strong>Order Number:</strong> ${orderData.order_number}</p>
            <p style="color: ${EMAIL_COLORS.textTertiary}; margin: 5px 0;"><strong>Order Date:</strong> ${new Date(orderData.created_at).toLocaleDateString()}</p>
            <p style="color: ${EMAIL_COLORS.textTertiary}; margin: 5px 0;"><strong>Payment Method:</strong> ${orderData.payment_method}</p>
            <p style="color: ${EMAIL_COLORS.textTertiary}; margin: 5px 0;"><strong>Total Amount:</strong> ₹${orderData.final_amount}</p>
            ${orderData.tracking_number ? `<p style="color: ${EMAIL_COLORS.textTertiary}; margin: 5px 0;"><strong>Tracking Number:</strong> ${orderData.tracking_number}</p>` : ''}
          </div>
          
          <div style="background: ${EMAIL_COLORS.bgSecondary}; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: ${EMAIL_COLORS.textPrimary}; margin: 0 0 15px 0;">Order Items</h3>
            ${orderData.items.map(item => `
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid ${EMAIL_COLORS.borderMedium};">
                <div>
                  <p style="color: ${EMAIL_COLORS.textPrimary}; margin: 0; font-weight: 500;">${item.product_name}</p>
                  <p style="color: ${EMAIL_COLORS.textTertiary}; margin: 5px 0; font-size: 14px;">Qty: ${item.quantity} | ${item.size} | ${item.color}</p>
                </div>
                <p style="color: ${EMAIL_COLORS.textPrimary}; margin: 0; font-weight: 500;">₹${item.total_price}</p>
              </div>
            `).join('')}
          </div>
          
          <div style="background: ${EMAIL_COLORS.bgSecondary}; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: ${EMAIL_COLORS.textPrimary}; margin: 0 0 15px 0;">Shipping Address</h3>
            <p style="color: ${EMAIL_COLORS.textTertiary}; margin: 5px 0;">${orderData.shipping_address.firstName} ${orderData.shipping_address.lastName}</p>
            <p style="color: ${EMAIL_COLORS.textTertiary}; margin: 5px 0;">${orderData.shipping_address.address}</p>
            <p style="color: ${EMAIL_COLORS.textTertiary}; margin: 5px 0;">${orderData.shipping_address.city}, ${orderData.shipping_address.state || 'Rajasthan'} ${orderData.shipping_address.postalCode}</p>
            <p style="color: ${EMAIL_COLORS.textTertiary}; margin: 5px 0;">Phone: ${orderData.shipping_address.phone}</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}/track-order/${orderData.order_number}" 
               style="background: ${EMAIL_COLORS.primary}; color: ${EMAIL_COLORS.textWhite}; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 500;">
              Track Your Order
            </a>
          </div>
          
          <div style="background: ${EMAIL_COLORS.bgSecondary}; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="color: ${EMAIL_COLORS.primaryDark}; margin: 0; font-size: 14px;">
              <strong>📞 Need Help?</strong> If you have any questions about your order, 
              please contact our customer support team at Mateshvariexporter@gmail.com or call us at +91 77919 83156 | +91 88242 92890 | +91 97845 03338
            </p>
          </div>
          
          <hr style="border: none; border-top: 1px solid ${EMAIL_COLORS.borderMedium}; margin: 30px 0;">
          
          <p style="color: ${EMAIL_COLORS.textQuaternary}; font-size: 12px; margin: 0; text-align: center;">
            Thank you for choosing Welcome To Mateshwari Moorti Bhanda! We appreciate your business.
          </p>
        </div>
      </div>
    `,
    text: `
      Order Confirmed - ${orderData.order_number}
      
      Hello ${orderData.customer_name},
      
      Great news! Your order has been confirmed and we're preparing it for shipment. 
      We'll notify you once your package is on its way.
      
      Order Details:
      - Order Number: ${orderData.order_number}
      - Order Date: ${new Date(orderData.created_at).toLocaleDateString()}
      - Payment Method: ${orderData.payment_method}
      - Total Amount: ₹${orderData.final_amount}
      ${orderData.tracking_number ? `- Tracking Number: ${orderData.tracking_number}` : ''}
      
      Order Items:
      ${orderData.items.map(item => `- ${item.product_name} (Qty: ${item.quantity}, ${item.size}, ${item.color}) - ₹${item.total_price}`).join('\n')}
      
      Shipping Address:
      ${orderData.shipping_address.firstName} ${orderData.shipping_address.lastName}
      ${orderData.shipping_address.address}
      ${orderData.shipping_address.city}, ${orderData.shipping_address.state || 'Rajasthan'} ${orderData.shipping_address.postalCode}
      Phone: ${orderData.shipping_address.phone}
      
      Track your order: ${process.env.FRONTEND_URL}/track-order/${orderData.order_number}
      
      Need Help? Contact our customer support team at Mateshvariexporter@gmail.com
      
      Thank you for choosing Welcome To Mateshwari Moorti Bhanda!
    `
  }),

  orderShipped: (orderData) => ({
    subject: `Your Order is Shipped - ${orderData.order_number}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, ${EMAIL_COLORS.accentOrange} 0%, ${EMAIL_COLORS.accentOrange} 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: ${EMAIL_COLORS.textWhite}; margin: 0; font-size: 24px;">🚚 Order Shipped!</h1>
          <p style="color: ${EMAIL_COLORS.textWhite}; margin: 10px 0 0 0; opacity: 0.9;">Your package is on its way</p>
        </div>
        
        <div style="background: ${EMAIL_COLORS.bgPrimary}; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <h2 style="color: ${EMAIL_COLORS.textPrimary}; margin: 0 0 20px 0;">Hello ${orderData.customer_name},</h2>
          
          <p style="color: ${EMAIL_COLORS.textTertiary}; line-height: 1.6; margin: 0 0 20px 0;">
            Exciting news! Your order has been shipped and is now on its way to you. 
            You can track your package using the tracking information below.
          </p>
          
          <div style="background: ${EMAIL_COLORS.bgSecondary}; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid ${EMAIL_COLORS.accentOrange};">
            <h3 style="color: ${EMAIL_COLORS.textPrimary}; margin: 0 0 10px 0;">Tracking Information</h3>
            <p style="color: ${EMAIL_COLORS.textTertiary}; margin: 5px 0;"><strong>Order Number:</strong> ${orderData.order_number}</p>
            <p style="color: ${EMAIL_COLORS.textTertiary}; margin: 5px 0;"><strong>Tracking Number:</strong> ${orderData.tracking_number}</p>
            <p style="color: ${EMAIL_COLORS.textTertiary}; margin: 5px 0;"><strong>Courier:</strong> ${orderData.courier_name || 'Standard Delivery'}</p>
            <p style="color: ${EMAIL_COLORS.textTertiary}; margin: 5px 0;"><strong>Estimated Delivery:</strong> 3-5 business days</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}/track-order/${orderData.order_number}" 
               style="background: ${EMAIL_COLORS.accentOrange}; color: ${EMAIL_COLORS.textWhite}; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 500;">
              Track Your Package
            </a>
          </div>
          
          <div style="background: ${EMAIL_COLORS.bgSecondary}; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="color: ${EMAIL_COLORS.primaryDark}; margin: 0; font-size: 14px;">
              <strong>💡 Pro Tip:</strong> You can also track your package directly on the courier's website using the tracking number above.
            </p>
          </div>
          
          <hr style="border: none; border-top: 1px solid ${EMAIL_COLORS.borderMedium}; margin: 30px 0;">
          
          <p style="color: ${EMAIL_COLORS.textQuaternary}; font-size: 12px; margin: 0; text-align: center;">
            Thank you for choosing Welcome To Mateshwari Moorti Bhanda! We hope you love your purchase.
          </p>
        </div>
      </div>
    `,
    text: `
      Your Order is Shipped - ${orderData.order_number}
      
      Hello ${orderData.customer_name},
      
      Exciting news! Your order has been shipped and is now on its way to you. 
      You can track your package using the tracking information below.
      
      Tracking Information:
      - Order Number: ${orderData.order_number}
      - Tracking Number: ${orderData.tracking_number}
      - Courier: ${orderData.courier_name || 'Standard Delivery'}
      - Estimated Delivery: 3-5 business days
      
      Track your package: ${process.env.FRONTEND_URL}/track-order/${orderData.order_number}
      
      Pro Tip: You can also track your package directly on the courier's website using the tracking number above.
      
      Thank you for choosing Welcome To Mateshwari Moorti Bhanda!
    `
  }),

  contactConfirmation: (contactData) => ({
    subject: 'Thank you for contacting Welcome To Mateshwari Moorti Bhanda - We\'ll get back to you soon!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, ${EMAIL_COLORS.primary} 0%, ${EMAIL_COLORS.primaryDark} 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: ${EMAIL_COLORS.textWhite}; margin: 0; font-size: 24px;">📧 Message Received!</h1>
          <p style="color: ${EMAIL_COLORS.textWhite}; margin: 10px 0 0 0; opacity: 0.9;">Thank you for contacting Welcome To Mateshwari Moorti Bhanda</p>
        </div>
        
        <div style="background: ${EMAIL_COLORS.bgPrimary}; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <h2 style="color: ${EMAIL_COLORS.textPrimary}; margin: 0 0 20px 0;">Hello ${contactData.name},</h2>
          
          <p style="color: ${EMAIL_COLORS.textTertiary}; line-height: 1.6; margin: 0 0 20px 0;">
            Thank you for reaching out to us! We have received your message and our team will get back to you as soon as possible.
          </p>
          
          <div style="background: ${EMAIL_COLORS.bgSecondary}; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid ${EMAIL_COLORS.primary};">
            <h3 style="color: ${EMAIL_COLORS.textPrimary}; margin: 0 0 10px 0;">Your Message Details</h3>
            <p style="color: ${EMAIL_COLORS.textTertiary}; margin: 5px 0;"><strong>Subject:</strong> ${contactData.subject}</p>
            <p style="color: ${EMAIL_COLORS.textTertiary}; margin: 5px 0;"><strong>Message:</strong></p>
            <div style="background: ${EMAIL_COLORS.bgLight}; padding: 15px; border-radius: 6px; margin: 10px 0;">
              <p style="color: ${EMAIL_COLORS.textTertiary}; margin: 0; line-height: 1.6;">${contactData.message}</p>
            </div>
          </div>
          
          <div style="background: ${EMAIL_COLORS.bgSecondary}; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="color: ${EMAIL_COLORS.primaryDark}; margin: 0; font-size: 14px;">
              <strong>⏰ Response Time:</strong> We typically respond to all inquiries within 24-48 hours during business days.
            </p>
          </div>
          
          <div style="background: ${EMAIL_COLORS.bgSecondary}; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="color: ${EMAIL_COLORS.primaryDark}; margin: 0; font-size: 14px;">
              <strong>📞 Need Immediate Help?</strong> For urgent matters, you can call us at +91 77919 83156 | +91 88242 92890 | +91 97845 03338 or email us at Mateshvariexporter@gmail.com
            </p>
          </div>
          
          <hr style="border: none; border-top: 1px solid ${EMAIL_COLORS.borderMedium}; margin: 30px 0;">
          
          <p style="color: ${EMAIL_COLORS.textQuaternary}; font-size: 12px; margin: 0; text-align: center;">
            Thank you for choosing Welcome To Mateshwari Moorti Bhanda! We appreciate your patience.
          </p>
        </div>
      </div>
    `,
    text: `
      Thank you for contacting Welcome To Mateshwari Moorti Bhanda - We'll get back to you soon!
      
      Hello ${contactData.name},
      
      Thank you for reaching out to us! We have received your message and our team will get back to you as soon as possible.
      
      Your Message Details:
      - Subject: ${contactData.subject}
      - Message: ${contactData.message}
      
      Response Time: We typically respond to all inquiries within 24-48 hours during business days.
      
      Need Immediate Help? For urgent matters, you can call us at +91 77919 83156 | +91 88242 92890 | +91 97845 03338 or email us at Mateshvariexporter@gmail.com
      
      Thank you for choosing Welcome To Mateshwari Moorti Bhanda! We appreciate your patience.
    `
  }),

  contactNotification: (contactData) => ({
    subject: `New Contact Query from ${contactData.name} - Query #${contactData.queryId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, ${EMAIL_COLORS.accentError} 0%, ${EMAIL_COLORS.accentError} 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: ${EMAIL_COLORS.textWhite}; margin: 0; font-size: 24px;">🆕 New Contact Query</h1>
          <p style="color: ${EMAIL_COLORS.textWhite}; margin: 10px 0 0 0; opacity: 0.9;">Action Required</p>
        </div>
        
        <div style="background: ${EMAIL_COLORS.bgPrimary}; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <h2 style="color: ${EMAIL_COLORS.textPrimary}; margin: 0 0 20px 0;">New Contact Query Received</h2>
          
          <div style="background: ${EMAIL_COLORS.bgSecondary}; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid ${EMAIL_COLORS.accentError};">
            <h3 style="color: ${EMAIL_COLORS.textPrimary}; margin: 0 0 10px 0;">Query Information</h3>
            <p style="color: ${EMAIL_COLORS.textTertiary}; margin: 5px 0;"><strong>Query ID:</strong> #${contactData.queryId}</p>
            <p style="color: ${EMAIL_COLORS.textTertiary}; margin: 5px 0;"><strong>Name:</strong> ${contactData.name}</p>
            <p style="color: ${EMAIL_COLORS.textTertiary}; margin: 5px 0;"><strong>Email:</strong> ${contactData.email}</p>
            <p style="color: ${EMAIL_COLORS.textTertiary}; margin: 5px 0;"><strong>Phone:</strong> ${contactData.phone}</p>
            <p style="color: ${EMAIL_COLORS.textTertiary}; margin: 5px 0;"><strong>Subject:</strong> ${contactData.subject}</p>
            <p style="color: ${EMAIL_COLORS.textTertiary}; margin: 5px 0;"><strong>Message:</strong></p>
            <div style="background: ${EMAIL_COLORS.bgLight}; padding: 15px; border-radius: 6px; margin: 10px 0;">
              <p style="color: ${EMAIL_COLORS.textTertiary}; margin: 0; line-height: 1.6;">${contactData.message}</p>
            </div>
          </div>
          
          <div style="background: ${EMAIL_COLORS.bgSecondary}; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="color: ${EMAIL_COLORS.primaryDark}; margin: 0; font-size: 14px;">
              <strong>📋 Action Required:</strong> Please review this query and respond to the customer within 24-48 hours.
            </p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.ADMIN_PANEL_URL}/contact-queries/${contactData.queryId}" 
               style="background: ${EMAIL_COLORS.accentError}; color: ${EMAIL_COLORS.textWhite}; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 500;">
              View Query Details
            </a>
          </div>
          
          <hr style="border: none; border-top: 1px solid ${EMAIL_COLORS.borderMedium}; margin: 30px 0;">
          
          <p style="color: ${EMAIL_COLORS.textQuaternary}; font-size: 12px; margin: 0; text-align: center;">
            This is an automated notification from the Welcome To Mateshwari Moorti Bhanda Admin Panel.
          </p>
        </div>
      </div>
    `,
    text: `
      New Contact Query from ${contactData.name} - Query #${contactData.queryId}
      
      New Contact Query Received
      
      Query Information:
      - Query ID: #${contactData.queryId}
      - Name: ${contactData.name}
      - Email: ${contactData.email}
      - Phone: ${contactData.phone}
      - Subject: ${contactData.subject}
      - Message: ${contactData.message}
      
      Action Required: Please review this query and respond to the customer within 24-48 hours.
      
      View Query Details: ${process.env.ADMIN_PANEL_URL}/contact-queries/${contactData.queryId}
      
      This is an automated notification from the Welcome To Mateshwari Moorti Bhanda Admin Panel.
    `
  }),

  contactStatusUpdate: (contactData) => ({
    subject: `Your Contact Query Status Updated - ${contactData.subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, ${EMAIL_COLORS.primaryGreen} 0%, ${EMAIL_COLORS.primaryGreen} 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: ${EMAIL_COLORS.textWhite}; margin: 0; font-size: 24px;">📊 Status Update</h1>
          <p style="color: ${EMAIL_COLORS.textWhite}; margin: 10px 0 0 0; opacity: 0.9;">Your query has been updated</p>
        </div>
        
        <div style="background: ${EMAIL_COLORS.bgPrimary}; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <h2 style="color: ${EMAIL_COLORS.textPrimary}; margin: 0 0 20px 0;">Hello ${contactData.name},</h2>
          
          <p style="color: ${EMAIL_COLORS.textTertiary}; line-height: 1.6; margin: 0 0 20px 0;">
            We wanted to let you know that the status of your contact query has been updated.
          </p>
          
          <div style="background: ${EMAIL_COLORS.bgSecondary}; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid ${EMAIL_COLORS.primary};">
            <h3 style="color: ${EMAIL_COLORS.textPrimary}; margin: 0 0 10px 0;">Status Update</h3>
            <p style="color: ${EMAIL_COLORS.textTertiary}; margin: 5px 0;"><strong>Subject:</strong> ${contactData.subject}</p>
            <p style="color: ${EMAIL_COLORS.textTertiary}; margin: 5px 0;"><strong>Previous Status:</strong> <span style="text-transform: capitalize;">${contactData.oldStatus}</span></p>
            <p style="color: ${EMAIL_COLORS.textTertiary}; margin: 5px 0;"><strong>New Status:</strong> <span style="text-transform: capitalize;">${contactData.newStatus}</span></p>
            ${contactData.adminNotes ? `<p style="color: ${EMAIL_COLORS.textTertiary}; margin: 5px 0;"><strong>Admin Notes:</strong> ${contactData.adminNotes}</p>` : ''}
          </div>
          
          <div style="background: ${EMAIL_COLORS.bgSecondary}; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="color: ${EMAIL_COLORS.primaryDark}; margin: 0; font-size: 14px;">
              <strong>📝 What This Means:</strong> 
              ${contactData.newStatus === 'in_progress' ? 'We are actively working on your query and will provide updates soon.' :
        contactData.newStatus === 'resolved' ? 'Your query has been resolved. If you need further assistance, please let us know.' :
          contactData.newStatus === 'closed' ? 'Your query has been closed. Thank you for contacting us.' : 'Your query is being reviewed by our team.'}
            </p>
          </div>
          
          <div style="background: ${EMAIL_COLORS.bgSecondary}; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="color: ${EMAIL_COLORS.primaryDark}; margin: 0; font-size: 14px;">
              <strong>📞 Need More Help?</strong> If you have any questions about this update, please contact us at Mateshvariexporter@gmail.com or call us at +91 77919 83156 | +91 88242 92890 | +91 97845 03338
            </p>
          </div>
          
          <hr style="border: none; border-top: 1px solid ${EMAIL_COLORS.borderMedium}; margin: 30px 0;">
          
          <p style="color: ${EMAIL_COLORS.textQuaternary}; font-size: 12px; margin: 0; text-align: center;">
            Thank you for choosing Welcome To Mateshwari Moorti Bhanda! We appreciate your patience.
          </p>
        </div>
      </div>
    `,
    text: `
      Your Contact Query Status Updated - ${contactData.subject}
      
      Hello ${contactData.name},
      
      We wanted to let you know that the status of your contact query has been updated.
      
      Status Update:
      - Subject: ${contactData.subject}
      - Previous Status: ${contactData.oldStatus}
      - New Status: ${contactData.newStatus}
      ${contactData.adminNotes ? `- Admin Notes: ${contactData.adminNotes}` : ''}
      
      What This Means: 
      ${contactData.newStatus === 'in_progress' ? 'We are actively working on your query and will provide updates soon.' :
        contactData.newStatus === 'resolved' ? 'Your query has been resolved. If you need further assistance, please let us know.' :
          contactData.newStatus === 'closed' ? 'Your query has been closed. Thank you for contacting us.' : 'Your query is being reviewed by our team.'}
      
      Need More Help? If you have any questions about this update, please contact us at Mateshvariexporter@gmail.com or call us at +91 77919 83156 | +91 88242 92890 | +91 97845 03338
      
      Thank you for choosing Welcome To Mateshwari Moorti Bhanda! We appreciate your patience.
    `
  }),

  consultationConfirmation: (data) => ({
    subject: 'Talk to Our Expert – Request Received | Welcome To Mateshwari Moorti Bhanda',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, ${EMAIL_COLORS.primary} 0%, ${EMAIL_COLORS.primaryDark} 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: ${EMAIL_COLORS.textWhite}; margin: 0; font-size: 24px;">Talk to Our Expert</h1>
          <p style="color: ${EMAIL_COLORS.textWhite}; margin: 10px 0 0 0; opacity: 0.9;">Request received</p>
        </div>
        <div style="background: ${EMAIL_COLORS.bgPrimary}; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <h2 style="color: ${EMAIL_COLORS.textPrimary}; margin: 0 0 20px 0;">Hello ${data.name},</h2>
          <p style="color: ${EMAIL_COLORS.textTertiary}; line-height: 1.6; margin: 0 0 20px 0;">
            Thank you for reaching out! We have received your expert consultation request and our team will get back to you within 24–48 hours.
          </p>
          <div style="background: ${EMAIL_COLORS.bgSecondary}; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid ${EMAIL_COLORS.primary};">
            <h3 style="color: ${EMAIL_COLORS.textPrimary}; margin: 0 0 10px 0;">Your details</h3>
            <p style="color: ${EMAIL_COLORS.textTertiary}; margin: 5px 0;"><strong>City:</strong> ${data.city}</p>
            <p style="color: ${EMAIL_COLORS.textTertiary}; margin: 5px 0;"><strong>You are:</strong> ${data.aboutYourself === 'homeowner' ? 'Homeowner (pooja unit/room)' : 'Interior designer/consultant'}</p>
          </div>
          <p style="color: ${EMAIL_COLORS.textTertiary}; line-height: 1.6; margin: 0 0 20px 0;">
            Need immediate help? Call us at +91 77919 83156 | +91 88242 92890 | +91 97845 03338 or email Mateshvariexporter@gmail.com
          </p>
          <hr style="border: none; border-top: 1px solid ${EMAIL_COLORS.borderMedium}; margin: 30px 0;" />
          <p style="color: ${EMAIL_COLORS.textQuaternary}; font-size: 12px; margin: 0; text-align: center;">Welcome To Mateshwari Moorti Bhanda</p>
        </div>
      </div>
    `,
    text: `
      Talk to Our Expert – Request Received

      Hello ${data.name},

      Thank you for reaching out! We have received your expert consultation request and our team will get back to you within 24–48 hours.

      Your details: City: ${data.city}, You are: ${data.aboutYourself === 'homeowner' ? 'Homeowner' : 'Interior designer/consultant'}

      Need immediate help? Call +91 77919 83156 | +91 88242 92890 | +91 97845 03338 or email Mateshvariexporter@gmail.com

      Welcome To Mateshwari Moorti Bhanda
    `
  }),

  consultationNotification: (data) => ({
    subject: `New Expert Consultation Request – ${data.name} (#${data.consultationId})`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, ${EMAIL_COLORS.accentError} 0%, ${EMAIL_COLORS.accentError} 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: ${EMAIL_COLORS.textWhite}; margin: 0; font-size: 24px;">New Expert Consultation</h1>
          <p style="color: ${EMAIL_COLORS.textWhite}; margin: 10px 0 0 0; opacity: 0.9;">Talk to Our Expert – action required</p>
        </div>
        <div style="background: ${EMAIL_COLORS.bgPrimary}; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <h2 style="color: ${EMAIL_COLORS.textPrimary}; margin: 0 0 20px 0;">New consultation request</h2>
          <div style="background: ${EMAIL_COLORS.bgSecondary}; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid ${EMAIL_COLORS.accentError};">
            <h3 style="color: ${EMAIL_COLORS.textPrimary}; margin: 0 0 10px 0;">Details</h3>
            <p style="color: ${EMAIL_COLORS.textTertiary}; margin: 5px 0;"><strong>ID:</strong> #${data.consultationId}</p>
            <p style="color: ${EMAIL_COLORS.textTertiary}; margin: 5px 0;"><strong>Name:</strong> ${data.name}</p>
            <p style="color: ${EMAIL_COLORS.textTertiary}; margin: 5px 0;"><strong>Email:</strong> ${data.email}</p>
            <p style="color: ${EMAIL_COLORS.textTertiary}; margin: 5px 0;"><strong>Phone:</strong> ${data.phone}</p>
            <p style="color: ${EMAIL_COLORS.textTertiary}; margin: 5px 0;"><strong>City:</strong> ${data.city}</p>
            <p style="color: ${EMAIL_COLORS.textTertiary}; margin: 5px 0;"><strong>About:</strong> ${data.aboutYourself === 'homeowner' ? 'Homeowner (pooja unit/room)' : 'Interior designer/consultant'}</p>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.ADMIN_PANEL_URL || ''}/admin/expert-consultations" style="background: ${EMAIL_COLORS.accentError}; color: ${EMAIL_COLORS.textWhite}; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 500;">View in Admin</a>
          </div>
          <hr style="border: none; border-top: 1px solid ${EMAIL_COLORS.borderMedium}; margin: 30px 0;" />
          <p style="color: ${EMAIL_COLORS.textQuaternary}; font-size: 12px; margin: 0; text-align: center;">Welcome To Mateshwari Moorti Bhanda Admin</p>
        </div>
      </div>
    `,
    text: `
      New Expert Consultation – ${data.name} (#${data.consultationId})

      Name: ${data.name}
      Email: ${data.email}
      Phone: ${data.phone}
      City: ${data.city}
      About: ${data.aboutYourself === 'homeowner' ? 'Homeowner' : 'Interior designer/consultant'}

      View in Admin: ${process.env.ADMIN_PANEL_URL || ''}/admin/expert-consultations
    `
  }),

  consultationStatusUpdate: (data) => ({
    subject: 'Your Expert Consultation Status Updated | Welcome To Mateshwari Moorti Bhanda',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, ${EMAIL_COLORS.primaryGreen} 0%, ${EMAIL_COLORS.primaryGreen} 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: ${EMAIL_COLORS.textWhite}; margin: 0; font-size: 24px;">Consultation Status Update</h1>
        </div>
        <div style="background: ${EMAIL_COLORS.bgPrimary}; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <h2 style="color: ${EMAIL_COLORS.textPrimary}; margin: 0 0 20px 0;">Hello ${data.name},</h2>
          <p style="color: ${EMAIL_COLORS.textTertiary}; line-height: 1.6; margin: 0 0 20px 0;">Your expert consultation request status has been updated.</p>
          <div style="background: ${EMAIL_COLORS.bgSecondary}; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="color: ${EMAIL_COLORS.textTertiary}; margin: 5px 0;"><strong>Previous:</strong> ${(data.oldStatus || '').replace('_', ' ')}</p>
            <p style="color: ${EMAIL_COLORS.textTertiary}; margin: 5px 0;"><strong>New:</strong> ${(data.newStatus || '').replace('_', ' ')}</p>
            ${data.adminNotes ? `<p style="color: ${EMAIL_COLORS.textTertiary}; margin: 10px 0 0 0;"><strong>Note:</strong> ${data.adminNotes}</p>` : ''}
          </div>
          <hr style="border: none; border-top: 1px solid ${EMAIL_COLORS.borderMedium}; margin: 30px 0;" />
          <p style="color: ${EMAIL_COLORS.textQuaternary}; font-size: 12px; margin: 0; text-align: center;">Welcome To Mateshwari Moorti Bhanda</p>
        </div>
      </div>
    `,
    text: `
      Consultation Status Update

      Hello ${data.name},

      Your expert consultation status: ${data.oldStatus} → ${data.newStatus}
      ${data.adminNotes ? `Note: ${data.adminNotes}` : ''}

      Welcome To Mateshwari Moorti Bhanda
    `
  }),

  appointmentConfirmation: (data) => ({
    subject: 'Appointment Request Received | Welcome To Mateshwari Moorti Bhanda',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, ${EMAIL_COLORS.primary} 0%, ${EMAIL_COLORS.primaryDark} 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: ${EMAIL_COLORS.textWhite}; margin: 0; font-size: 24px;">Appointment Request Received</h1>
          <p style="color: ${EMAIL_COLORS.textWhite}; margin: 10px 0 0 0; opacity: 0.9;">Welcome To Mateshwari Moorti Bhanda</p>
        </div>
        <div style="background: ${EMAIL_COLORS.bgPrimary}; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <h2 style="color: ${EMAIL_COLORS.textPrimary}; margin: 0 0 20px 0;">Hello ${data.name},</h2>
          <p style="color: ${EMAIL_COLORS.textTertiary}; line-height: 1.6; margin: 0 0 20px 0;">We have received your appointment request. Our team will contact you shortly to confirm.</p>
          <div style="background: ${EMAIL_COLORS.bgSecondary}; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid ${EMAIL_COLORS.primary};">
            <h3 style="color: ${EMAIL_COLORS.textPrimary}; margin: 0 0 10px 0;">Your appointment details</h3>
            <p style="color: ${EMAIL_COLORS.textTertiary}; margin: 5px 0;"><strong>Full Name:</strong> ${data.name}</p>
            <p style="color: ${EMAIL_COLORS.textTertiary}; margin: 5px 0;"><strong>Contact:</strong> ${data.contactNumber}</p>
            <p style="color: ${EMAIL_COLORS.textTertiary}; margin: 5px 0;"><strong>City:</strong> ${data.city}</p>
            <p style="color: ${EMAIL_COLORS.textTertiary}; margin: 5px 0;"><strong>Type:</strong> ${data.appointmentTypeLabel || data.appointmentType}</p>
            <p style="color: ${EMAIL_COLORS.textTertiary}; margin: 5px 0;"><strong>Date:</strong> ${data.selectedDate}</p>
            <p style="color: ${EMAIL_COLORS.textTertiary}; margin: 5px 0;"><strong>Time:</strong> ${data.selectedTime}</p>
          </div>
          <p style="color: ${EMAIL_COLORS.textTertiary}; line-height: 1.6; margin: 0 0 20px 0;">If you need to change or cancel, call us at +91 77919 83156 | +91 88242 92890 | +91 97845 03338 or email Mateshvariexporter@gmail.com</p>
          <hr style="border: none; border-top: 1px solid ${EMAIL_COLORS.borderMedium}; margin: 30px 0;" />
          <p style="color: ${EMAIL_COLORS.textQuaternary}; font-size: 12px; margin: 0; text-align: center;">Welcome To Mateshwari Moorti Bhanda</p>
        </div>
      </div>
    `,
    text: `
      Appointment Request Received

      Hello ${data.name},

      We have received your appointment request. Our team will contact you shortly to confirm.

      Your details: ${data.name}, ${data.contactNumber}, ${data.city}
      Type: ${data.appointmentTypeLabel || data.appointmentType}
      Date: ${data.selectedDate} at ${data.selectedTime}

      Contact: +91 77919 83156 | +91 88242 92890 | +91 97845 03338 | Mateshvariexporter@gmail.com
      Welcome To Mateshwari Moorti Bhanda
    `
  }),

  appointmentNotification: (data) => ({
    subject: `New Appointment Request – ${data.name} | ${data.selectedDate} ${data.selectedTime}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, ${EMAIL_COLORS.accentError} 0%, ${EMAIL_COLORS.accentError} 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: ${EMAIL_COLORS.textWhite}; margin: 0; font-size: 24px;">New Appointment Request</h1>
          <p style="color: ${EMAIL_COLORS.textWhite}; margin: 10px 0 0 0; opacity: 0.9;">Book Appointment – action required</p>
        </div>
        <div style="background: ${EMAIL_COLORS.bgPrimary}; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <h2 style="color: ${EMAIL_COLORS.textPrimary}; margin: 0 0 20px 0;">Appointment details</h2>
          <div style="background: ${EMAIL_COLORS.bgSecondary}; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid ${EMAIL_COLORS.accentError};">
            <p style="color: ${EMAIL_COLORS.textTertiary}; margin: 5px 0;"><strong>Full Name:</strong> ${data.name}</p>
            <p style="color: ${EMAIL_COLORS.textTertiary}; margin: 5px 0;"><strong>Email:</strong> ${data.email || 'Not provided'}</p>
            <p style="color: ${EMAIL_COLORS.textTertiary}; margin: 5px 0;"><strong>Contact Number:</strong> ${data.contactNumber}</p>
            <p style="color: ${EMAIL_COLORS.textTertiary}; margin: 5px 0;"><strong>City:</strong> ${data.city}</p>
            <p style="color: ${EMAIL_COLORS.textTertiary}; margin: 5px 0;"><strong>Appointment Type:</strong> ${data.appointmentTypeLabel || data.appointmentType}</p>
            <p style="color: ${EMAIL_COLORS.textTertiary}; margin: 5px 0;"><strong>Date:</strong> ${data.selectedDate}</p>
            <p style="color: ${EMAIL_COLORS.textTertiary}; margin: 5px 0;"><strong>Time:</strong> ${data.selectedTime}</p>
          </div>
          <hr style="border: none; border-top: 1px solid ${EMAIL_COLORS.borderMedium}; margin: 30px 0;" />
          <p style="color: ${EMAIL_COLORS.textQuaternary}; font-size: 12px; margin: 0; text-align: center;">Welcome To Mateshwari Moorti Bhanda Admin</p>
        </div>
      </div>
    `,
    text: `
      New Appointment Request – ${data.name}

      Full Name: ${data.name}
      Email: ${data.email || 'Not provided'}
      Contact: ${data.contactNumber}
      City: ${data.city}
      Type: ${data.appointmentTypeLabel || data.appointmentType}
      Date: ${data.selectedDate}
      Time: ${data.selectedTime}

      Welcome To Mateshwari Moorti Bhanda Admin
    `
  }),

  newsletterWelcome: (data) => ({
    subject: 'Welcome To Mateshwari Moorti Bhanda Newsletter! 🎉',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, ${EMAIL_COLORS.primaryDark} 0%, ${EMAIL_COLORS.primaryDark} 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: ${EMAIL_COLORS.textWhite}; margin: 0; font-size: 24px;">Welcome To Mateshwari Moorti Bhanda!</h1>
          <p style="color: ${EMAIL_COLORS.textWhite}; margin: 10px 0 0 0; opacity: 0.9;">You're now part of our exclusive club</p>
        </div>
        
        <div style="background: ${EMAIL_COLORS.bgPrimary}; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <h2 style="color: ${EMAIL_COLORS.textPrimary}; margin: 0 0 20px 0;">Thank you for subscribing! 🎉</h2>
          
          <p style="color: ${EMAIL_COLORS.textTertiary}; line-height: 1.6; margin: 0 0 20px 0;">
            Welcome to the Welcome To Mateshwari Moorti Bhanda family! We're thrilled to have you join our exclusive newsletter community.
          </p>
          
          <div style="background: ${EMAIL_COLORS.bgSecondary}; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: ${EMAIL_COLORS.textPrimary}; margin: 0 0 15px 0;">What you'll get:</h3>
            <ul style="color: ${EMAIL_COLORS.textTertiary}; line-height: 1.6; margin: 0; padding-left: 20px;">
              <li>🎂 <strong>15% off for your birthday!</strong></li>
              <li>🛍️ Early access to new collections</li>
              <li>💎 Exclusive offers and discounts</li>
              <li>📱 Latest fashion trends and styling tips</li>
              <li>🎁 Special member-only promotions</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}/shop" 
               style="background: ${EMAIL_COLORS.primaryDark}; color: ${EMAIL_COLORS.textWhite}; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 500;">
              Start Shopping
            </a>
          </div>
          
          <p style="color: ${EMAIL_COLORS.textTertiary}; line-height: 1.6; margin: 0; font-size: 14px; text-align: center;">
            Follow us on social media for daily inspiration and updates!
          </p>
        </div>
      </div>
    `,
    text: `
      Welcome To Mateshwari Moorti Bhanda Newsletter! 🎉
      
      Thank you for subscribing!
      
      Welcome to the Welcome To Mateshwari Moorti Bhanda family! We're thrilled to have you join our exclusive newsletter community.
      
      What you'll get:
      - 🎂 15% off for your birthday!
      - 🛍️ Early access to new collections
      - 💎 Exclusive offers and discounts
      - 📱 Latest fashion trends and styling tips
      - 🎁 Special member-only promotions
      
      Start Shopping: ${process.env.FRONTEND_URL}/shop
      
      Follow us on social media for daily inspiration and updates!
    `
  }),

  newsletterSubscription: (data) => ({
    subject: 'New Newsletter Subscription - Welcome To Mateshwari Moorti Bhanda',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, ${EMAIL_COLORS.primaryDark} 0%, ${EMAIL_COLORS.primaryDark} 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: ${EMAIL_COLORS.textWhite}; margin: 0; font-size: 24px;">Welcome To Mateshwari Moorti Bhanda Admin</h1>
          <p style="color: ${EMAIL_COLORS.textWhite}; margin: 10px 0 0 0; opacity: 0.9;">New Newsletter Subscription</p>
        </div>
        
        <div style="background: ${EMAIL_COLORS.bgPrimary}; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <h2 style="color: ${EMAIL_COLORS.textPrimary}; margin: 0 0 20px 0;">New Newsletter Subscriber</h2>
          
          <div style="background: ${EMAIL_COLORS.bgSecondary}; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: ${EMAIL_COLORS.textPrimary}; margin: 0 0 15px 0;">Subscriber Details:</h3>
            <p style="color: ${EMAIL_COLORS.textTertiary}; margin: 5px 0;"><strong>Email:</strong> ${data.email}</p>
            <p style="color: ${EMAIL_COLORS.textTertiary}; margin: 5px 0;"><strong>Subscriber ID:</strong> #${data.subscriberId}</p>
            <p style="color: ${EMAIL_COLORS.textTertiary}; margin: 5px 0;"><strong>Subscribed At:</strong> ${new Date().toLocaleString()}</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.ADMIN_PANEL_URL}/admin" 
               style="background: ${EMAIL_COLORS.primaryDark}; color: ${EMAIL_COLORS.textWhite}; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 500;">
              View in Admin Panel
            </a>
          </div>
          
          <p style="color: ${EMAIL_COLORS.textTertiary}; line-height: 1.6; margin: 0; font-size: 14px; text-align: center;">
            This is an automated notification from the Welcome To Mateshwari Moorti Bhanda newsletter subscription.
          </p>
        </div>
      </div>
    `,
    text: `
      New Newsletter Subscription - Welcome To Mateshwari Moorti Bhanda
      
      New Newsletter Subscriber
      
      Subscriber Details:
      - Email: ${data.email}
      - Subscriber ID: #${data.subscriberId}
      - Subscribed At: ${new Date().toLocaleString()}
      
      View in Admin Panel: ${process.env.ADMIN_PANEL_URL}/admin
      
      This is an automated notification from the Welcome To Mateshwari Moorti Bhanda newsletter subscription.
    `
  }),

  newsletter: (data) => ({
    subject: data.subject,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, ${EMAIL_COLORS.primaryDark} 0%, ${EMAIL_COLORS.primaryDark} 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: ${EMAIL_COLORS.textWhite}; margin: 0; font-size: 24px;">Welcome To Mateshwari Moorti Bhanda Newsletter</h1>
          <p style="color: ${EMAIL_COLORS.textWhite}; margin: 10px 0 0 0; opacity: 0.9;">${data.subject}</p>
        </div>
        
        <div style="background: ${EMAIL_COLORS.bgPrimary}; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <div style="color: ${EMAIL_COLORS.textPrimary}; line-height: 1.6;">
            ${data.content}
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}/shop" 
               style="background: ${EMAIL_COLORS.primaryDark}; color: ${EMAIL_COLORS.textWhite}; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 500;">
              Shop Now
            </a>
          </div>
          
          <hr style="border: none; border-top: 1px solid ${EMAIL_COLORS.borderMedium}; margin: 30px 0;">
          
          <p style="color: ${EMAIL_COLORS.textTertiary}; line-height: 1.6; margin: 0; font-size: 14px; text-align: center;">
            Thank you for being part of the Welcome To Mateshwari Moorti Bhanda family!<br>
            Follow us on social media for daily inspiration and updates.
          </p>
        </div>
      </div>
    `,
    text: `
      ${data.subject}
      
      ${data.content.replace(/<[^>]*>/g, '')}
      
      Shop Now: ${process.env.FRONTEND_URL}/shop
      
      Thank you for being part of the Welcome To Mateshwari Moorti Bhanda family!
      Follow us on social media for daily inspiration and updates.
    `
  })
};

// Send email function (uses rate-limited emailService.sendMail)
const sendEmail = async (to, template, data = {}) => {
  try {
    const emailTemplate = emailTemplates[template];
    if (!emailTemplate) {
      throw new Error(`Email template '${template}' not found`);
    }

    let emailContent;
    if (template === 'orderConfirmation' || template === 'orderShipped' ||
      template === 'contactConfirmation' || template === 'contactNotification' ||
      template === 'contactStatusUpdate' || template === 'consultationConfirmation' ||
      template === 'consultationNotification' || template === 'consultationStatusUpdate' ||
      template === 'appointmentConfirmation' || template === 'appointmentNotification' ||
      template === 'newsletterWelcome' ||
      template === 'newsletterSubscription' || template === 'newsletter') {
      emailContent = emailTemplate(data);
    } else {
      emailContent = typeof emailTemplate === 'function'
        ? emailTemplate(data.link || data.resetLink, data.name || data.adminName)
        : emailTemplate;
    }

    const result = await sendMailViaService({
      to,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text,
    });

    if (result.success) {
      return { success: true, messageId: result.messageId, message: 'Email sent successfully' };
    }
    return { success: false, error: result.error, message: 'Failed to send email' };
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    return { success: false, error: error.message, message: 'Failed to send email' };
  }
};

// Specific email functions
const sendPasswordResetEmail = async (email, adminName, resetLink) => {
  return await sendEmail(email, 'passwordReset', {
    resetLink,
    adminName
  });
};

const sendWelcomeEmail = async (email, adminName, loginUrl) => {
  return await sendEmail(email, 'welcomeAdmin', {
    link: loginUrl,
    name: adminName
  });
};

const sendOrderConfirmationEmail = async (email, orderData) => {
  return await sendEmail(email, 'orderConfirmation', orderData);
};

const sendOrderShippedEmail = async (email, orderData) => {
  return await sendEmail(email, 'orderShipped', orderData);
};

module.exports = {
  sendEmail,
  sendPasswordResetEmail,
  sendWelcomeEmail,
  sendOrderConfirmationEmail,
  sendOrderShippedEmail,
  sendOTP,
  emailTemplates
}; 