# Admin Panel & Frontend Connectivity Guide

This document outlines all the connectivity between the admin panel, frontend, and backend API.

## API Configuration

### Environment Variables
- **Frontend API URL**: `NEXT_PUBLIC_API_URL=http://localhost:5000/api`
- **Backend Port**: `5000`
- **Frontend Port**: `3000`

## Authentication Flow

### Admin Authentication
1. **Login**: `POST /api/admin/signin`
   - Admin panel uses `AdminContext` for authentication
   - Token stored in `localStorage` as `adminToken`
   - Admin data stored in `localStorage` as `admin`

2. **Token Verification**: `GET /api/admin/me`
   - Automatically called on admin panel load
   - Verifies token validity

3. **Logout**: `POST /api/admin/logout`
   - Clears token and admin data from localStorage

## Admin Panel Features & API Endpoints

### 1. Product Management

#### Create Product
- **Frontend**: `/admin/products/create`
- **Component**: `CreateProduct.jsx`
- **API Endpoint**: `POST /api/products`
- **Headers**: `Authorization: Bearer {token}`
- **Data**: FormData with product details, images, colors, sizes, attributes

#### Edit Product
- **Frontend**: `/admin/products/edit/:productId`
- **Component**: `EditProduct.jsx`
- **API Endpoint**: `PUT /api/products/:id`
- **Headers**: `Authorization: Bearer {token}`

#### View Products
- **Frontend**: `/admin/products`
- **Component**: `ProductList.jsx`
- **API Endpoint**: `GET /api/products` (with pagination, filters)

#### Delete Product
- **API Endpoint**: `DELETE /api/products/:id`
- **Headers**: `Authorization: Bearer {token}`

### 2. Category Management

#### Create Category
- **Frontend**: `/admin/categories/create`
- **Component**: `CreateCategory.jsx`
- **API Endpoint**: `POST /api/categories`
- **Headers**: `Authorization: Bearer {token}`
- **Data**: FormData with name, description, image

#### Edit Category
- **Frontend**: `/admin/categories/edit/:id`
- **Component**: `EditCategory.jsx`
- **API Endpoint**: `PUT /api/categories/:id`
- **Headers**: `Authorization: Bearer {token}`

#### View Categories
- **Frontend**: `/admin/categories`
- **Component**: `CategoryList.jsx`
- **API Endpoint**: `GET /api/categories`

### 3. Subcategory Management

#### Create Subcategory
- **Frontend**: `/admin/subcategories/create`
- **Component**: `CreateSubcategory.jsx`
- **API Endpoint**: `POST /api/subcategories`
- **Headers**: `Authorization: Bearer {token}`

#### Edit Subcategory
- **Frontend**: `/admin/subcategories/edit/:id`
- **Component**: `EditSubcategory.jsx`
- **API Endpoint**: `PUT /api/subcategories/:id`
- **Headers**: `Authorization: Bearer {token}`

### 4. Blog Management

#### Create Blog
- **Frontend**: `/admin/blogs` (Modal)
- **Component**: `BlogManagement.jsx`
- **API Endpoint**: `POST /api/admin/blogs`
- **Headers**: `Authorization: Bearer {token}`
- **Data**: FormData with title, content, status, meta_title, meta_description, tags, featured_image

#### Update Blog
- **API Endpoint**: `PUT /api/admin/blogs/:id`
- **Headers**: `Authorization: Bearer {token}`

#### View Blogs
- **API Endpoint**: `GET /api/admin/blogs?page=1&limit=10&search=&status=`
- **Headers**: `Authorization: Bearer {token}`

#### Delete Blog
- **API Endpoint**: `DELETE /api/admin/blogs/:id`
- **Headers**: `Authorization: Bearer {token}`

### 5. User Management

#### View All Users
- **Frontend**: `/admin/users`
- **Component**: `UserManagement.jsx`
- **API Endpoint**: `GET /api/admin/users?page=1&limit=10&search=&status=`
- **Headers**: `Authorization: Bearer {token}`

#### View User Details
- **API Endpoint**: `GET /api/admin/users/:id`
- **Headers**: `Authorization: Bearer {token}`

#### Update User Status
- **API Endpoint**: `PATCH /api/admin/users/:id/status`
- **Headers**: `Authorization: Bearer {token}`
- **Data**: `{ status: 'Active' | 'Inactive' | 'Blocked' }`

#### Delete User
- **API Endpoint**: `DELETE /api/admin/users/:id`
- **Headers**: `Authorization: Bearer {token}`

### 6. Contact Form Management

#### View Contact Queries
- **Frontend**: `/admin/contact-queries`
- **Component**: `ContactManagement.jsx`
- **API Endpoint**: `GET /api/admin/contact-queries?page=1&limit=10&status=&search=`
- **Headers**: `Authorization: Bearer {token}`

#### Update Query Status
- **API Endpoint**: `PUT /api/admin/contact-queries/:id/status`
- **Headers**: `Authorization: Bearer {token}`
- **Data**: `{ status: 'pending' | 'in_progress' | 'resolved' | 'closed', admin_notes: string }`

#### Delete Query
- **API Endpoint**: `DELETE /api/admin/contact-queries/:id`
- **Headers**: `Authorization: Bearer {token}`

#### Get Statistics
- **API Endpoint**: `GET /api/admin/contact-statistics`
- **Headers**: `Authorization: Bearer {token}`

### 7. Expert Consultation Management

#### View Consultations
- **Frontend**: `/admin/expert-consultations`
- **Component**: `ExpertConsultationManagement.jsx`
- **API Endpoint**: `GET /api/admin/expert-consultations?page=1&limit=10&status=&search=`
- **Headers**: `Authorization: Bearer {token}`

#### Update Consultation Status
- **API Endpoint**: `PUT /api/admin/expert-consultations/:id/status`
- **Headers**: `Authorization: Bearer {token}`
- **Data**: `{ status: string, admin_notes: string }`

#### Delete Consultation
- **API Endpoint**: `DELETE /api/admin/expert-consultations/:id`
- **Headers**: `Authorization: Bearer {token}`

#### Get Statistics
- **API Endpoint**: `GET /api/admin/expert-consultation-statistics`
- **Headers**: `Authorization: Bearer {token}`

### 8. Order Management

#### View Orders
- **Frontend**: `/admin/orders`
- **Component**: `OrderManagement.jsx`
- **API Endpoint**: `GET /api/orders` (with filters)
- **Headers**: `Authorization: Bearer {token}`

### 9. Review Management

#### View Reviews
- **Frontend**: `/admin/reviews`
- **Component**: `ReviewManagement.jsx`
- **API Endpoint**: `GET /api/reviews` (with filters)
- **Headers**: `Authorization: Bearer {token}`

### 10. Offer Management

#### Create Offer
- **Frontend**: `/admin/offers/create`
- **Component**: `CreateOffer.jsx`
- **API Endpoint**: `POST /api/offers`
- **Headers**: `Authorization: Bearer {token}`

#### Edit Offer
- **Frontend**: `/admin/offers/edit/:offerId`
- **Component**: `EditOffer.jsx`
- **API Endpoint**: `PUT /api/offers/:id`
- **Headers**: `Authorization: Bearer {token}`

### 11. Newsletter Management

#### View Subscribers
- **Frontend**: `/admin/newsletter/subscribers`
- **Component**: `NewsletterSubscribers.jsx`
- **API Endpoint**: `GET /api/newsletter/subscribers`
- **Headers**: `Authorization: Bearer {token}`

#### Send Newsletter
- **Frontend**: `/admin/newsletter/send`
- **Component**: `NewsletterSend.jsx`
- **API Endpoint**: `POST /api/newsletter/send`
- **Headers**: `Authorization: Bearer {token}`

## Frontend Features & API Endpoints

### 1. Contact Form Submission

#### Submit Contact Form
- **Component**: `Contactus.jsx`
- **API Endpoint**: `POST /api/contact-us`
- **Data**: 
  ```json
  {
    "name": "string",
    "email": "string",
    "phone": "string",
    "subject": "string",
    "message": "string"
  }
  ```
- **No Authentication Required**

### 2. Expert Consultation Submission

#### Submit Consultation Request
- **Component**: `HowToOrder.jsx`
- **API Endpoint**: `POST /api/expert-consultation`
- **Data**:
  ```json
  {
    "fullName": "string",
    "email": "string",
    "phone": "string",
    "city": "string",
    "aboutYourself": "string"
  }
  ```
- **No Authentication Required**

### 3. Newsletter Subscription

#### Subscribe to Newsletter
- **Component**: `Footer.jsx`
- **API Endpoint**: `POST /api/newsletter/subscribe`
- **Data**:
  ```json
  {
    "email": "string",
    "consent": boolean
  }
  ```
- **No Authentication Required**

### 4. User Authentication

#### User Login
- **Component**: `Login.jsx`
- **API Endpoint**: `POST /api/auth/login`
- **Data**:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```

#### User Registration
- **Component**: `Signup.jsx`
- **API Endpoint**: `POST /api/auth/register`
- **Data**: User registration data

### 5. Product Display

#### Get All Products
- **Component**: `Shop.jsx`
- **API Endpoint**: `GET /api/products?page=1&limit=12&category=&search=`

#### Get Product Details
- **Component**: `Product.jsx`
- **API Endpoint**: `GET /api/products/:id`

### 6. Blog Display

#### Get All Blogs
- **Component**: `Blogs.jsx`, `OurBlogs.jsx`
- **API Endpoint**: `GET /api/blogs?page=1&limit=10`

#### Get Blog Details
- **Component**: `BlogDetail.jsx`
- **API Endpoint**: `GET /api/blogs/:slug`

## Common Issues & Solutions

### 1. CORS Errors
- **Solution**: Ensure backend `server/index.js` has correct CORS configuration
- **Current Config**: Allows `http://localhost:3000` and production domain

### 2. Authentication Errors
- **Solution**: Check if token is being sent in headers
- **Format**: `Authorization: Bearer {token}`

### 3. API URL Not Found
- **Solution**: Verify `NEXT_PUBLIC_API_URL` in `.env` file
- **Current Value**: `http://localhost:5000/api`

### 4. File Upload Issues
- **Solution**: Ensure `Content-Type: multipart/form-data` for FormData requests
- **Note**: Don't manually set Content-Type header when using FormData

## Testing Checklist

- [ ] Admin login works
- [ ] Product creation with images works
- [ ] Product editing works
- [ ] Category/Subcategory CRUD works
- [ ] Blog creation/editing works
- [ ] Contact form submission works
- [ ] Contact queries visible in admin panel
- [ ] Expert consultation submission works
- [ ] Expert consultations visible in admin panel
- [ ] User management works
- [ ] Order management works
- [ ] Review management works
- [ ] Newsletter subscription works
- [ ] Newsletter management in admin works

## API Base URL

All API calls use: `process.env.NEXT_PUBLIC_API_URL` which resolves to:
- **Development**: `http://localhost:5000/api`
- **Production**: Should be set in production environment variables

## Authentication Token Storage

- **Admin Token**: `localStorage.getItem('adminToken')`
- **User Token**: `localStorage.getItem('token')`

## File Upload

All file uploads use `FormData`:
```javascript
const formData = new FormData();
formData.append('fieldName', value);
formData.append('file', fileObject);
```

Headers for file uploads:
```javascript
{
  'Authorization': `Bearer ${token}`,
  // Don't set Content-Type - browser will set it automatically with boundary
}
```
