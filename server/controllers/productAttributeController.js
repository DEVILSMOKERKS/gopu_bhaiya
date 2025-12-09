const db = require('../config/db');

// Get All Unique Attribute Names
const getAllAttributeNames = async (req, res) => {
    try {
        const [attributes] = await db.execute(
            'SELECT DISTINCT attribute_name FROM product_attributes ORDER BY attribute_name'
        );

        res.json({
            success: true,
            data: attributes.map(attr => attr.attribute_name)
        });

    } catch (error) {
        console.error('Get attribute names error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching attribute names',
            error: error.message
        });
    }
};

// Get All Values for an Attribute Name
const getAttributeValues = async (req, res) => {
    try {
        const { attribute_name } = req.params;

        const [values] = await db.execute(
            'SELECT DISTINCT attribute_value FROM product_attributes WHERE attribute_name = ? ORDER BY attribute_value',
            [attribute_name]
        );

        res.json({
            success: true,
            data: values.map(val => val.attribute_value)
        });

    } catch (error) {
        console.error('Get attribute values error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching attribute values',
            error: error.message
        });
    }
};

// Get All Attributes Grouped by Name
const getAllAttributesGrouped = async (req, res) => {
    try {
        const [attributes] = await db.execute(
            'SELECT attribute_name, attribute_value FROM product_attributes GROUP BY attribute_name, attribute_value ORDER BY attribute_name, attribute_value'
        );

        const grouped = {};
        attributes.forEach(attr => {
            if (!grouped[attr.attribute_name]) {
                grouped[attr.attribute_name] = [];
            }
            grouped[attr.attribute_name].push(attr.attribute_value);
        });

        res.json({
            success: true,
            data: grouped
        });

    } catch (error) {
        console.error('Get grouped attributes error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching grouped attributes',
            error: error.message
        });
    }
};

// Get All Attributes for a Product
const getProductAttributes = async (req, res) => {
    try {
        const { product_id } = req.params;

        const [attributes] = await db.execute(
            'SELECT * FROM product_attributes WHERE product_id = ? ORDER BY sort_order',
            [product_id]
        );

        res.json({
            success: true,
            data: attributes
        });

    } catch (error) {
        console.error('Get product attributes error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching product attributes',
            error: error.message
        });
    }
};

// Get Single Attribute
const getAttributeById = async (req, res) => {
    try {
        const { attribute_id } = req.params;

        const [attributes] = await db.execute(
            'SELECT * FROM product_attributes WHERE attribute_id = ?',
            [attribute_id]
        );

        if (attributes.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Attribute not found'
            });
        }

        res.json({
            success: true,
            data: attributes[0]
        });

    } catch (error) {
        console.error('Get attribute error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching attribute',
            error: error.message
        });
    }
};

// Create Attribute
const createAttribute = async (req, res) => {
    try {
        const { product_id, attribute_name, attribute_value, sort_order } = req.body;

        // Validate required fields
        if (!product_id || !attribute_name || !attribute_value) {
            return res.status(400).json({
                success: false,
                message: 'Product ID, attribute name, and attribute value are required'
            });
        }

        // Check if product exists
        const [product] = await db.execute(
            'SELECT product_id FROM products WHERE product_id = ?',
            [product_id]
        );

        if (product.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Insert attribute
        const [result] = await db.execute(
            'INSERT INTO product_attributes (product_id, attribute_name, attribute_value, sort_order) VALUES (?, ?, ?, ?)',
            [product_id, attribute_name, attribute_value, sort_order || 0]
        );

        res.status(201).json({
            success: true,
            message: 'Attribute created successfully',
            data: { attribute_id: result.insertId }
        });

    } catch (error) {
        console.error('Create attribute error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating attribute',
            error: error.message
        });
    }
};

// Create Multiple Attributes
const createMultipleAttributes = async (req, res) => {
    try {
        const { product_id, attributes } = req.body;

        // Validate required fields
        if (!product_id || !attributes || !Array.isArray(attributes)) {
            return res.status(400).json({
                success: false,
                message: 'Product ID and attributes array are required'
            });
        }

        // Check if product exists
        const [product] = await db.execute(
            'SELECT product_id FROM products WHERE product_id = ?',
            [product_id]
        );

        if (product.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Start transaction
        const connection = await db.getConnection();
        await connection.beginTransaction();

        try {
            const createdAttributes = [];

            for (let i = 0; i < attributes.length; i++) {
                const attr = attributes[i];
                if (!attr.attribute_name || !attr.attribute_value) {
                    continue;
                }

                const [result] = await connection.execute(
                    'INSERT INTO product_attributes (product_id, attribute_name, attribute_value, sort_order) VALUES (?, ?, ?, ?)',
                    [product_id, attr.attribute_name, attr.attribute_value, attr.sort_order || i]
                );

                createdAttributes.push({
                    attribute_id: result.insertId,
                    ...attr
                });
            }

            await connection.commit();
            connection.release();

            res.status(201).json({
                success: true,
                message: 'Attributes created successfully',
                data: createdAttributes
            });

        } catch (error) {
            await connection.rollback();
            connection.release();
            throw error;
        }

    } catch (error) {
        console.error('Create multiple attributes error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating attributes',
            error: error.message
        });
    }
};

// Update Attribute
const updateAttribute = async (req, res) => {
    try {
        const { attribute_id } = req.params;
        const { attribute_name, attribute_value, sort_order } = req.body;

        // Check if attribute exists
        const [existingAttribute] = await db.execute(
            'SELECT * FROM product_attributes WHERE attribute_id = ?',
            [attribute_id]
        );

        if (existingAttribute.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Attribute not found'
            });
        }

        // Build update query
        const updateFields = [];
        const updateValues = [];

        if (attribute_name !== undefined) {
            updateFields.push('attribute_name = ?');
            updateValues.push(attribute_name);
        }

        if (attribute_value !== undefined) {
            updateFields.push('attribute_value = ?');
            updateValues.push(attribute_value);
        }

        if (sort_order !== undefined) {
            updateFields.push('sort_order = ?');
            updateValues.push(sort_order);
        }

        if (updateFields.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No fields to update'
            });
        }

        updateValues.push(attribute_id);

        await db.execute(
            `UPDATE product_attributes SET ${updateFields.join(', ')} WHERE attribute_id = ?`,
            updateValues
        );

        res.json({
            success: true,
            message: 'Attribute updated successfully'
        });

    } catch (error) {
        console.error('Update attribute error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating attribute',
            error: error.message
        });
    }
};

// Update Multiple Attributes (Reorder or Bulk Update)
const updateMultipleAttributes = async (req, res) => {
    try {
        const { attributes } = req.body;

        if (!attributes || !Array.isArray(attributes)) {
            return res.status(400).json({
                success: false,
                message: 'Attributes array is required'
            });
        }

        // Start transaction
        const connection = await db.getConnection();
        await connection.beginTransaction();

        try {
            for (const attr of attributes) {
                if (!attr.attribute_id) continue;

                const updateFields = [];
                const updateValues = [];

                if (attr.attribute_name !== undefined) {
                    updateFields.push('attribute_name = ?');
                    updateValues.push(attr.attribute_name);
                }

                if (attr.attribute_value !== undefined) {
                    updateFields.push('attribute_value = ?');
                    updateValues.push(attr.attribute_value);
                }

                if (attr.sort_order !== undefined) {
                    updateFields.push('sort_order = ?');
                    updateValues.push(attr.sort_order);
                }

                if (updateFields.length > 0) {
                    updateValues.push(attr.attribute_id);
                    await connection.execute(
                        `UPDATE product_attributes SET ${updateFields.join(', ')} WHERE attribute_id = ?`,
                        updateValues
                    );
                }
            }

            await connection.commit();
            connection.release();

            res.json({
                success: true,
                message: 'Attributes updated successfully'
            });

        } catch (error) {
            await connection.rollback();
            connection.release();
            throw error;
        }

    } catch (error) {
        console.error('Update multiple attributes error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating attributes',
            error: error.message
        });
    }
};

// Delete Attribute
const deleteAttribute = async (req, res) => {
    try {
        const { attribute_id } = req.params;

        // Check if attribute exists
        const [attribute] = await db.execute(
            'SELECT * FROM product_attributes WHERE attribute_id = ?',
            [attribute_id]
        );

        if (attribute.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Attribute not found'
            });
        }

        await db.execute('DELETE FROM product_attributes WHERE attribute_id = ?', [attribute_id]);

        res.json({
            success: true,
            message: 'Attribute deleted successfully'
        });

    } catch (error) {
        console.error('Delete attribute error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting attribute',
            error: error.message
        });
    }
};

// Delete All Attributes for a Product
const deleteProductAttributes = async (req, res) => {
    try {
        const { product_id } = req.params;

        await db.execute('DELETE FROM product_attributes WHERE product_id = ?', [product_id]);

        res.json({
            success: true,
            message: 'All product attributes deleted successfully'
        });

    } catch (error) {
        console.error('Delete product attributes error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting product attributes',
            error: error.message
        });
    }
};

module.exports = {
    getAllAttributeNames,
    getAttributeValues,
    getAllAttributesGrouped,
    getProductAttributes,
    getAttributeById,
    createAttribute,
    createMultipleAttributes,
    updateAttribute,
    updateMultipleAttributes,
    deleteAttribute,
    deleteProductAttributes
};

