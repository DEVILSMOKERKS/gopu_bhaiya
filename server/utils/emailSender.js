const nodemailer = require('nodemailer');

// Create transporter configuration
const createTransporter = () => {
  // For development, you can use Gmail or other email services
  // For production, use services like SendGrid, AWS SES, etc.

  return nodemailer.createTransport({
    service: 'gmail', // or 'outlook', 'yahoo', etc.
    auth: {
      user: process.env.EMAIL_USER || 'your-email@gmail.com',
      pass: process.env.EMAIL_PASSWORD || 'your-app-password'
    }
  });
};

// Email templates
const emailTemplates = {
  passwordReset: (resetLink, adminName) => ({
    subject: 'Password Reset Request - Mateshwari Moorti Bhandar Admin',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Mateshwari Moorti Bhandar Admin</h1>
          <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Password Reset Request</p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <h2 style="color: #1f2937; margin: 0 0 20px 0;">Hello ${adminName},</h2>
          
          <p style="color: #6b7280; line-height: 1.6; margin: 0 0 20px 0;">
            We received a request to reset your password for your Mateshwari Moorti Bhandar Admin account. 
            If you didn't make this request, you can safely ignore this email.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" 
               style="background: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 500;">
              Reset Password
            </a>
          </div>
          
          <p style="color: #6b7280; line-height: 1.6; margin: 0 0 20px 0;">
            This link will expire in <strong>1 hour</strong> for security reasons. 
            If you need to reset your password again, please request a new link.
          </p>
          
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="color: #6b7280; margin: 0; font-size: 14px;">
              <strong>Security Tip:</strong> Never share this link with anyone. 
              Our team will never ask for your password or this reset link.
            </p>
          </div>
          
          <p style="color: #6b7280; line-height: 1.6; margin: 0 0 20px 0;">
            If you're having trouble clicking the button, copy and paste this URL into your browser:
          </p>
          
          <p style="color: #3b82f6; word-break: break-all; margin: 0 0 30px 0; font-size: 14px;">
            ${resetLink}
          </p>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          
          <p style="color: #9ca3af; font-size: 12px; margin: 0; text-align: center;">
            This email was sent from Mateshwari Moorti Bhandar Admin Panel. 
            If you have any questions, please contact support.
          </p>
        </div>
      </div>
    `,
    text: `
      Password Reset Request - Mateshwari Moorti Bhandar Admin
      
      Hello ${adminName},
      
      We received a request to reset your password for your Mateshwari Moorti Bhandar Admin account. 
      If you didn't make this request, you can safely ignore this email.
      
      Click the following link to reset your password:
      ${resetLink}
      
      This link will expire in 1 hour for security reasons.
      
      If you're having trouble, copy and paste the URL into your browser.
      
      Best regards,
      Mateshwari Moorti Bhandar Admin Team
    `
  }),

  welcomeAdmin: (adminName, loginUrl) => ({
    subject: 'Welcome to Mateshwari Moorti Bhandar Admin Panel',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Welcome to Mateshwari Moorti Bhandar</h1>
          <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Admin Panel Access</p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <h2 style="color: #1f2937; margin: 0 0 20px 0;">Hello ${adminName},</h2>
          
          <p style="color: #6b7280; line-height: 1.6; margin: 0 0 20px 0;">
            Welcome to the Mateshwari Moorti Bhandar Admin Panel! Your account has been successfully created and you can now access the admin dashboard.
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${loginUrl}" 
               style="background: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 500;">
              Access Admin Panel
            </a>
          </div>
          
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1f2937; margin: 0 0 10px 0;">What you can do:</h3>
            <ul style="color: #6b7280; margin: 0; padding-left: 20px;">
              <li>Manage products and inventory</li>
              <li>View and process orders</li>
              <li>Manage customer accounts</li>
              <li>View analytics and reports</li>
              <li>Update store settings</li>
            </ul>
          </div>
          
          <p style="color: #6b7280; line-height: 1.6; margin: 0 0 20px 0;">
            If you have any questions or need assistance, please don't hesitate to contact our support team.
          </p>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          
          <p style="color: #9ca3af; font-size: 12px; margin: 0; text-align: center;">
            Welcome to Mateshwari Moorti Bhandar Admin Panel
          </p>
        </div>
      </div>
    `,
    text: `
      Welcome to Mateshwari Moorti Bhandar Admin Panel
      
      Hello ${adminName},
      
      Welcome to the Mateshwari Moorti Bhandar Admin Panel! Your account has been successfully created and you can now access the admin dashboard.
      
      Access your admin panel here: ${loginUrl}
      
      What you can do:
      - Manage products and inventory
      - View and process orders
      - Manage customer accounts
      - View analytics and reports
      - Update store settings
      
      If you have any questions or need assistance, please don't hesitate to contact our support team.
      
      Best regards,
      Mateshwari Moorti Bhandar Admin Team
    `
  }),

  orderConfirmation: (orderData) => ({
    subject: `Order Confirmed - ${orderData.order_number}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px;">🎉 Order Confirmed!</h1>
          <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Thank you for your order</p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <h2 style="color: #1f2937; margin: 0 0 20px 0;">Hello ${orderData.customer_name},</h2>
          
          <p style="color: #6b7280; line-height: 1.6; margin: 0 0 20px 0;">
            Great news! Your order has been confirmed and we're preparing it for shipment. 
            We'll notify you once your package is on its way.
          </p>
          
          <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6;">
            <h3 style="color: #1f2937; margin: 0 0 10px 0;">Order Details</h3>
            <p style="color: #6b7280; margin: 5px 0;"><strong>Order Number:</strong> ${orderData.order_number}</p>
            <p style="color: #6b7280; margin: 5px 0;"><strong>Order Date:</strong> ${new Date(orderData.created_at).toLocaleDateString()}</p>
            <p style="color: #6b7280; margin: 5px 0;"><strong>Payment Method:</strong> ${orderData.payment_method}</p>
            <p style="color: #6b7280; margin: 5px 0;"><strong>Total Amount:</strong> ₹${orderData.final_amount}</p>
            ${orderData.tracking_number ? `<p style="color: #6b7280; margin: 5px 0;"><strong>Tracking Number:</strong> ${orderData.tracking_number}</p>` : ''}
          </div>
          
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1f2937; margin: 0 0 15px 0;">Order Items</h3>
            ${orderData.items.map(item => `
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #e5e7eb;">
                <div>
                  <p style="color: #1f2937; margin: 0; font-weight: 500;">${item.product_name}</p>
                  <p style="color: #6b7280; margin: 5px 0; font-size: 14px;">Qty: ${item.quantity} | ${item.size} | ${item.color}</p>
                </div>
                <p style="color: #1f2937; margin: 0; font-weight: 500;">₹${item.total_price}</p>
              </div>
            `).join('')}
          </div>
          
          <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1f2937; margin: 0 0 15px 0;">Shipping Address</h3>
            <p style="color: #6b7280; margin: 5px 0;">${orderData.shipping_address.firstName} ${orderData.shipping_address.lastName}</p>
            <p style="color: #6b7280; margin: 5px 0;">${orderData.shipping_address.address}</p>
            <p style="color: #6b7280; margin: 5px 0;">${orderData.shipping_address.city}, ${orderData.shipping_address.state || 'Rajasthan'} ${orderData.shipping_address.postalCode}</p>
            <p style="color: #6b7280; margin: 5px 0;">Phone: ${orderData.shipping_address.phone}</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}/track-order/${orderData.order_number}" 
               style="background: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 500;">
              Track Your Order
            </a>
          </div>
          
          <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="color: #92400e; margin: 0; font-size: 14px;">
              <strong>📞 Need Help?</strong> If you have any questions about your order, 
              please contact our customer support team at Mateshvariexporter@gmail.com or call us at +91-XXXXXXXXXX
            </p>
          </div>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          
          <p style="color: #9ca3af; font-size: 12px; margin: 0; text-align: center;">
            Thank you for choosing Mateshwari Moorti Bhandar! We appreciate your business.
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
      
      Thank you for choosing Mateshwari Moorti Bhandar!
    `
  }),

  orderShipped: (orderData) => ({
    subject: `Your Order is Shipped - ${orderData.order_number}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px;">🚚 Order Shipped!</h1>
          <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Your package is on its way</p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <h2 style="color: #1f2937; margin: 0 0 20px 0;">Hello ${orderData.customer_name},</h2>
          
          <p style="color: #6b7280; line-height: 1.6; margin: 0 0 20px 0;">
            Exciting news! Your order has been shipped and is now on its way to you. 
            You can track your package using the tracking information below.
          </p>
          
          <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f59e0b;">
            <h3 style="color: #1f2937; margin: 0 0 10px 0;">Tracking Information</h3>
            <p style="color: #6b7280; margin: 5px 0;"><strong>Order Number:</strong> ${orderData.order_number}</p>
            <p style="color: #6b7280; margin: 5px 0;"><strong>Tracking Number:</strong> ${orderData.tracking_number}</p>
            <p style="color: #6b7280; margin: 5px 0;"><strong>Courier:</strong> ${orderData.courier_name || 'Standard Delivery'}</p>
            <p style="color: #6b7280; margin: 5px 0;"><strong>Estimated Delivery:</strong> 3-5 business days</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}/track-order/${orderData.order_number}" 
               style="background: #f59e0b; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 500;">
              Track Your Package
            </a>
          </div>
          
          <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="color: #0369a1; margin: 0; font-size: 14px;">
              <strong>💡 Pro Tip:</strong> You can also track your package directly on the courier's website using the tracking number above.
            </p>
          </div>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          
          <p style="color: #9ca3af; font-size: 12px; margin: 0; text-align: center;">
            Thank you for choosing Mateshwari Moorti Bhandar! We hope you love your purchase.
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
      
      Thank you for choosing Mateshwari Moorti Bhandar!
    `
  }),

  contactConfirmation: (contactData) => ({
    subject: 'Thank you for contacting Mateshwari Moorti Bhandar - We\'ll get back to you soon!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px;">📧 Message Received!</h1>
          <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Thank you for contacting Mateshwari Moorti Bhandar</p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <h2 style="color: #1f2937; margin: 0 0 20px 0;">Hello ${contactData.name},</h2>
          
          <p style="color: #6b7280; line-height: 1.6; margin: 0 0 20px 0;">
            Thank you for reaching out to us! We have received your message and our team will get back to you as soon as possible.
          </p>
          
          <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6;">
            <h3 style="color: #1f2937; margin: 0 0 10px 0;">Your Message Details</h3>
            <p style="color: #6b7280; margin: 5px 0;"><strong>Subject:</strong> ${contactData.subject}</p>
            <p style="color: #6b7280; margin: 5px 0;"><strong>Message:</strong></p>
            <div style="background: #f8fafc; padding: 15px; border-radius: 6px; margin: 10px 0;">
              <p style="color: #6b7280; margin: 0; line-height: 1.6;">${contactData.message}</p>
            </div>
          </div>
          
          <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="color: #92400e; margin: 0; font-size: 14px;">
              <strong>⏰ Response Time:</strong> We typically respond to all inquiries within 24-48 hours during business days.
            </p>
          </div>
          
          <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="color: #0369a1; margin: 0; font-size: 14px;">
              <strong>📞 Need Immediate Help?</strong> For urgent matters, you can call us at +91 77919 83156 or email us at Mateshvariexporter@gmail.com
            </p>
          </div>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          
          <p style="color: #9ca3af; font-size: 12px; margin: 0; text-align: center;">
            Thank you for choosing Mateshwari Moorti Bhandar! We appreciate your patience.
          </p>
        </div>
      </div>
    `,
    text: `
      Thank you for contacting Mateshwari Moorti Bhandar - We'll get back to you soon!
      
      Hello ${contactData.name},
      
      Thank you for reaching out to us! We have received your message and our team will get back to you as soon as possible.
      
      Your Message Details:
      - Subject: ${contactData.subject}
      - Message: ${contactData.message}
      
      Response Time: We typically respond to all inquiries within 24-48 hours during business days.
      
      Need Immediate Help? For urgent matters, you can call us at +91 77919 83156 or email us at Mateshvariexporter@gmail.com
      
      Thank you for choosing Mateshwari Moorti Bhandar! We appreciate your patience.
    `
  }),

  contactNotification: (contactData) => ({
    subject: `New Contact Query from ${contactData.name} - Query #${contactData.queryId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px;">🆕 New Contact Query</h1>
          <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Action Required</p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <h2 style="color: #1f2937; margin: 0 0 20px 0;">New Contact Query Received</h2>
          
          <div style="background: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444;">
            <h3 style="color: #1f2937; margin: 0 0 10px 0;">Query Information</h3>
            <p style="color: #6b7280; margin: 5px 0;"><strong>Query ID:</strong> #${contactData.queryId}</p>
            <p style="color: #6b7280; margin: 5px 0;"><strong>Name:</strong> ${contactData.name}</p>
            <p style="color: #6b7280; margin: 5px 0;"><strong>Email:</strong> ${contactData.email}</p>
            <p style="color: #6b7280; margin: 5px 0;"><strong>Phone:</strong> ${contactData.phone}</p>
            <p style="color: #6b7280; margin: 5px 0;"><strong>Subject:</strong> ${contactData.subject}</p>
            <p style="color: #6b7280; margin: 5px 0;"><strong>Message:</strong></p>
            <div style="background: #f8fafc; padding: 15px; border-radius: 6px; margin: 10px 0;">
              <p style="color: #6b7280; margin: 0; line-height: 1.6;">${contactData.message}</p>
            </div>
          </div>
          
          <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="color: #0369a1; margin: 0; font-size: 14px;">
              <strong>📋 Action Required:</strong> Please review this query and respond to the customer within 24-48 hours.
            </p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.ADMIN_PANEL_URL}/contact-queries/${contactData.queryId}" 
               style="background: #ef4444; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 500;">
              View Query Details
            </a>
          </div>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          
          <p style="color: #9ca3af; font-size: 12px; margin: 0; text-align: center;">
            This is an automated notification from the Mateshwari Moorti Bhandar Admin Panel.
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
      
      This is an automated notification from the Mateshwari Moorti Bhandar Admin Panel.
    `
  }),

  contactStatusUpdate: (contactData) => ({
    subject: `Your Contact Query Status Updated - ${contactData.subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px;">📊 Status Update</h1>
          <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Your query has been updated</p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <h2 style="color: #1f2937; margin: 0 0 20px 0;">Hello ${contactData.name},</h2>
          
          <p style="color: #6b7280; line-height: 1.6; margin: 0 0 20px 0;">
            We wanted to let you know that the status of your contact query has been updated.
          </p>
          
          <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6;">
            <h3 style="color: #1f2937; margin: 0 0 10px 0;">Status Update</h3>
            <p style="color: #6b7280; margin: 5px 0;"><strong>Subject:</strong> ${contactData.subject}</p>
            <p style="color: #6b7280; margin: 5px 0;"><strong>Previous Status:</strong> <span style="text-transform: capitalize;">${contactData.oldStatus}</span></p>
            <p style="color: #6b7280; margin: 5px 0;"><strong>New Status:</strong> <span style="text-transform: capitalize;">${contactData.newStatus}</span></p>
            ${contactData.adminNotes ? `<p style="color: #6b7280; margin: 5px 0;"><strong>Admin Notes:</strong> ${contactData.adminNotes}</p>` : ''}
          </div>
          
          <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="color: #92400e; margin: 0; font-size: 14px;">
              <strong>📝 What This Means:</strong> 
              ${contactData.newStatus === 'in_progress' ? 'We are actively working on your query and will provide updates soon.' :
        contactData.newStatus === 'resolved' ? 'Your query has been resolved. If you need further assistance, please let us know.' :
          contactData.newStatus === 'closed' ? 'Your query has been closed. Thank you for contacting us.' : 'Your query is being reviewed by our team.'}
            </p>
          </div>
          
          <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="color: #0369a1; margin: 0; font-size: 14px;">
              <strong>📞 Need More Help?</strong> If you have any questions about this update, please contact us at Mateshvariexporter@gmail.com or call us at +91 77919 83156
            </p>
          </div>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          
          <p style="color: #9ca3af; font-size: 12px; margin: 0; text-align: center;">
            Thank you for choosing Mateshwari Moorti Bhandar! We appreciate your patience.
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
      
      Need More Help? If you have any questions about this update, please contact us at Mateshvariexporter@gmail.com or call us at +91 77919 83156
      
      Thank you for choosing Mateshwari Moorti Bhandar! We appreciate your patience.
    `
  }),

  newsletterWelcome: (data) => ({
    subject: 'Welcome to Mateshwari Moorti Bhandar Newsletter! 🎉',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #8B0000 0%, #A52A2A 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Welcome to Mateshwari Moorti Bhandar!</h1>
          <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">You're now part of our exclusive club</p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <h2 style="color: #1f2937; margin: 0 0 20px 0;">Thank you for subscribing! 🎉</h2>
          
          <p style="color: #6b7280; line-height: 1.6; margin: 0 0 20px 0;">
            Welcome to the Mateshwari Moorti Bhandar family! We're thrilled to have you join our exclusive newsletter community.
          </p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1f2937; margin: 0 0 15px 0;">What you'll get:</h3>
            <ul style="color: #6b7280; line-height: 1.6; margin: 0; padding-left: 20px;">
              <li>🎂 <strong>15% off for your birthday!</strong></li>
              <li>🛍️ Early access to new collections</li>
              <li>💎 Exclusive offers and discounts</li>
              <li>📱 Latest fashion trends and styling tips</li>
              <li>🎁 Special member-only promotions</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}/shop" 
               style="background: #8B0000; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 500;">
              Start Shopping
            </a>
          </div>
          
          <p style="color: #6b7280; line-height: 1.6; margin: 0; font-size: 14px; text-align: center;">
            Follow us on social media for daily inspiration and updates!
          </p>
        </div>
      </div>
    `,
    text: `
      Welcome to Mateshwari Moorti Bhandar Newsletter! 🎉
      
      Thank you for subscribing!
      
      Welcome to the Mateshwari Moorti Bhandar family! We're thrilled to have you join our exclusive newsletter community.
      
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
    subject: 'New Newsletter Subscription - Mateshwari Moorti Bhandar',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #8B0000 0%, #A52A2A 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Mateshwari Moorti Bhandar Admin</h1>
          <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">New Newsletter Subscription</p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <h2 style="color: #1f2937; margin: 0 0 20px 0;">New Newsletter Subscriber</h2>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1f2937; margin: 0 0 15px 0;">Subscriber Details:</h3>
            <p style="color: #6b7280; margin: 5px 0;"><strong>Email:</strong> ${data.email}</p>
            <p style="color: #6b7280; margin: 5px 0;"><strong>Subscriber ID:</strong> #${data.subscriberId}</p>
            <p style="color: #6b7280; margin: 5px 0;"><strong>Subscribed At:</strong> ${new Date().toLocaleString()}</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.ADMIN_PANEL_URL}/admin" 
               style="background: #8B0000; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 500;">
              View in Admin Panel
            </a>
          </div>
          
          <p style="color: #6b7280; line-height: 1.6; margin: 0; font-size: 14px; text-align: center;">
            This is an automated notification from the Mateshwari Moorti Bhandar newsletter subscription.
          </p>
        </div>
      </div>
    `,
    text: `
      New Newsletter Subscription - Mateshwari Moorti Bhandar
      
      New Newsletter Subscriber
      
      Subscriber Details:
      - Email: ${data.email}
      - Subscriber ID: #${data.subscriberId}
      - Subscribed At: ${new Date().toLocaleString()}
      
      View in Admin Panel: ${process.env.ADMIN_PANEL_URL}/admin
      
      This is an automated notification from the Mateshwari Moorti Bhandar newsletter subscription.
    `
  }),

  newsletter: (data) => ({
    subject: data.subject,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #8B0000 0%, #A52A2A 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Mateshwari Moorti Bhandar Newsletter</h1>
          <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">${data.subject}</p>
        </div>
        
        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <div style="color: #1f2937; line-height: 1.6;">
            ${data.content}
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}/shop" 
               style="background: #8B0000; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 500;">
              Shop Now
            </a>
          </div>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
          
          <p style="color: #6b7280; line-height: 1.6; margin: 0; font-size: 14px; text-align: center;">
            Thank you for being part of the Mateshwari Moorti Bhandar family!<br>
            Follow us on social media for daily inspiration and updates.
          </p>
        </div>
      </div>
    `,
    text: `
      ${data.subject}
      
      ${data.content.replace(/<[^>]*>/g, '')}
      
      Shop Now: ${process.env.FRONTEND_URL}/shop
      
      Thank you for being part of the Mateshwari Moorti Bhandar family!
      Follow us on social media for daily inspiration and updates.
    `
  })
};

// Send email function
const sendEmail = async (to, template, data = {}) => {
  try {
    console.log('sendEmail called with:', { to, template, data: JSON.stringify(data, null, 2) });

    const transporter = createTransporter();

    // Get email template
    const emailTemplate = emailTemplates[template];
    if (!emailTemplate) {
      throw new Error(`Email template '${template}' not found`);
    }

    // Generate email content
    let emailContent;
    if (template === 'orderConfirmation' || template === 'orderShipped' ||
      template === 'contactConfirmation' || template === 'contactNotification' ||
      template === 'contactStatusUpdate' || template === 'newsletterWelcome' ||
      template === 'newsletterSubscription' || template === 'newsletter') {
      console.log('Using data-based email template with data:', JSON.stringify(data, null, 2));
      emailContent = emailTemplate(data);
    } else {
      emailContent = typeof emailTemplate === 'function'
        ? emailTemplate(data.link || data.resetLink, data.name || data.adminName)
        : emailTemplate;
    }

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER || 'Mateshvariexporter@gmail.com',
      to: to,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);

    console.log('✅ Email sent successfully:', info.messageId);
    return {
      success: true,
      messageId: info.messageId,
      message: 'Email sent successfully'
    };

  } catch (error) {
    console.error('❌ Email sending failed:', error);
    return {
      success: false,
      error: error.message,
      message: 'Failed to send email'
    };
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
  console.log('Sending order confirmation email with data:', JSON.stringify(orderData, null, 2));
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
  emailTemplates
}; 