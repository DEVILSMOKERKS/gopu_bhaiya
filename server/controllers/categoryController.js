const db = require('../config/db');

// Function to generate slug from name
const generateSlug = (name) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

// Function to generate unique slug
const generateUniqueSlug = async (name, excludeId = null) => {
  let slug = generateSlug(name);
  let counter = 1;
  let uniqueSlug = slug;

  while (true) {
    const query = excludeId 
      ? 'SELECT id FROM categories WHERE slug = ? AND id != ?'
      : 'SELECT id FROM categories WHERE slug = ?';
    const params = excludeId ? [uniqueSlug, excludeId] : [uniqueSlug];

    const [existing] = await db.execute(query, params);
    
    if (existing.length === 0) {
      break;
    }
    
    uniqueSlug = `${slug}-${counter}`;
    counter++;
  }

  return uniqueSlug;
};

// Get all categories
const getAllCategories = async (req, res) => {
  try {
    const [categories] = await db.execute(`
      SELECT * FROM categories 
      ORDER BY name ASC
    `);

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ success: false, message: 'Error fetching categories' });
  }
};

// Get single category by ID
const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const [categories] = await db.execute(`
      SELECT * FROM categories WHERE id = ?
    `, [id]);

    if (categories.length === 0) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    res.json({
      success: true,
      data: categories[0]
    });
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ success: false, message: 'Error fetching category' });
  }
};

// Get subcategories for a category
const getSubcategoriesByCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const [subcategories] = await db.execute(`
      SELECT * FROM subcategories 
      WHERE category_id = ? 
      ORDER BY name ASC
    `, [id]);

    res.json({
      success: true,
      data: subcategories
    });
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    res.status(500).json({ success: false, message: 'Error fetching subcategories' });
  }
};

// Create new category
const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    
    if (!name) {
      return res.status(400).json({ success: false, message: 'Category name is required' });
    }

    // Check if category already exists
    const [existingCategories] = await db.execute(
      'SELECT id FROM categories WHERE name = ?',
      [name]
    );

    if (existingCategories.length > 0) {
      return res.status(400).json({ success: false, message: 'Category with this name already exists' });
    }

    // Generate unique slug
    const slug = await generateUniqueSlug(name);
    const imagePath = req.file ? req.file.path.replace('public', '') : null;

    const [result] = await db.execute(
      'INSERT INTO categories (name, slug, description, image_url) VALUES (?, ?, ?, ?)',
      [name, slug, description || null, imagePath]
    );

    const [newCategory] = await db.execute(
      'SELECT * FROM categories WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: newCategory[0]
    });
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ success: false, message: 'Error creating category' });
  }
};

// Update category
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: 'Category name is required' });
    }

    // Check if category exists
    const [existingCategory] = await db.execute(
      'SELECT * FROM categories WHERE id = ?',
      [id]
    );

    if (existingCategory.length === 0) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    // Check if name already exists for another category
    const [nameExists] = await db.execute(
      'SELECT id FROM categories WHERE name = ? AND id != ?',
      [name, id]
    );

    if (nameExists.length > 0) {
      return res.status(400).json({ success: false, message: 'Category with this name already exists' });
    }

    // Generate unique slug if name has changed
    let slug = existingCategory[0].slug;
    if (name !== existingCategory[0].name) {
      slug = await generateUniqueSlug(name, id);
    }

    const imagePath = req.file ? req.file.path.replace('public', '') : existingCategory[0].image_url;

    await db.execute(
      'UPDATE categories SET name = ?, slug = ?, description = ?, image_url = ? WHERE id = ?',
      [name, slug, description || null, imagePath, id]
    );

    const [updatedCategory] = await db.execute(
      'SELECT * FROM categories WHERE id = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Category updated successfully',
      data: updatedCategory[0]
    });
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ success: false, message: 'Error updating category' });
  }
};

// Delete category
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if category exists
    const [existingCategory] = await db.execute(
      'SELECT * FROM categories WHERE id = ?',
      [id]
    );

    if (existingCategory.length === 0) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    // Check if category has subcategories
    const [subcategories] = await db.execute(
      'SELECT COUNT(*) as count FROM subcategories WHERE category_id = ?',
      [id]
    );

    if (subcategories[0].count > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot delete category. It has subcategories. Please delete subcategories first.' 
      });
    }

    // Check if category has products
    const [products] = await db.execute(
      'SELECT COUNT(*) as count FROM products WHERE subcategory_id IN (SELECT id FROM subcategories WHERE category_id = ?)',
      [id]
    );

    if (products[0].count > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot delete category. It has products. Please delete products first.' 
      });
    }

    await db.execute('DELETE FROM categories WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ success: false, message: 'Error deleting category' });
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  getSubcategoriesByCategory,
  createCategory,
  updateCategory,
  deleteCategory
};
