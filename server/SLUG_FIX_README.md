# Slug Fix for Categories and Subcategories

## Problem
The database schema requires a unique `slug` field for both categories and subcategories, but the API routes were not generating or handling this field properly. This caused the error:

```
Error: Duplicate entry '' for key 'slug'
```

## Solution
1. **Updated Category Route** (`server/routes/category.route.js`):
   - Added slug generation functions
   - Modified CREATE and UPDATE operations to include slug field
   - Ensures unique slugs are generated from category names

2. **Updated Subcategory Route** (`server/routes/subcategory.route.js`):
   - Added slug generation functions
   - Modified CREATE and UPDATE operations to include slug field
   - Ensures unique slugs are generated from subcategory names

3. **Created Fix Script** (`server/fix_all_slugs.js`):
   - Fixes existing categories and subcategories with empty/null slugs
   - Generates unique slugs for all existing records

## How to Run the Fix

### Option 1: Run the fix script (Recommended)
```bash
cd server
node fix_all_slugs.js
```

This will:
- Find all categories and subcategories with empty/null slugs
- Generate unique slugs for each one
- Update the database records

### Option 2: Manual Database Update
If you prefer to handle it manually, you can run SQL queries:

```sql
-- For categories (example)
UPDATE categories SET slug = 'category-name' WHERE slug IS NULL OR slug = '';

-- For subcategories (example)
UPDATE subcategories SET slug = 'subcategory-name' WHERE slug IS NULL OR slug = '';
```

## Slug Generation Rules
- Converts to lowercase
- Removes special characters (except spaces and hyphens)
- Replaces spaces with hyphens
- Removes leading/trailing hyphens
- Ensures uniqueness by adding numbers if needed (e.g., `category-name-1`, `category-name-2`)

## Example Transformations
- "Men's Clothing" → "mens-clothing"
- "Women's Fashion & Style" → "womens-fashion-style"
- "Kids & Toys" → "kids-toys"
- "Electronics & Gadgets" → "electronics-gadgets"

## After Running the Fix
1. The error should be resolved
2. New categories and subcategories will automatically get proper slugs
3. Existing records will have valid slugs
4. The API will work correctly for creating and updating categories/subcategories

## Testing
After running the fix, test by:
1. Creating a new category through the admin panel
2. Creating a new subcategory through the admin panel
3. Updating existing categories/subcategories
4. Verifying that no duplicate slug errors occur
