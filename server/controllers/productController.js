const db = require('../config/db');
const { upload } = require('../middleware/multer');

// Create Product
const createProduct = async (req, res) => {
  try {
    const {
      name,
      category_id,
      subcategory_id,
      description,
      fitting_info,
      fabric_info,
      care_info,
      product_detail,
      shipping_info,
      return_policy,
      colors,
      sizes
    } = req.body;

    // Validate required fields
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Product name is required'
      });
    }

    // Parse JSON arrays
    let colorsArray = [];
    let sizesArray = [];

    try {
      if (colors) colorsArray = JSON.parse(colors);
      if (sizes) sizesArray = JSON.parse(sizes);
    } catch (parseError) {
      return res.status(400).json({
        success: false,
        message: 'Invalid JSON format for colors or sizes'
      });
    }

    // Start transaction
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      // Insert product
      const [productResult] = await connection.execute(
        `INSERT INTO products (name, category_id, subcategory_id, description, 
         fitting_info, fabric_info, care_info, product_detail, shipping_info, return_policy) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [name, category_id || null, subcategory_id || null, description || null,
         fitting_info || null, fabric_info || null, care_info || null, 
         product_detail || null, shipping_info || null, return_policy || null]
      );

      const productId = productResult.insertId;

      // Insert colors
      for (const color of colorsArray) {
        const [colorResult] = await connection.execute(
          'INSERT INTO product_colors (product_id, color_name, color_code) VALUES (?, ?, ?)',
          [productId, color.name, color.code || null]
        );

        const colorId = colorResult.insertId;

        // Handle images for this color
        if (req.files && color.images) {
          const colorImages = Array.isArray(color.images) ? color.images : [color.images];
          console.log(`Processing color ${color.name} with images:`, colorImages);
          console.log('Available files:', req.files.map(f => f.filename));
          
          for (let i = 0; i < colorImages.length; i++) {
            const imageIndex = parseInt(colorImages[i]);
            console.log(`Looking for image at index ${imageIndex}`);
            if (req.files[imageIndex]) {
              const imageUrl = `/products/${req.files[imageIndex].filename}`;
              console.log(`Inserting image: ${imageUrl}`);
              await connection.execute(
                'INSERT INTO product_images (color_id, image_url, is_default) VALUES (?, ?, ?)',
                [colorId, imageUrl, i === 0] // First image is default
              );
            } else {
              console.log(`No file found at index ${imageIndex}`);
            }
          }
        } else {
          console.log(`No images for color ${color.name}`);
        }
      }

      // Insert sizes with prices
      for (const size of sizesArray) {
        await connection.execute(
          `INSERT INTO product_sizes (product_id, size, actual_price, sell_price, offer_percent, stock) 
           VALUES (?, ?, ?, ?, ?, ?)`,
          [productId, size.size, size.actual_price, size.sell_price, 
           size.offer_percent || 0, size.stock || 0]
        );
      }

      await connection.commit();
      connection.release();

      res.status(201).json({
        success: true,
        message: 'Product created successfully',
        data: { product_id: productId }
      });

    } catch (error) {
      await connection.rollback();
      connection.release();
      throw error;
    }
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating product',
      error: error.message
    });
  }
};

// Get All Products with filters
const getAllProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category_id,
      subcategory_id,
      status,
      search,
      min_price,
      max_price
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;
    let whereConditions = [];
    let params = [];

    if (category_id) {
      whereConditions.push('p.category_id = ?');
      params.push(category_id);
    }

    if (subcategory_id) {
      whereConditions.push('p.subcategory_id = ?');
      params.push(subcategory_id);
    }

    if (status) {
      whereConditions.push('p.status = ?');
      params.push(status);
    }

    if (search) {
      whereConditions.push('(p.name LIKE ? OR p.description LIKE ? OR c.name LIKE ? OR sc.name LIKE ?)');
      params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (min_price) {
      whereConditions.push('ps.sell_price >= ?');
      params.push(min_price);
    }

    if (max_price) {
      whereConditions.push('ps.sell_price <= ?');
      params.push(max_price);
    }

    const whereClause = whereConditions.length > 0 ? 'WHERE ' + whereConditions.join(' AND ') : '';

    // Get total count
    const [countResult] = await db.execute(
      `SELECT COUNT(DISTINCT p.product_id) as total 
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id
       LEFT JOIN subcategories sc ON p.subcategory_id = sc.id
       LEFT JOIN product_sizes ps ON p.product_id = ps.product_id 
       ${whereClause}`,
      params
    );

    const total = countResult[0].total;

    // Get products with pagination
    const [products] = await db.execute(
      `SELECT DISTINCT 
         p.product_id,
         p.name,
         p.description,
         p.fitting_info,
         p.fabric_info,
         p.care_info,
         p.product_detail,
         p.shipping_info,
         p.return_policy,
         p.status,
         p.created_at,
         p.updated_at,
         c.name as category_name,
         sc.name as subcategory_name,
         MIN(ps.sell_price) as min_price,
         MAX(ps.sell_price) as max_price,
         MIN(ps.actual_price) as min_actual_price,
         MAX(ps.actual_price) as max_actual_price
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       LEFT JOIN subcategories sc ON p.subcategory_id = sc.id
       LEFT JOIN product_sizes ps ON p.product_id = ps.product_id
       ${whereClause}
       GROUP BY p.product_id
       ORDER BY p.created_at DESC
       LIMIT ${limitNum} OFFSET ${offset}`,
      params
    );

    // Get colors and images for each product
    for (let product of products) {
      const [colors] = await db.execute(
        `SELECT 
           pc.color_id,
           pc.color_name,
           pc.color_code,
           GROUP_CONCAT(pi.image_url) as images
         FROM product_colors pc
         LEFT JOIN product_images pi ON pc.color_id = pi.color_id
         WHERE pc.product_id = ?
         GROUP BY pc.color_id`,
        [product.product_id]
      );

      product.colors = colors.map(color => ({
        ...color,
        images: color.images ? color.images.split(',') : []
      }));

      // Get sizes
      const [sizes] = await db.execute(
        'SELECT * FROM product_sizes WHERE product_id = ?',
        [product.product_id]
      );
      product.sizes = sizes;
    }

    res.json({
      success: true,
      data: products,
      pagination: {
        current_page: pageNum,
        total_pages: Math.ceil(total / limitNum),
        total_items: total,
        items_per_page: limitNum
      }
    });

  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message
    });
  }
};

// Get Single Product
const getProductById = async (req, res) => {
  try {
    const { product_id } = req.params;

    const [products] = await db.execute(
      `SELECT 
         p.*,
         c.name as category_name,
         sc.name as subcategory_name
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       LEFT JOIN subcategories sc ON p.subcategory_id = sc.id
       WHERE p.product_id = ?`,
      [product_id]
    );

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const product = products[0];

    // Get colors with images
    const [colors] = await db.execute(
      `SELECT 
         pc.color_id,
         pc.color_name,
         pc.color_code,
         GROUP_CONCAT(pi.image_url) as images
       FROM product_colors pc
       LEFT JOIN product_images pi ON pc.color_id = pi.color_id
       WHERE pc.product_id = ?
       GROUP BY pc.color_id`,
      [product_id]
    );

    product.colors = colors.map(color => ({
      ...color,
      images: color.images ? color.images.split(',') : []
    }));

    // Get sizes
    const [sizes] = await db.execute(
      'SELECT * FROM product_sizes WHERE product_id = ?',
      [product_id]
    );
    product.sizes = sizes;

    res.json({
      success: true,
      data: product
    });

  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: error.message
    });
  }
};

// Update Product
const updateProduct = async (req, res) => {
  try {
    const { product_id } = req.params;
    const {
      name,
      category_id,
      subcategory_id,
      description,
      fitting_info,
      fabric_info,
      care_info,
      product_detail,
      shipping_info,
      return_policy,
      status,
      colors,
      sizes
    } = req.body;

    // Check if product exists
    const [existingProduct] = await db.execute(
      'SELECT * FROM products WHERE product_id = ?',
      [product_id]
    );

    if (existingProduct.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Parse JSON arrays
    let colorsArray = [];
    let sizesArray = [];

    try {
      if (colors) colorsArray = JSON.parse(colors);
      if (sizes) sizesArray = JSON.parse(sizes);
    } catch (parseError) {
      return res.status(400).json({
        success: false,
        message: 'Invalid JSON format for colors or sizes'
      });
    }

    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      // Update product
      await connection.execute(
        `UPDATE products SET 
         name = ?, category_id = ?, subcategory_id = ?, description = ?,
         fitting_info = ?, fabric_info = ?, care_info = ?, product_detail = ?,
         shipping_info = ?, return_policy = ?, status = ?, updated_at = CURRENT_TIMESTAMP
         WHERE product_id = ?`,
        [name, category_id || null, subcategory_id || null, description || null,
         fitting_info || null, fabric_info || null, care_info || null,
         product_detail || null, shipping_info || null, return_policy || null,
         status || 'active', product_id]
      );

      // Delete existing colors and sizes (this will cascade delete images)
      await connection.execute('DELETE FROM product_colors WHERE product_id = ?', [product_id]);
      await connection.execute('DELETE FROM product_sizes WHERE product_id = ?', [product_id]);

      // Handle colors and images
      for (const color of colorsArray) {
        const [colorResult] = await connection.execute(
          'INSERT INTO product_colors (product_id, color_name, color_code) VALUES (?, ?, ?)',
          [product_id, color.name, color.code || null]
        );

        const colorId = colorResult.insertId;

        // Handle new uploaded images for this color
        if (req.files && color.images) {
          const colorImages = Array.isArray(color.images) ? color.images : [color.images];
          
          for (let i = 0; i < colorImages.length; i++) {
            const imageIndex = parseInt(colorImages[i]);
            if (req.files[imageIndex]) {
              const imageUrl = `/products/${req.files[imageIndex].filename}`;
              await connection.execute(
                'INSERT INTO product_images (color_id, image_url, is_default) VALUES (?, ?, ?)',
                [colorId, imageUrl, i === 0]
              );
            }
          }
        }

        // Handle existing images for this color (if any)
        if (color.existingImages && Array.isArray(color.existingImages)) {
          for (let i = 0; i < color.existingImages.length; i++) {
            const existingImageUrl = color.existingImages[i];
            await connection.execute(
              'INSERT INTO product_images (color_id, image_url, is_default) VALUES (?, ?, ?)',
              [colorId, existingImageUrl, i === 0 && (!color.images || color.images.length === 0)]
            );
          }
        }
      }

      // Insert new sizes
      for (const size of sizesArray) {
        await connection.execute(
          `INSERT INTO product_sizes (product_id, size, actual_price, sell_price, offer_percent, stock) 
           VALUES (?, ?, ?, ?, ?, ?)`,
          [product_id, size.size, size.actual_price, size.sell_price,
           size.offer_percent || 0, size.stock || 0]
        );
      }

      await connection.commit();
      connection.release();

      res.json({
        success: true,
        message: 'Product updated successfully'
      });

    } catch (error) {
      await connection.rollback();
      connection.release();
      throw error;
    }
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating product',
      error: error.message
    });
  }
};

// Delete Product
const deleteProduct = async (req, res) => {
  try {
    const { product_id } = req.params;

    // Check if product exists
    const [existingProduct] = await db.execute(
      'SELECT * FROM products WHERE product_id = ?',
      [product_id]
    );

    if (existingProduct.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Delete product (cascade will handle related tables)
    await db.execute('DELETE FROM products WHERE product_id = ?', [product_id]);

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });

  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting product',
      error: error.message
    });
  }
};

// Get Products by Category
const getProductsByCategory = async (req, res) => {
  try {
    const { category_id } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;

    const [products] = await db.execute(
      `SELECT 
         p.product_id,
         p.name,
         p.description,
         p.status,
         p.created_at,
         c.name as category_name,
         sc.name as subcategory_name,
         MIN(ps.sell_price) as min_price,
         MAX(ps.sell_price) as max_price
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       LEFT JOIN subcategories sc ON p.subcategory_id = sc.id
       LEFT JOIN product_sizes ps ON p.product_id = ps.product_id
       WHERE p.category_id = ? AND p.status = 'active'
       GROUP BY p.product_id
       ORDER BY p.created_at DESC
       LIMIT ${limitNum} OFFSET ${offset}`,
      [category_id]
    );

    res.json({
      success: true,
      data: products
    });

  } catch (error) {
    console.error('Get products by category error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products by category',
      error: error.message
    });
  }
};

// Get Products by Subcategory
const getProductsBySubcategory = async (req, res) => {
  try {
    const { subcategory_id } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;

    const [products] = await db.execute(
      `SELECT 
         p.product_id,
         p.name,
         p.description,
         p.status,
         p.created_at,
         c.name as category_name,
         sc.name as subcategory_name,
         MIN(ps.sell_price) as min_price,
         MAX(ps.sell_price) as max_price
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       LEFT JOIN subcategories sc ON p.subcategory_id = sc.id
       LEFT JOIN product_sizes ps ON p.product_id = ps.product_id
       WHERE p.subcategory_id = ? AND p.status = 'active'
       GROUP BY p.product_id
       ORDER BY p.created_at DESC
       LIMIT ${limitNum} OFFSET ${offset}`,
      [subcategory_id]
    );

    res.json({
      success: true,
      data: products
    });

  } catch (error) {
    console.error('Get products by subcategory error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products by subcategory',
      error: error.message
    });
  }
};

// Get Bestseller Products
const getBestsellerProducts = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const limitNum = parseInt(limit, 10) || 10;

    console.log('getBestsellerProducts - limit:', limit, 'limitNum:', limitNum);

    // Validate limit parameter
    if (isNaN(limitNum) || limitNum <= 0 || limitNum > 100) {
      return res.status(400).json({
        success: false,
        message: 'Invalid limit parameter'
      });
    }

    // Get products with highest sales/orders (you can modify this logic based on your business requirements)
    // For now, I'll get products that are marked as bestsellers or have high ratings
    const queryParams = [Number(limitNum)];
    console.log('getBestsellerProducts - queryParams:', queryParams);
    console.log('getBestsellerProducts - limitNum type:', typeof limitNum, 'value:', limitNum);
    
    console.log('getBestsellerProducts - About to execute query with params:', queryParams);
    
    // Use string concatenation for LIMIT to avoid parameter binding issues
    const query = `SELECT 
         p.product_id,
         p.name,
         p.description,
         p.fitting_info,
         p.fabric_info,
         p.care_info,
         p.product_detail,
         p.shipping_info,
         p.return_policy,
         p.status,
         p.created_at,
         p.updated_at,
         c.name as category_name,
         sc.name as subcategory_name,
         MIN(ps.sell_price) as min_price,
         MAX(ps.sell_price) as max_price,
         MIN(ps.actual_price) as min_actual_price,
         MAX(ps.actual_price) as max_actual_price,
         AVG(ps.offer_percent) as avg_offer_percent
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       LEFT JOIN subcategories sc ON p.subcategory_id = sc.id
       LEFT JOIN product_sizes ps ON p.product_id = ps.product_id
       WHERE p.status = 'active'
       GROUP BY p.product_id
       ORDER BY p.created_at DESC, avg_offer_percent DESC
       LIMIT ${Number(limitNum)}`;
    
    const [products] = await db.execute(query);
    console.log('getBestsellerProducts - Query executed successfully, products found:', products.length);

    // Get colors and images for each product
    for (let product of products) {
      const [colors] = await db.execute(
        `SELECT 
           pc.color_id,
           pc.color_name,
           pc.color_code,
           GROUP_CONCAT(pi.image_url) as images
         FROM product_colors pc
         LEFT JOIN product_images pi ON pc.color_id = pi.color_id
         WHERE pc.product_id = ?
         GROUP BY pc.color_id`,
        [product.product_id]
      );

      product.colors = colors.map(color => ({
        ...color,
        images: color.images ? color.images.split(',') : []
      }));

      // Get sizes
      const [sizes] = await db.execute(
        'SELECT * FROM product_sizes WHERE product_id = ?',
        [product.product_id]
      );
      product.sizes = sizes;
    }

    res.json({
      success: true,
      data: products,
      message: 'Bestseller products retrieved successfully'
    });

  } catch (error) {
    console.error('Get bestseller products error:', error);
    console.error('Error details:', {
      code: error.code,
      errno: error.errno,
      sqlState: error.sqlState,
      sqlMessage: error.sqlMessage
    });
    res.status(500).json({
      success: false,
      message: 'Error fetching bestseller products',
      error: error.message
    });
  }
};

// Get New Arrival Products
const getNewArrivalProducts = async (req, res) => {
  try {
    const { limit = 10, days = 30 } = req.query;
    const limitNum = parseInt(limit, 10) || 10;
    const daysNum = parseInt(days, 10) || 30;

    console.log('getNewArrivalProducts - limit:', limit, 'days:', days, 'limitNum:', limitNum, 'daysNum:', daysNum);

    // Validate parameters
    if (isNaN(limitNum) || limitNum <= 0 || limitNum > 100) {
      return res.status(400).json({
        success: false,
        message: 'Invalid limit parameter'
      });
    }

    if (isNaN(daysNum) || daysNum <= 0 || daysNum > 365) {
      return res.status(400).json({
        success: false,
        message: 'Invalid days parameter'
      });
    }

    // Get products created within the specified number of days
    const queryParams = [Number(daysNum), Number(limitNum)];
    console.log('getNewArrivalProducts - queryParams:', queryParams);
    console.log('getNewArrivalProducts - daysNum type:', typeof daysNum, 'value:', daysNum);
    console.log('getNewArrivalProducts - limitNum type:', typeof limitNum, 'value:', limitNum);
    
    console.log('getNewArrivalProducts - About to execute query with params:', queryParams);
    
    // Use string concatenation for LIMIT to avoid parameter binding issues
    const query = `SELECT 
         p.product_id,
         p.name,
         p.description,
         p.fitting_info,
         p.fabric_info,
         p.care_info,
         p.product_detail,
         p.shipping_info,
         p.return_policy,
         p.status,
         p.created_at,
         p.updated_at,
         c.name as category_name,
         sc.name as subcategory_name,
         MIN(ps.sell_price) as min_price,
         MAX(ps.sell_price) as max_price,
         MIN(ps.actual_price) as min_actual_price,
         MAX(ps.actual_price) as max_actual_price,
         DATEDIFF(CURRENT_DATE, p.created_at) as days_since_created
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       LEFT JOIN subcategories sc ON p.subcategory_id = sc.id
       LEFT JOIN product_sizes ps ON p.product_id = ps.product_id
       WHERE p.status = 'active' 
         AND p.created_at >= DATE_SUB(CURRENT_DATE, INTERVAL ? DAY)
       GROUP BY p.product_id
       ORDER BY p.created_at DESC
       LIMIT ${Number(limitNum)}`;
    
    const [products] = await db.execute(query, [Number(daysNum)]);
    console.log('getNewArrivalProducts - Query executed successfully, products found:', products.length);

    // Get colors and images for each product
    for (let product of products) {
      const [colors] = await db.execute(
        `SELECT 
           pc.color_id,
           pc.color_name,
           pc.color_code,
           GROUP_CONCAT(pi.image_url) as images
         FROM product_colors pc
         LEFT JOIN product_images pi ON pc.color_id = pi.color_id
         WHERE pc.product_id = ?
         GROUP BY pc.color_id`,
        [product.product_id]
      );

      product.colors = colors.map(color => ({
        ...color,
        images: color.images ? color.images.split(',') : []
      }));

      // Get sizes
      const [sizes] = await db.execute(
        'SELECT * FROM product_sizes WHERE product_id = ?',
        [product.product_id]
      );
      product.sizes = sizes;
    }

    res.json({
      success: true,
      data: products,
      message: 'New arrival products retrieved successfully',
      filters: {
        days_considered: daysNum,
        total_products: products.length
      }
    });

  } catch (error) {
    console.error('Get new arrival products error:', error);
    console.error('Error details:', {
      code: error.code,
      errno: error.errno,
      sqlState: error.sqlState,
      sqlMessage: error.sqlMessage
    });
    res.status(500).json({
      success: false,
      message: 'Error fetching new arrival products',
      error: error.message
    });
  }
};

// Get Also Like Products (same category/subcategory)
const getAlsoLikeProducts = async (req, res) => {
  try {
    const { product_id, limit = 8 } = req.query;
    const limitNum = parseInt(limit, 10) || 8;

    console.log('getAlsoLikeProducts - product_id:', product_id, 'limit:', limit, 'limitNum:', limitNum);

    if (!product_id) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }

    // Validate limit parameter
    if (isNaN(limitNum) || limitNum <= 0 || limitNum > 100) {
      return res.status(400).json({
        success: false,
        message: 'Invalid limit parameter'
      });
    }

    // First get the current product's category and subcategory
    const [currentProduct] = await db.execute(
      `SELECT category_id, subcategory_id FROM products WHERE product_id = ?`,
      [product_id]
    );

    if (currentProduct.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const { category_id, subcategory_id } = currentProduct[0];

    // Get products from the same category and subcategory, excluding the current product
    // Use string concatenation for LIMIT to avoid parameter binding issues
    const query = `SELECT 
         p.product_id,
         p.name,
         p.description,
         p.fitting_info,
         p.fabric_info,
         p.care_info,
         p.product_detail,
         p.shipping_info,
         p.return_policy,
         p.status,
         p.created_at,
         p.updated_at,
         c.name as category_name,
         sc.name as subcategory_name,
         MIN(ps.sell_price) as min_price,
         MAX(ps.sell_price) as max_price,
         MIN(ps.actual_price) as min_actual_price,
         MAX(ps.actual_price) as max_actual_price
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       LEFT JOIN subcategories sc ON p.subcategory_id = sc.id
       LEFT JOIN product_sizes ps ON p.product_id = ps.product_id
       WHERE p.status = 'active' 
         AND p.product_id != ?
         AND (
           (p.category_id = ? AND p.subcategory_id = ?) OR
           (p.category_id = ? AND p.subcategory_id IS NULL) OR
           (p.category_id IS NULL AND p.subcategory_id = ?)
         )
       GROUP BY p.product_id
       ORDER BY p.created_at DESC
       LIMIT ${Number(limitNum)}`;
    
    const [products] = await db.execute(query, [product_id, category_id, subcategory_id, category_id, subcategory_id]);
    console.log('getAlsoLikeProducts - Query executed successfully, products found:', products.length);

    // Get colors and images for each product
    for (let product of products) {
      const [colors] = await db.execute(
        `SELECT 
           pc.color_id,
           pc.color_name,
           pc.color_code,
           GROUP_CONCAT(pi.image_url) as images
         FROM product_colors pc
         LEFT JOIN product_images pi ON pc.color_id = pi.color_id
         WHERE pc.product_id = ?
         GROUP BY pc.color_id`,
        [product.product_id]
      );

      product.colors = colors.map(color => ({
        ...color,
        images: color.images ? color.images.split(',') : []
      }));

      // Get sizes
      const [sizes] = await db.execute(
        'SELECT * FROM product_sizes WHERE product_id = ?',
        [product.product_id]
      );
      product.sizes = sizes;
    }

    res.json({
      success: true,
      data: products,
      message: 'Also like products retrieved successfully',
      filters: {
        category_id,
        subcategory_id,
        total_products: products.length
      }
    });

  } catch (error) {
    console.error('Get also like products error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching also like products',
      error: error.message
    });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  getProductsBySubcategory,
  getBestsellerProducts,
  getNewArrivalProducts,
  getAlsoLikeProducts
};
