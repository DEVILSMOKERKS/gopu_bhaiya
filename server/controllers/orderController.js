const db = require('../config/db');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { sendOrderConfirmationEmail, sendOrderShippedEmail } = require('../utils/emailSender');
const { createShiprocketOrder, trackShiprocketOrder, checkCourierServiceability, testShiprocketConnection } = require('../utils/shiprocket');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: 'rzp_live_RMZ53vN2VEkmXq',
  key_secret: 'HWXdxviuwN7kiH40RyXQjolW'
});

// Helper function to generate order number
const generateOrderNumber = () => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `MMB${timestamp}${random}`;
};

// Helper function to calculate order totals
const calculateOrderTotals = (items, coupon = null) => {
  let subtotal = 0;
  let discount = 0;

  // Calculate subtotal
  items.forEach(item => {
    subtotal += item.total_price;
  });

  // Apply coupon discount
  if (coupon) {
    if (coupon.discount_type === 'percentage') {
      discount = (subtotal * coupon.discount_value) / 100;
      if (coupon.max_discount && discount > coupon.max_discount) {
        discount = coupon.max_discount;
      }
    } else {
      discount = coupon.discount_value;
    }
  }

  const finalAmount = subtotal - discount;

  return {
    subtotal: parseFloat(subtotal.toFixed(2)),
    discount: parseFloat(discount.toFixed(2)),
    shipping: 0,
    codFee: 0,
    finalAmount: parseFloat(finalAmount.toFixed(2))
  };
};

// COD Order Controller - Called from checkout after create order
const createCodOrder = async (req, res) => {
  const connection = await db.getConnection();
  await connection.beginTransaction();

  try {
    const {
      user_id,
      items,
      shipping_address,
      billing_address,
      coupon_code,
      razorpay_order_id,
      order_number,
      amount
    } = req.body;

    // Debug: Log received data
    console.log('Received order data:', {
      user_id,
      items: items,
      shipping_address: shipping_address,
      billing_address: billing_address,
      coupon_code,
      amount
    });

    // Validate required fields (user_id is now optional for guest checkout)
    if (!items || !shipping_address || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Ensure all required fields are properly defined
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid items data'
      });
    }

    // Generate order number if not provided (for COD orders)
    const finalOrderNumber = order_number || generateOrderNumber();
    const finalPaymentId = razorpay_order_id || null;

    // Ensure billing_address is not undefined
    const finalBillingAddress = billing_address || shipping_address;

    // Handle guest checkout - create or find user based on email
    let finalUserId = user_id;
    let user = null;

    if (!user_id) {
      // Guest checkout - check if user exists with shipping email
      const guestEmail = shipping_address.email;
      if (!guestEmail) {
        await connection.rollback();
        return res.status(400).json({
          success: false,
          message: 'Email is required for guest checkout'
        });
      }

      // Check if user already exists
      const [existingUsers] = await connection.execute(
        'SELECT id, name, email FROM user WHERE email = ?',
        [guestEmail]
      );

      if (existingUsers.length > 0) {
        // User exists, use existing user
        user = existingUsers[0];
        finalUserId = user.id;
      } else {
        // Create new user with static password
        const { hashPassword } = require('../utils/bcryptUtil');
        const hashedPassword = await hashPassword('MMB@#$123');

        // Validate and clean data before insertion
        const firstName = shipping_address.firstName?.trim() || '';
        const lastName = shipping_address.lastName?.trim() || '';
        const userName = `${firstName} ${lastName}`.trim();
        const userEmail = shipping_address.email?.trim();
        const userPhone = shipping_address.phone?.trim() || null;
        const userAddress = shipping_address.address?.trim() ? JSON.stringify({
          street: shipping_address.address,
          apartment: shipping_address.apartment || '',
          city: shipping_address.city || '',
          postalCode: shipping_address.postalCode || '',
          country: shipping_address.country || ''
        }) : null;

        // Validate required fields
        if (!userName || userName.length === 0) {
          throw new Error('Name is required and cannot be empty');
        }
        if (!userEmail || userEmail.length === 0) {
          throw new Error('Email is required and cannot be empty');
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userEmail)) {
          throw new Error('Invalid email format');
        }

        // Validate field lengths
        if (userName.length > 100) {
          throw new Error('Name is too long (max 100 characters)');
        }
        if (userEmail.length > 100) {
          throw new Error('Email is too long (max 100 characters)');
        }
        if (userPhone && userPhone.length > 20) {
          throw new Error('Phone number is too long (max 20 characters)');
        }

        const [result] = await connection.execute(
          `INSERT INTO user (name, email, password, phone, address) 
           VALUES (?, ?, ?, ?, ?)`,
          [
            userName,
            userEmail,
            hashedPassword,
            userPhone,
            userAddress
          ]
        );

        finalUserId = result.insertId;
        user = {
          id: finalUserId,
          name: `${shipping_address.firstName} ${shipping_address.lastName}`,
          email: shipping_address.email
        };

        // Send password email to user
        const { sendEmail } = require('../utils/emailSender');
        await sendEmail(
          shipping_address.email,
          'Welcome to Mateshwari Moorti Bhandar - Your Account Details',
          `
            <h2>Welcome to Mateshwari Moorti Bhandar!</h2>
            <p>Your account has been created successfully.</p>
            <p><strong>Your Login Details:</strong></p>
            <p>Email: ${shipping_address.email}</p>
            <p>Password: MMB@#$123</p>
            <p>Please keep this password safe and change it after your first login.</p>
            <p>Thank you for choosing Mateshwari Moorti Bhandar!</p>
          `
        );
      }
    } else {
      // Regular user checkout - get user details
      const [users] = await connection.execute(
        'SELECT id, name, email FROM user WHERE id = ?',
        [user_id]
      );
      user = users[0];
    }

    // Check stock availability and get product details
    const validatedItems = [];
    console.log('Processing items:', items);
    for (const item of items) {
      console.log('Processing item:', item);

      // Validate item has required fields
      if (!item.product_id || !item.quantity) {
        await connection.rollback();
        return res.status(400).json({
          success: false,
          message: `Invalid item data: ${JSON.stringify(item)}`
        });
      }

      // Get product details with size and color information
      const [products] = await connection.execute(
        `SELECT p.*, ps.size_id, ps.size, ps.sell_price, ps.stock, pc.color_id, pc.color_name 
         FROM products p 
         JOIN product_sizes ps ON p.product_id = ps.product_id 
         JOIN product_colors pc ON p.product_id = pc.product_id 
         WHERE p.product_id = ?`,
        [item.product_id]
      );

      if (products.length === 0) {
        await connection.rollback();
        return res.status(400).json({
          success: false,
          message: `Product not found for item ${item.product_id}`
        });
      }

      // Find the specific size and color combination
      let selectedProduct = null;
      if (item.size_id && item.color_id) {
        // If specific size_id and color_id are provided, find exact match
        selectedProduct = products.find(p => p.size_id === item.size_id && p.color_id === item.color_id);
      } else {
        // Otherwise, use the first available option
        selectedProduct = products[0];
      }

      if (!selectedProduct) {
        await connection.rollback();
        return res.status(400).json({
          success: false,
          message: `Size/Color combination not available for product ${products[0].name}`
        });
      }

      if (selectedProduct.stock < item.quantity) {
        await connection.rollback();
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for product ${selectedProduct.name} (${selectedProduct.size}, ${selectedProduct.color_name})`
        });
      }

      validatedItems.push({
        ...item,
        size_id: selectedProduct.size_id,
        color_id: selectedProduct.color_id,
        total_price: selectedProduct.sell_price * item.quantity,
        product_name: selectedProduct.name,
        size: selectedProduct.size,
        color: selectedProduct.color_name
      });
    }

    // Validate and apply coupon if provided
    let coupon = null;
    if (coupon_code) {
      const [coupons] = await connection.execute(
        'SELECT * FROM coupons WHERE code = ? AND status = "active" AND valid_from <= CURDATE() AND valid_to >= CURDATE()',
        [coupon_code]
      );

      if (coupons.length === 0) {
        await connection.rollback();
        return res.status(400).json({
          success: false,
          message: 'Invalid or expired coupon code'
        });
      }

      coupon = coupons[0];

      // Check usage limit
      if (coupon.used_count >= coupon.usage_limit) {
        await connection.rollback();
        return res.status(400).json({
          success: false,
          message: 'Coupon usage limit exceeded'
        });
      }
    }

    // Calculate order totals
    const totals = calculateOrderTotals(validatedItems, coupon);

    // Add COD fee (fixed ₹100)
    totals.codFee = 100;
    totals.finalAmount += totals.codFee;

    // Ensure all totals are properly defined
    if (typeof totals.subtotal === 'undefined' || typeof totals.discount === 'undefined' ||
      typeof totals.shipping === 'undefined' || typeof totals.finalAmount === 'undefined') {
      await connection.rollback();
      return res.status(500).json({
        success: false,
        message: 'Error calculating order totals'
      });
    }

    // Create order in database
    const orderParams = [
      finalOrderNumber,
      finalUserId, // Use finalUserId instead of user_id
      totals.discount || 0,
      0, // shipping_fee
      totals.codFee || 0, // cod_fee
      totals.finalAmount || 0,
      'COD',
      'pending',
      'pending',
      JSON.stringify(shipping_address),
      JSON.stringify(finalBillingAddress),
      coupon ? JSON.stringify(coupon) : null,
      finalPaymentId
    ];

    // Debug: Log parameters to check for undefined values
    console.log('Order parameters:', orderParams);
    console.log('Totals object:', totals);

    const [orderResult] = await connection.execute(
      `INSERT INTO orders (
        order_number, user_id, discount_amount, 
        shipping_fee, cod_fee, final_amount, payment_method, payment_status, 
        order_status, shipping_address, billing_address, applied_coupon, payment_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      orderParams
    );

    const orderId = orderResult.insertId;

    // Create order items
    for (const item of validatedItems) {
      await connection.execute(
        `INSERT INTO order_items (
          order_id, product_id, color_id, size_id, quantity, 
          total_price
        ) VALUES (?, ?, ?, ?, ?, ?)`,
        [
          orderId,
          item.product_id,
          item.color_id,
          item.size_id,
          item.quantity,
          item.total_price
        ]
      );

      // Update stock
      await connection.execute(
        'UPDATE product_sizes SET stock = stock - ? WHERE size_id = ?',
        [item.quantity, item.size_id]
      );
    }

    // Create initial tracking entry
    await connection.execute(
      'INSERT INTO order_tracking (order_id, status, description) VALUES (?, ?, ?)',
      [orderId, 'pending', 'COD order placed successfully']
    );

    // Update coupon usage if applied
    if (coupon) {
      await connection.execute(
        'UPDATE coupons SET used_count = used_count + 1 WHERE coupon_id = ?',
        [coupon.coupon_id]
      );

      await connection.execute(
        'INSERT INTO coupon_usage (coupon_id, user_id, order_id, discount_amount) VALUES (?, ?, ?, ?)',
        [coupon.coupon_id, user_id, orderId, totals.discount]
      );
    }

    // Clear user's cart
    await connection.execute(
      'DELETE FROM cart WHERE user_id = ?',
      [user_id]
    );

    await connection.commit();

    // User details are already available from guest checkout handling

    // Debug: Log shipping address to see if it contains email
    console.log('Shipping address from form:', JSON.stringify(shipping_address, null, 2));

    // Prepare order data for Shiprocket and email
    const orderDataForShiprocket = {
      order_number: finalOrderNumber,
      billing_address: finalBillingAddress,
      shipping_address: shipping_address,
      items: validatedItems,
      payment_method: 'COD',
      subtotal: totals.subtotal,
      discount: totals.discount,
      cod_charges: totals.codFee, // Add COD charges
      final_amount: totals.finalAmount,
      customer_email: shipping_address.email || user.email // Use shipping form email, fallback to user email
    };

    // Create Shiprocket order and send email
    let shiprocketResult = null;
    try {
      shiprocketResult = await createShiprocketOrder(orderDataForShiprocket);

      if (shiprocketResult.success) {
        // Update order with Shiprocket tracking info
        await connection.execute(
          'UPDATE orders SET tracking_number = ?, updated_at = CURRENT_TIMESTAMP WHERE order_id = ?',
          [shiprocketResult.awb_code, orderId]
        );

        // Add tracking entry for Shiprocket
        await connection.execute(
          'INSERT INTO order_tracking (order_id, status, description) VALUES (?, ?, ?)',
          [orderId, 'processing', `Shiprocket order created. AWB: ${shiprocketResult.awb_code}, Courier: ${shiprocketResult.courier_name}`]
        );
      }
    } catch (shiprocketError) {
      console.error('Shiprocket order creation failed:', shiprocketError);
      // Don't fail the main order if Shiprocket fails
    }

    // Send order confirmation email (async)
    try {
      const orderDataForEmail = {
        order_number: finalOrderNumber,
        customer_name: user.name,
        created_at: new Date(),
        payment_method: 'COD',
        final_amount: totals.finalAmount,
        items: validatedItems,
        shipping_address: shipping_address,
        tracking_number: null // Will be updated if Shiprocket succeeds
      };

      // Update tracking number if Shiprocket succeeded
      if (shiprocketResult && shiprocketResult.success) {
        orderDataForEmail.tracking_number = shiprocketResult.awb_code;
      }

      // Use shipping form email for order confirmation, fallback to user email
      const emailToSend = shipping_address.email || user.email;
      await sendOrderConfirmationEmail(emailToSend, orderDataForEmail);
    } catch (emailError) {
      console.error('Order confirmation email failed:', emailError);
      // Don't fail the main order if email fails
    }

    // Generate JWT token for auto-login if user was created
    let token = null;
    if (!user_id && user) {
      const jwt = require('jsonwebtoken');
      token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          type: 'user_login'
        },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '7d' }
      );
    }

    res.json({
      success: true,
      message: 'COD order created successfully',
      data: {
        order_id: orderId,
        order_number: finalOrderNumber,
        total_amount: totals.finalAmount,
        user: user,
        token: token
      }
    });

  } catch (error) {
    await connection.rollback();
    console.error('Create COD order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating COD order',
      error: error.message
    });
  } finally {
    connection.release();
  }
};



// Create Order - Only creates Razorpay order (no database save)
const createOrder = async (req, res) => {
  try {
    const {
      user_id,
      items,
      shipping_address,
      billing_address,
      payment_method,
      coupon_code,
      amount
    } = req.body;


    // Validate required fields (user_id is optional for guest checkout)
    if (!items || !shipping_address || !payment_method || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Ensure billing_address is not undefined (use shipping_address as fallback)
    const finalBillingAddress = billing_address || shipping_address;

    // For online payments, user creation will be handled in verifyPayment
    // Just validate that user_id is provided for logged-in users
    if (user_id) {
      // Verify user exists
      const [users] = await db.execute(
        'SELECT id, name, email FROM user WHERE id = ?',
        [user_id]
      );
      if (users.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'User not found'
        });
      }
    }

    // Generate order number
    const orderNumber = generateOrderNumber();

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(amount * 100), // Convert to paise
      currency: 'INR',
      receipt: orderNumber,
      notes: {
        user_id: user_id ? user_id.toString() : 'guest',
        payment_method: payment_method,
        customer_name: `${shipping_address.firstName || ''} ${shipping_address.lastName || ''}`.trim(),
        customer_email: shipping_address.email || '',
        customer_phone: shipping_address.phone || '',
        order_number: orderNumber
      }
    });

    res.json({
      success: true,
      message: 'Razorpay order created successfully',
      data: {
        key_id: 'rzp_live_RMZ53vN2VEkmXq',
        amount: Math.round(amount * 100),
        currency: 'INR',
        razorpay_order_id: razorpayOrder.id,
        order_number: orderNumber
      }
    });

  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating Razorpay order',
      error: error.message
    });
  }
};

// Verify Payment - Called automatically via webhook for online payments
const verifyPayment = async (req, res) => {
  const connection = await db.getConnection();
  await connection.beginTransaction();

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Verify payment signature
    const text = `${razorpay_order_id}|${razorpay_payment_id}`;
    const generated_signature = crypto
      .createHmac('sha256', 'SKEttAF62ZzauG1Wf9nZRh2a')
      .update(text)
      .digest('hex');

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment signature'
      });
    }

    // Get order details from Razorpay order notes
    const razorpayOrder = await razorpay.orders.fetch(razorpay_order_id);
    const notes = razorpayOrder.notes;

    // Extract data from Razorpay order notes
    let user_id = parseInt(notes.user_id);
    const items = JSON.parse(notes.items);
    const shipping_address = JSON.parse(notes.shipping_address);
    const billing_address = JSON.parse(notes.billing_address);
    const coupon_code = notes.coupon_code || null;
    const order_number = razorpayOrder.receipt;

    // Handle guest checkout - create or find user based on email
    let finalUserId = user_id;
    let user = null;

    if (!user_id || user_id === 0) {
      // Guest checkout - check if user exists with shipping email
      const guestEmail = shipping_address.email;
      if (!guestEmail) {
        await connection.rollback();
        return res.status(400).json({
          success: false,
          message: 'Email is required for guest checkout'
        });
      }

      // Check if user already exists
      const [existingUsers] = await connection.execute(
        'SELECT id, name, email FROM user WHERE email = ?',
        [guestEmail]
      );

      if (existingUsers.length > 0) {
        // User exists, use existing user
        user = existingUsers[0];
        finalUserId = user.id;
      } else {
        // Create new user with static password
        const { hashPassword } = require('../utils/bcryptUtil');
        const hashedPassword = await hashPassword('MMB@#$123');

        // Validate and clean data before insertion
        const firstName = shipping_address.firstName?.trim() || '';
        const lastName = shipping_address.lastName?.trim() || '';
        const userName = `${firstName} ${lastName}`.trim();
        const userEmail = shipping_address.email?.trim();
        const userPhone = shipping_address.phone?.trim() || null;
        const userAddress = shipping_address.address?.trim() ? JSON.stringify({
          street: shipping_address.address,
          apartment: shipping_address.apartment || '',
          city: shipping_address.city || '',
          postalCode: shipping_address.postalCode || '',
          country: shipping_address.country || ''
        }) : null;

        // Validate required fields
        if (!userName || userName.length === 0) {
          throw new Error('Name is required and cannot be empty');
        }
        if (!userEmail || userEmail.length === 0) {
          throw new Error('Email is required and cannot be empty');
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userEmail)) {
          throw new Error('Invalid email format');
        }

        // Validate field lengths
        if (userName.length > 100) {
          throw new Error('Name is too long (max 100 characters)');
        }
        if (userEmail.length > 100) {
          throw new Error('Email is too long (max 100 characters)');
        }
        if (userPhone && userPhone.length > 20) {
          throw new Error('Phone number is too long (max 20 characters)');
        }

        const [result] = await connection.execute(
          `INSERT INTO user (name, email, password, phone, address) 
           VALUES (?, ?, ?, ?, ?)`,
          [
            userName,
            userEmail,
            hashedPassword,
            userPhone,
            userAddress
          ]
        );

        finalUserId = result.insertId;
        user = {
          id: finalUserId,
          name: `${shipping_address.firstName} ${shipping_address.lastName}`,
          email: shipping_address.email
        };

        // Send password email to user
        const { sendEmail } = require('../utils/emailSender');
        await sendEmail(
          shipping_address.email,
          'Welcome to Mateshwari Moorti Bhandar - Your Account Details',
          `
            <h2>Welcome to Mateshwari Moorti Bhandar!</h2>
            <p>Your account has been created successfully.</p>
            <p><strong>Your Login Details:</strong></p>
            <p>Email: ${shipping_address.email}</p>
            <p>Password: MMB@#$123</p>
            <p>Please keep this password safe and change it after your first login.</p>
            <p>Thank you for choosing Mateshwari Moorti Bhandar!</p>
          `
        );
      }
    } else {
      // User is logged in, get user details
      const [users] = await connection.execute(
        'SELECT id, name, email FROM user WHERE id = ?',
        [user_id]
      );
      if (users.length > 0) {
        user = users[0];
        finalUserId = user.id;
      }
    }

    // Check stock availability and get product details
    const validatedItems = [];
    for (const item of items) {
      const [products] = await connection.execute(
        `SELECT p.*, ps.size, ps.sell_price, ps.stock, pc.color_name 
         FROM products p 
         JOIN product_sizes ps ON p.product_id = ps.product_id 
         JOIN product_colors pc ON p.product_id = pc.product_id 
         WHERE p.product_id = ? AND ps.size_id = ? AND pc.color_id = ?`,
        [item.product_id, item.size_id, item.color_id]
      );

      if (products.length === 0) {
        await connection.rollback();
        return res.status(400).json({
          success: false,
          message: `Product not found for item ${item.product_id}`
        });
      }

      const product = products[0];
      if (product.stock < item.quantity) {
        await connection.rollback();
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for product ${product.name}`
        });
      }

      validatedItems.push({
        ...item,
        total_price: product.sell_price * item.quantity,
        product_name: product.name,
        size: product.size,
        color: product.color_name
      });
    }

    // Validate and apply coupon if provided
    let coupon = null;
    if (coupon_code) {
      const [coupons] = await connection.execute(
        'SELECT * FROM coupons WHERE code = ? AND status = "active" AND valid_from <= CURDATE() AND valid_to >= CURDATE()',
        [coupon_code]
      );

      if (coupons.length > 0) {
        coupon = coupons[0];

        // Check usage limit
        if (coupon.used_count >= coupon.usage_limit) {
          await connection.rollback();
          return res.status(400).json({
            success: false,
            message: 'Coupon usage limit exceeded'
          });
        }
      }
    }

    // Calculate order totals
    const totals = calculateOrderTotals(validatedItems, coupon);

    // Create order in database
    const [orderResult] = await connection.execute(
      `INSERT INTO orders (
        order_number, user_id, discount_amount, 
        shipping_fee, cod_fee, final_amount, payment_method, payment_status, 
        order_status, shipping_address, billing_address, applied_coupon, payment_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        order_number,
        finalUserId,
        totals.discount,
        0, // shipping_fee
        0, // cod_fee
        totals.finalAmount,
        'online',
        'paid',
        'processing',
        JSON.stringify(shipping_address),
        JSON.stringify(billing_address),
        coupon ? JSON.stringify(coupon) : null,
        razorpay_payment_id
      ]
    );

    const orderId = orderResult.insertId;

    // Create order items
    for (const item of validatedItems) {
      await connection.execute(
        `INSERT INTO order_items (
          order_id, product_id, color_id, size_id, quantity, 
          total_price
        ) VALUES (?, ?, ?, ?, ?, ?)`,
        [
          orderId,
          item.product_id,
          item.color_id,
          item.size_id,
          item.quantity,
          item.total_price
        ]
      );

      // Update stock
      await connection.execute(
        'UPDATE product_sizes SET stock = stock - ? WHERE size_id = ?',
        [item.quantity, item.size_id]
      );
    }

    // Create tracking entry
    await connection.execute(
      'INSERT INTO order_tracking (order_id, status, description) VALUES (?, ?, ?)',
      [orderId, 'processing', 'Payment verified and order confirmed']
    );

    // Update coupon usage if applied
    if (coupon) {
      await connection.execute(
        'UPDATE coupons SET used_count = used_count + 1 WHERE coupon_id = ?',
        [coupon.coupon_id]
      );

      await connection.execute(
        'INSERT INTO coupon_usage (coupon_id, user_id, order_id, discount_amount) VALUES (?, ?, ?, ?)',
        [coupon.coupon_id, finalUserId, orderId, totals.discount]
      );
    }

    // Clear user's cart
    await connection.execute(
      'DELETE FROM cart WHERE user_id = ?',
      [finalUserId]
    );

    await connection.commit();

    // Get user details for email
    const [users] = await connection.execute(
      'SELECT name, email FROM user WHERE id = ?',
      [finalUserId]
    );

    const userDetails = users[0];

    // Prepare order data for Shiprocket and email
    const orderDataForShiprocket = {
      order_number: order_number,
      billing_address: billing_address,
      shipping_address: shipping_address,
      items: validatedItems,
      payment_method: 'online',
      subtotal: totals.subtotal,
      discount: totals.discount,
      final_amount: totals.finalAmount
    };

    // Create Shiprocket order (async, don't wait for it to fail the main order)
    try {
      const shiprocketResult = await createShiprocketOrder(orderDataForShiprocket);

      if (shiprocketResult.success) {
        // Update order with Shiprocket tracking info
        await connection.execute(
          'UPDATE orders SET tracking_number = ?, updated_at = CURRENT_TIMESTAMP WHERE order_id = ?',
          [shiprocketResult.awb_code, orderId]
        );

        // Add tracking entry for Shiprocket
        await connection.execute(
          'INSERT INTO order_tracking (order_id, status, description) VALUES (?, ?, ?)',
          [orderId, 'processing', `Shiprocket order created. AWB: ${shiprocketResult.awb_code}, Courier: ${shiprocketResult.courier_name}`]
        );
      }
    } catch (shiprocketError) {
      console.error('Shiprocket order creation failed:', shiprocketError);
      // Don't fail the main order if Shiprocket fails
    }

    // Send order confirmation email (async)
    try {
      const orderDataForEmail = {
        order_number: order_number,
        customer_name: userDetails.name,
        created_at: new Date(),
        payment_method: 'Online Payment',
        final_amount: totals.finalAmount,
        items: validatedItems,
        shipping_address: shipping_address,
        tracking_number: null // Will be updated if Shiprocket succeeds
      };

      await sendOrderConfirmationEmail(userDetails.email, orderDataForEmail);
    } catch (emailError) {
      console.error('Order confirmation email failed:', emailError);
      // Don't fail the main order if email fails
    }

    res.json({
      success: true,
      message: 'Payment verified and order created successfully',
      data: {
        order_id: orderId,
        order_number: order_number,
        payment_id: razorpay_payment_id
      }
    });

  } catch (error) {
    await connection.rollback();
    console.error('Verify payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Error verifying payment',
      error: error.message
    });
  } finally {
    connection.release();
  }
};

// Track Order
const trackOrder = async (req, res) => {
  try {
    const { orderNumber } = req.params;

    const [orders] = await db.execute(
      'SELECT * FROM orders WHERE order_number = ?',
      [orderNumber]
    );

    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const order = orders[0];

    // Get tracking history
    const [tracking] = await db.execute(
      'SELECT * FROM order_tracking WHERE order_id = ? ORDER BY created_at ASC',
      [order.order_id]
    );

    // Get Shiprocket tracking data if available
    let shiprocketTracking = null;
    if (order.tracking_number) {
      try {
        const shiprocketResult = await trackShiprocketOrder(order.tracking_number);
        if (shiprocketResult.success) {
          shiprocketTracking = shiprocketResult.tracking_data;
        }
      } catch (shiprocketError) {
        console.error('Shiprocket tracking error:', shiprocketError);
        // Don't fail the main tracking if Shiprocket fails
      }
    }

    res.json({
      success: true,
      data: {
        order: {
          order_number: order.order_number,
          order_status: order.order_status,
          payment_status: order.payment_status,
          final_amount: order.final_amount,
          created_at: order.created_at,
          tracking_number: order.tracking_number
        },
        tracking: tracking,
        shiprocket_tracking: shiprocketTracking
      }
    });

  } catch (error) {
    console.error('Track order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error tracking order',
      error: error.message
    });
  }
};

// Get User Orders
const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10, status } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;

    let query = `
      SELECT o.*, 
             COUNT(oi.order_item_id) as total_items
       FROM orders o
      LEFT JOIN order_items oi ON o.order_id = oi.order_id
       WHERE o.user_id = ?
    `;
    let params = [userId];

    if (status) {
      query += ' AND o.order_status = ?';
      params.push(status);
    }

    query += ` GROUP BY o.order_id ORDER BY o.created_at DESC LIMIT ${limitNum} OFFSET ${offset}`;

    const [orders] = await db.execute(query, params);

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM orders WHERE user_id = ?';
    let countParams = [userId];

    if (status) {
      countQuery += ' AND order_status = ?';
      countParams.push(status);
    }

    const [countResult] = await db.execute(countQuery, countParams);
    const total = countResult[0].total;

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          current_page: pageNum,
          total_pages: Math.ceil(total / limitNum),
          total_items: total,
          items_per_page: limitNum
        }
      }
    });

  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
};

// Get Order by ID
const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.id;

    const [orders] = await db.execute(
      'SELECT * FROM orders WHERE order_id = ? AND user_id = ?',
      [orderId, userId]
    );

    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const order = orders[0];

    // Get order items with product details
    const [orderItems] = await db.execute(
      `SELECT oi.*, p.name as product_name, p.description, 
              pc.color_name, ps.size, ps.sell_price,
              (SELECT pi.image_url FROM product_images pi 
               WHERE pi.color_id = pc.color_id AND pi.is_default = 1 
               LIMIT 1) as product_image
       FROM order_items oi
       JOIN products p ON oi.product_id = p.product_id
       LEFT JOIN product_colors pc ON oi.color_id = pc.color_id
       LEFT JOIN product_sizes ps ON oi.size_id = ps.size_id
       WHERE oi.order_id = ?`,
      [orderId]
    );

    // Get tracking history
    const [tracking] = await db.execute(
      'SELECT * FROM order_tracking WHERE order_id = ? ORDER BY created_at ASC',
      [orderId]
    );

    res.json({
      success: true,
      data: {
        order,
        items: orderItems,
        tracking
      }
    });

  } catch (error) {
    console.error('Get order by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching order',
      error: error.message
    });
  }
};

// Cancel Order
const cancelOrder = async (req, res) => {
  const connection = await db.getConnection();
  await connection.beginTransaction();

  try {
    const { orderId } = req.params;
    const userId = req.user.id;

    const [orders] = await db.execute(
      'SELECT * FROM orders WHERE order_id = ? AND user_id = ?',
      [orderId, userId]
    );

    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const order = orders[0];

    if (order.order_status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Order is already cancelled'
      });
    }

    if (['shipped', 'delivered'].includes(order.order_status)) {
      return res.status(400).json({
        success: false,
        message: 'Order cannot be cancelled as it has been shipped'
      });
    }

    // Update order status
    await connection.execute(
      'UPDATE orders SET order_status = ?, updated_at = CURRENT_TIMESTAMP WHERE order_id = ?',
      ['cancelled', orderId]
    );

    // Add tracking entry
    await connection.execute(
      'INSERT INTO order_tracking (order_id, status, description) VALUES (?, ?, ?)',
      [orderId, 'cancelled', 'Order cancelled by customer']
    );

    // Restore stock
    const [orderItems] = await connection.execute(
      'SELECT * FROM order_items WHERE order_id = ?',
      [orderId]
    );

    for (const item of orderItems) {
      await connection.execute(
        'UPDATE product_sizes SET stock = stock + ? WHERE size_id = ?',
        [item.quantity, item.size_id]
      );
    }

    await connection.commit();

    res.json({
      success: true,
      message: 'Order cancelled successfully'
    });

  } catch (error) {
    await connection.rollback();
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error cancelling order',
      error: error.message
    });
  } finally {
    connection.release();
  }
};

// Return Order
const returnOrder = async (req, res) => {
  const connection = await db.getConnection();
  await connection.beginTransaction();

  try {
    const { orderId } = req.params;
    const { reason } = req.body;
    const userId = req.user.id;

    const [orders] = await db.execute(
      'SELECT * FROM orders WHERE order_id = ? AND user_id = ?',
      [orderId, userId]
    );

    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const order = orders[0];

    if (order.order_status !== 'delivered') {
      return res.status(400).json({
        success: false,
        message: 'Order must be delivered before it can be returned'
      });
    }

    // Check if return is within 7 days
    const deliveryDate = new Date(order.updated_at);
    const currentDate = new Date();
    const daysDiff = (currentDate - deliveryDate) / (1000 * 60 * 60 * 24);

    if (daysDiff > 7) {
      return res.status(400).json({
        success: false,
        message: 'Return period has expired (7 days from delivery)'
      });
    }

    // Update order status
    await connection.execute(
      'UPDATE orders SET order_status = ?, updated_at = CURRENT_TIMESTAMP WHERE order_id = ?',
      ['returned', orderId]
    );

    // Add tracking entry
    await connection.execute(
      'INSERT INTO order_tracking (order_id, status, description) VALUES (?, ?, ?)',
      [orderId, 'returned', `Order returned. Reason: ${reason}`]
    );

    await connection.commit();

    res.json({
      success: true,
      message: 'Return request submitted successfully'
    });

  } catch (error) {
    await connection.rollback();
    console.error('Return order error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing return',
      error: error.message
    });
  } finally {
    connection.release();
  }
};

// Admin: Get All Orders
const getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, payment_status, search } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;

    let query = `
      SELECT o.*, u.name as customer_name, u.email as customer_email,
             COUNT(oi.order_item_id) as total_items
      FROM orders o
      JOIN user u ON o.user_id = u.id
      LEFT JOIN order_items oi ON o.order_id = oi.order_id
    `;
    let params = [];

    const conditions = [];
    if (status) {
      conditions.push('o.order_status = ?');
      params.push(status);
    }
    if (payment_status) {
      conditions.push('o.payment_status = ?');
      params.push(payment_status);
    }
    if (search) {
      conditions.push('(o.order_number LIKE ? OR u.name LIKE ? OR u.email LIKE ?)');
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ` GROUP BY o.order_id ORDER BY o.created_at DESC LIMIT ${limitNum} OFFSET ${offset}`;

    const [orders] = await db.execute(query, params);

    // Get total count
    let countQuery = `
      SELECT COUNT(DISTINCT o.order_id) as total
      FROM orders o
      JOIN user u ON o.user_id = u.id
    `;
    let countParams = [];

    if (conditions.length > 0) {
      countQuery += ' WHERE ' + conditions.join(' AND ');
      countParams = params.slice(0, -2); // Remove limit and offset
    }

    const [countResult] = await db.execute(countQuery, countParams);
    const total = countResult[0].total;

    res.json({
      success: true,
      data: {
        orders,
        pagination: {
          current_page: pageNum,
          total_pages: Math.ceil(total / limitNum),
          total_items: total,
          items_per_page: limitNum
        }
      }
    });

  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
};

// Admin: Get Order Details
const getOrderDetails = async (req, res) => {
  try {
    const { orderId } = req.params;

    const [orders] = await db.execute(
      `SELECT o.*, u.name as customer_name, u.email as customer_email, u.phone as customer_phone
       FROM orders o
       JOIN user u ON o.user_id = u.id
       WHERE o.order_id = ?`,
      [orderId]
    );

    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const order = orders[0];

    // Get order items with product details
    const [orderItems] = await db.execute(
      `SELECT oi.*, p.name as product_name, p.description, 
              pc.color_name, ps.size, ps.sell_price,
              (SELECT pi.image_url FROM product_images pi 
               WHERE pi.color_id = pc.color_id AND pi.is_default = 1 
               LIMIT 1) as product_image
       FROM order_items oi
       JOIN products p ON oi.product_id = p.product_id
       LEFT JOIN product_colors pc ON oi.color_id = pc.color_id
       LEFT JOIN product_sizes ps ON oi.size_id = ps.size_id
       WHERE oi.order_id = ?`,
      [orderId]
    );

    // Get tracking history
    const [tracking] = await db.execute(
      'SELECT * FROM order_tracking WHERE order_id = ? ORDER BY created_at ASC',
      [orderId]
    );

    res.json({
      success: true,
      data: {
        order,
        items: orderItems,
        tracking
      }
    });

  } catch (error) {
    console.error('Get order details error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching order details',
      error: error.message
    });
  }
};

// Admin: Update Order Status
const updateOrderStatus = async (req, res) => {
  const connection = await db.getConnection();
  await connection.beginTransaction();

  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order status'
      });
    }

    // Get order details before updating
    const [orders] = await connection.execute(
      `SELECT o.*, u.name as customer_name, u.email as customer_email
       FROM orders o
       JOIN user u ON o.user_id = u.id
       WHERE o.order_id = ?`,
      [orderId]
    );

    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const order = orders[0];

    // Update order status
    await connection.execute(
      'UPDATE orders SET order_status = ?, updated_at = CURRENT_TIMESTAMP WHERE order_id = ?',
      [status, orderId]
    );

    // Add tracking entry
    const description = `Order status updated to ${status}`;
    await connection.execute(
      'INSERT INTO order_tracking (order_id, status, description) VALUES (?, ?, ?)',
      [orderId, status, description]
    );

    await connection.commit();

    // Send email notifications based on status
    try {
      if (status === 'shipped') {
        // Get order items for email
        const [orderItems] = await connection.execute(
          `SELECT oi.*, p.name as product_name, pc.color_name, ps.size
           FROM order_items oi
           JOIN products p ON oi.product_id = p.product_id
           LEFT JOIN product_colors pc ON oi.color_id = pc.color_id
           LEFT JOIN product_sizes ps ON oi.size_id = ps.size_id
           WHERE oi.order_id = ?`,
          [orderId]
        );

        const orderDataForEmail = {
          order_number: order.order_number,
          customer_name: order.customer_name,
          tracking_number: order.tracking_number,
          courier_name: 'Standard Delivery', // You can update this based on Shiprocket data
          items: orderItems,
          shipping_address: JSON.parse(order.shipping_address)
        };

        await sendOrderShippedEmail(order.customer_email, orderDataForEmail);
      }
    } catch (emailError) {
      console.error('Order status email notification failed:', emailError);
      // Don't fail the status update if email fails
    }

    res.json({
      success: true,
      message: 'Order status updated successfully'
    });

  } catch (error) {
    await connection.rollback();
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating order status',
      error: error.message
    });
  } finally {
    connection.release();
  }
};

// Admin: Update Tracking Info
const updateTrackingInfo = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { tracking_number } = req.body;

    await db.execute(
      'UPDATE orders SET tracking_number = ?, updated_at = CURRENT_TIMESTAMP WHERE order_id = ?',
      [tracking_number, orderId]
    );

    res.json({
      success: true,
      message: 'Tracking information updated successfully'
    });

  } catch (error) {
    console.error('Update tracking info error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating tracking information',
      error: error.message
    });
  }
};

// Admin: Get Order Analytics
const getOrderAnalytics = async (req, res) => {
  try {
    const { period = '30' } = req.query; // days

    // Total orders
    const [totalOrders] = await db.execute(
      'SELECT COUNT(*) as total FROM orders WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)',
      [period]
    );

    // Total revenue
    const [totalRevenue] = await db.execute(
      'SELECT SUM(final_amount) as total FROM orders WHERE payment_status = "paid" AND created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)',
      [period]
    );

    // Orders by status
    const [ordersByStatus] = await db.execute(
      `SELECT order_status, COUNT(*) as count 
       FROM orders 
       WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
       GROUP BY order_status`,
      [period]
    );

    // Daily orders for chart
    const [dailyOrders] = await db.execute(
      `SELECT DATE(created_at) as date, COUNT(*) as count, SUM(final_amount) as revenue
       FROM orders 
       WHERE created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
       GROUP BY DATE(created_at)
       ORDER BY date`,
      [period]
    );

    res.json({
      success: true,
      data: {
        total_orders: totalOrders[0].total,
        total_revenue: totalRevenue[0].total || 0,
        orders_by_status: ordersByStatus,
        daily_orders: dailyOrders
      }
    });

  } catch (error) {
    console.error('Get order analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching analytics',
      error: error.message
    });
  }
};

// Check Courier Serviceability
const checkCourierServiceabilityController = async (req, res) => {
  try {
    const { pickup_pincode, delivery_pincode, weight = 0.5 } = req.query;

    if (!pickup_pincode || !delivery_pincode) {
      return res.status(400).json({
        success: false,
        message: 'Pickup and delivery pincodes are required'
      });
    }

    const result = await checkCourierServiceability(pickup_pincode, delivery_pincode, weight);

    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Check courier serviceability error:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking courier serviceability',
      error: error.message
    });
  }
};

// Test Shiprocket Connection
const testShiprocketConnectionController = async (req, res) => {
  try {
    const isConnected = await testShiprocketConnection();

    res.json({
      success: true,
      connected: isConnected,
      message: isConnected ? 'Shiprocket API is reachable' : 'Shiprocket API is not reachable'
    });

  } catch (error) {
    console.error('Test Shiprocket connection error:', error);
    res.status(500).json({
      success: false,
      connected: false,
      message: 'Error testing Shiprocket connection',
      error: error.message
    });
  }
};

// Admin: Get Recent Orders
const getRecentOrders = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const limitNum = parseInt(limit);

    const [orders] = await db.execute(
      `SELECT o.*, u.name as customer_name, u.email as customer_email
       FROM orders o
       JOIN user u ON o.user_id = u.id
       ORDER BY o.created_at DESC
       LIMIT ? OFFSET ?`,
      [limitNum, offset]
    );

    res.json({
      success: true,
      data: orders
    });

  } catch (error) {
    console.error('Get recent orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching recent orders',
      error: error.message
    });
  }
};



module.exports = {
  createOrder,
  createCodOrder,
  verifyPayment,
  trackOrder,
  getUserOrders,
  getOrderById,
  cancelOrder,
  returnOrder,
  getAllOrders,
  getOrderDetails,
  updateOrderStatus,
  updateTrackingInfo,
  getOrderAnalytics,
  getRecentOrders,
  checkCourierServiceability: checkCourierServiceabilityController,
  testShiprocketConnection: testShiprocketConnectionController
};
