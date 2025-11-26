const db = require('../config/db');
const { validationResult } = require('express-validator');

// Get all published blogs for public access
const getAllBlogs = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const offset = (pageNum - 1) * limitNum;

    console.log('getAllBlogs - page:', page, 'limit:', limit, 'pageNum:', pageNum, 'limitNum:', limitNum, 'offset:', offset);

    // Validate parameters
    if (isNaN(pageNum) || pageNum <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid page parameter'
      });
    }

    if (isNaN(limitNum) || limitNum <= 0 || limitNum > 100) {
      return res.status(400).json({
        success: false,
        message: 'Invalid limit parameter'
      });
    }

    let query = `
      SELECT b.*, a.name as author_name, a.photo as author_photo
      FROM blogs b
      LEFT JOIN admins a ON b.author_id = a.id
      WHERE b.status = 'published'
    `;

    const queryParams = [];

    if (search) {
      query += ` AND (b.title LIKE ? OR b.content LIKE ?)`;
      const searchTerm = `%${search}%`;
      queryParams.push(searchTerm, searchTerm);
    }

    // Use string concatenation for LIMIT and OFFSET to avoid parameter binding issues
    query += ` ORDER BY b.created_at DESC LIMIT ${Number(limitNum)} OFFSET ${Number(offset)}`;

    console.log('getAllBlogs - query:', query);
    console.log('getAllBlogs - queryParams:', queryParams);
    console.log('getAllBlogs - limitNum type:', typeof limitNum, 'value:', limitNum);
    console.log('getAllBlogs - offset type:', typeof offset, 'value:', offset);

    console.log('getAllBlogs - About to execute query with params:', queryParams);
    const [blogs] = await db.execute(query, queryParams);
    console.log('getAllBlogs - Query executed successfully, blogs found:', blogs.length);

    // Get total count for pagination
    let countQuery = `
      SELECT COUNT(*) as total
      FROM blogs b
      WHERE b.status = 'published'
    `;

    const countParams = [];
    if (search) {
      countQuery += ` AND (b.title LIKE ? OR b.content LIKE ?)`;
      const searchTerm = `%${search}%`;
      countParams.push(searchTerm, searchTerm);
    }

    const [countResult] = await db.execute(countQuery, countParams);
    const total = countResult[0].total;

    res.json({
      success: true,
      data: blogs,
      pagination: {
        current_page: pageNum,
        total_pages: Math.ceil(total / limitNum),
        total_items: total,
        items_per_page: limitNum
      }
    });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    console.error('Error details:', {
      code: error.code,
      errno: error.errno,
      sqlState: error.sqlState,
      sqlMessage: error.sqlMessage
    });
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: error.message 
    });
  }
};

// Get single blog by slug
const getBlogBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const query = `
      SELECT b.*, a.name as author_name, a.photo as author_photo
      FROM blogs b
      LEFT JOIN admins a ON b.author_id = a.id
      WHERE b.slug = ? AND b.status = 'published'
    `;

    const [blogs] = await db.execute(query, [slug]);

    if (blogs.length === 0) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    const blog = blogs[0];

    // Increment view count
    await db.execute('UPDATE blogs SET view_count = view_count + 1 WHERE blog_id = ?', [blog.blog_id]);

    // Get related blogs (same tags or similar content)
    const relatedQuery = `
      SELECT b.*, a.name as author_name
      FROM blogs b
      LEFT JOIN admins a ON b.author_id = a.id
      WHERE b.status = 'published' 
      AND b.blog_id != ?
      ORDER BY b.created_at DESC
      LIMIT 3
    `;

    const [relatedBlogs] = await db.execute(relatedQuery, [blog.blog_id]);

    res.json({
      success: true,
      data: {
        ...blog,
        related_blogs: relatedBlogs
      }
    });
  } catch (error) {
    console.error('Error fetching blog:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Admin: Get all blogs (including drafts)
const adminGetAllBlogs = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;

    let query = `
      SELECT b.*, a.name as author_name
      FROM blogs b
      LEFT JOIN admins a ON b.author_id = a.id
      WHERE 1=1
    `;

    const queryParams = [];

    if (status) {
      query += ` AND b.status = ?`;
      queryParams.push(status);
    }

    if (search) {
      query += ` AND (b.title LIKE ? OR b.content LIKE ?)`;
      const searchTerm = `%${search}%`;
      queryParams.push(searchTerm, searchTerm);
    }

    query += ` ORDER BY b.created_at DESC LIMIT ${limitNum} OFFSET ${offset}`;

    const [blogs] = await db.execute(query, queryParams);

    // Get total count for pagination
    let countQuery = `
      SELECT COUNT(*) as total
      FROM blogs b
      WHERE 1=1
    `;

    const countParams = [];
    if (status) {
      countQuery += ` AND b.status = ?`;
      countParams.push(status);
    }

    if (search) {
      countQuery += ` AND (b.title LIKE ? OR b.content LIKE ?)`;
      const searchTerm = `%${search}%`;
      countParams.push(searchTerm, searchTerm);
    }

    const [countResult] = await db.execute(countQuery, countParams);
    const total = countResult[0].total;

    res.json({
      success: true,
      data: blogs,
      pagination: {
        current_page: pageNum,
        total_pages: Math.ceil(total / limitNum),
        total_items: total,
        items_per_page: limitNum
      }
    });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    console.error('Error details:', {
      code: error.code,
      errno: error.errno,
      sqlState: error.sqlState,
      sqlMessage: error.sqlMessage
    });
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: error.message 
    });
  }
};

// Admin: Get single blog by ID
const adminGetBlogById = async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT b.*, a.name as author_name
      FROM blogs b
      LEFT JOIN admins a ON b.author_id = a.id
      WHERE b.blog_id = ?
    `;

    const [blogs] = await db.execute(query, [id]);

    if (blogs.length === 0) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    res.json({
      success: true,
      data: blogs[0]
    });
  } catch (error) {
    console.error('Error fetching blog:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Admin: Create new blog
const createBlog = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const {
      title,
      content,
      status = 'draft',
      meta_title,
      meta_description,
      tags
    } = req.body;

    const author_id = req.user.id;

    // Generate slug from title
    let slug = title.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');

    // Check if slug exists and make it unique
    let counter = 1;
    let originalSlug = slug;
    while (true) {
      const [existingSlug] = await db.execute('SELECT blog_id FROM blogs WHERE slug = ?', [slug]);
      if (existingSlug.length === 0) break;
      slug = `${originalSlug}-${counter}`;
      counter++;
    }

    // Handle featured image
    let featured_image = null;
    if (req.file) {
      featured_image = `/blogs/${req.file.filename}`;
    }

    // Parse tags if provided
    let parsedTags = null;
    if (tags) {
      try {
        parsedTags = JSON.stringify(Array.isArray(tags) ? tags : tags.split(',').map(tag => tag.trim()));
      } catch (error) {
        parsedTags = JSON.stringify([]);
      }
    }

    const query = `
      INSERT INTO blogs (title, slug, content, featured_image, author_id, status, meta_title, meta_description, tags)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.execute(query, [
      title,
      slug,
      content,
      featured_image,
      author_id,
      status,
      meta_title || title,
      meta_description,
      parsedTags
    ]);

    res.status(201).json({
      success: true,
      message: 'Blog created successfully',
      data: { blog_id: result.insertId, slug }
    });
  } catch (error) {
    console.error('Error creating blog:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Admin: Update blog
const updateBlog = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { id } = req.params;
    const {
      title,
      content,
      status,
      meta_title,
      meta_description,
      tags
    } = req.body;

    // Check if blog exists
    const [existingBlog] = await db.execute('SELECT blog_id, featured_image FROM blogs WHERE blog_id = ?', [id]);
    if (existingBlog.length === 0) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    // Generate new slug if title changed
    let slug = null;
    if (title) {
      slug = title.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim('-');

      // Check if slug exists and make it unique (excluding current blog)
      let counter = 1;
      let originalSlug = slug;
      while (true) {
        const [existingSlug] = await db.execute('SELECT blog_id FROM blogs WHERE slug = ? AND blog_id != ?', [slug, id]);
        if (existingSlug.length === 0) break;
        slug = `${originalSlug}-${counter}`;
        counter++;
      }
    }

    // Handle featured image
    let featured_image = existingBlog[0].featured_image;
    if (req.file) {
      featured_image = `/blogs/${req.file.filename}`;
    }

    // Parse tags if provided
    let parsedTags = null;
    if (tags) {
      try {
        parsedTags = JSON.stringify(Array.isArray(tags) ? tags : tags.split(',').map(tag => tag.trim()));
      } catch (error) {
        parsedTags = JSON.stringify([]);
      }
    }

    // Build update query
    const updateFields = [];
    const updateValues = [];

    if (title) {
      updateFields.push('title = ?');
      updateValues.push(title);
    }
    if (slug) {
      updateFields.push('slug = ?');
      updateValues.push(slug);
    }
    if (content) {
      updateFields.push('content = ?');
      updateValues.push(content);
    }
    if (featured_image !== existingBlog[0].featured_image) {
      updateFields.push('featured_image = ?');
      updateValues.push(featured_image);
    }
    if (status) {
      updateFields.push('status = ?');
      updateValues.push(status);
    }
    if (meta_title) {
      updateFields.push('meta_title = ?');
      updateValues.push(meta_title);
    }
    if (meta_description) {
      updateFields.push('meta_description = ?');
      updateValues.push(meta_description);
    }
    if (parsedTags !== null) {
      updateFields.push('tags = ?');
      updateValues.push(parsedTags);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ success: false, message: 'No fields to update' });
    }

    updateValues.push(id);
    const updateQuery = `UPDATE blogs SET ${updateFields.join(', ')} WHERE blog_id = ?`;

    await db.execute(updateQuery, updateValues);

    res.json({
      success: true,
      message: 'Blog updated successfully'
    });
  } catch (error) {
    console.error('Error updating blog:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Admin: Delete blog
const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if blog exists
    const [existingBlog] = await db.execute('SELECT blog_id, featured_image FROM blogs WHERE blog_id = ?', [id]);
    if (existingBlog.length === 0) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    // Delete the blog
    await db.execute('DELETE FROM blogs WHERE blog_id = ?', [id]);

    res.json({
      success: true,
      message: 'Blog deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting blog:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = {
  getAllBlogs,
  getBlogBySlug,
  adminGetAllBlogs,
  adminGetBlogById,
  createBlog,
  updateBlog,
  deleteBlog
};
