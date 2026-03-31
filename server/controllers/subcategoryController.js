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

// Function to generate unique slug for subcategories
const generateUniqueSubcategorySlug = async (name, excludeId = null) => {
  let slug = generateSlug(name);
  let counter = 1;
  let uniqueSlug = slug;

  while (true) {
    const query = excludeId 
      ? 'SELECT id FROM subcategories WHERE slug = ? AND id != ?'
      : 'SELECT id FROM subcategories WHERE slug = ?';
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

// Get all subcategories
const getAllSubcategories = async (req, res) => {
  try {
    const { category_id } = req.query;
    const [subcategories] = await db.execute(`
      SELECT sc.*, c.name as category_name 
      FROM subcategories sc
      LEFT JOIN categories c ON sc.category_id = c.id
      ${category_id ? 'WHERE sc.category_id = ?' : ''}
      ORDER BY sc.name ASC
    `, category_id ? [category_id] : []);

    res.json({
      success: true,
      data: subcategories
    });
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    res.status(500).json({ success: false, message: 'Error fetching subcategories' });
  }
};

// Get single subcategory by ID
const getSubcategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const [subcategories] = await db.execute(`
      SELECT sc.*, c.name as category_name 
      FROM subcategories sc
      LEFT JOIN categories c ON sc.category_id = c.id
      WHERE sc.id = ?
    `, [id]);

    if (subcategories.length === 0) {
      return res.status(404).json({ success: false, message: 'Subcategory not found' });
    }

    res.json({
      success: true,
      data: subcategories[0]
    });
  } catch (error) {
    console.error('Error fetching subcategory:', error);
    res.status(500).json({ success: false, message: 'Error fetching subcategory' });
  }
};

// Create new subcategory
const createSubcategory = async (req, res) => {
  try {
    const { name, description, category_id } = req.body;
    
    if (!name || !category_id) {
      return res.status(400).json({ success: false, message: 'Subcategory name and category are required' });
    }

    // Check if category exists
    const [category] = await db.execute(
      'SELECT id FROM categories WHERE id = ?',
      [category_id]
    );

    if (category.length === 0) {
      return res.status(400).json({ success: false, message: 'Selected category does not exist' });
    }

    // Check if subcategory already exists in this category
    const [existingSubcategories] = await db.execute(
      'SELECT id FROM subcategories WHERE name = ? AND category_id = ?',
      [name, category_id]
    );

    if (existingSubcategories.length > 0) {
      return res.status(400).json({ success: false, message: 'Subcategory with this name already exists in this category' });
    }

    // Generate unique slug
    const slug = await generateUniqueSubcategorySlug(name);
    const imagePath = req.file ? req.file.path.replace('public', '') : null;

    const [result] = await db.execute(
      'INSERT INTO subcategories (name, slug, description, category_id, image_url) VALUES (?, ?, ?, ?, ?)',
      [name, slug, description || null, category_id, imagePath]
    );

    const [newSubcategory] = await db.execute(`
      SELECT sc.*, c.name as category_name 
      FROM subcategories sc
      LEFT JOIN categories c ON sc.category_id = c.id
      WHERE sc.id = ?
    `, [result.insertId]);

    res.status(201).json({
      success: true,
      message: 'Subcategory created successfully',
      data: newSubcategory[0]
    });
  } catch (error) {
    console.error('Error creating subcategory:', error);
    res.status(500).json({ success: false, message: 'Error creating subcategory' });
  }
};

// Update subcategory
const updateSubcategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, category_id } = req.body;

    if (!name || !category_id) {
      return res.status(400).json({ success: false, message: 'Subcategory name and category are required' });
    }

    // Check if subcategory exists
    const [existingSubcategory] = await db.execute(
      'SELECT * FROM subcategories WHERE id = ?',
      [id]
    );

    if (existingSubcategory.length === 0) {
      return res.status(404).json({ success: false, message: 'Subcategory not found' });
    }

    // Check if category exists
    const [category] = await db.execute(
      'SELECT id FROM categories WHERE id = ?',
      [category_id]
    );

    if (category.length === 0) {
      return res.status(400).json({ success: false, message: 'Selected category does not exist' });
    }

    // Check if name already exists for another subcategory in the same category
    const [nameExists] = await db.execute(
      'SELECT id FROM subcategories WHERE name = ? AND category_id = ? AND id != ?',
      [name, category_id, id]
    );

    if (nameExists.length > 0) {
      return res.status(400).json({ success: false, message: 'Subcategory with this name already exists in this category' });
    }

    // Generate unique slug if name has changed
    let slug = existingSubcategory[0].slug;
    if (name !== existingSubcategory[0].name) {
      slug = await generateUniqueSubcategorySlug(name, id);
    }

    const imagePath = req.file ? req.file.path.replace('public', '') : existingSubcategory[0].image_url;

    await db.execute(
      'UPDATE subcategories SET name = ?, slug = ?, description = ?, category_id = ?, image_url = ? WHERE id = ?',
      [name, slug, description || null, category_id, imagePath, id]
    );

    const [updatedSubcategory] = await db.execute(`
      SELECT sc.*, c.name as category_name 
      FROM subcategories sc
      LEFT JOIN categories c ON sc.category_id = c.id
      WHERE sc.id = ?
    `, [id]);

    res.json({
      success: true,
      message: 'Subcategory updated successfully',
      data: updatedSubcategory[0]
    });
  } catch (error) {
    console.error('Error updating subcategory:', error);
    res.status(500).json({ success: false, message: 'Error updating subcategory' });
  }
};

// Delete subcategory
const deleteSubcategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if subcategory exists
    const [existingSubcategory] = await db.execute(
      'SELECT * FROM subcategories WHERE id = ?',
      [id]
    );

    if (existingSubcategory.length === 0) {
      return res.status(404).json({ success: false, message: 'Subcategory not found' });
    }

    // Check if subcategory has products
    const [products] = await db.execute(
      'SELECT COUNT(*) as count FROM products WHERE subcategory_id = ?',
      [id]
    );

    if (products[0].count > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot delete subcategory. It has products. Please delete products first.' 
      });
    }

    await db.execute('DELETE FROM subcategories WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Subcategory deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting subcategory:', error);
    res.status(500).json({ success: false, message: 'Error deleting subcategory' });
  }
};

module.exports = {
  getAllSubcategories,
  getSubcategoryById,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory
};
