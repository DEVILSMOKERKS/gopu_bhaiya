# Contact Us System - Complete Implementation

## Overview
A comprehensive contact us system for the Saanz e-commerce platform that allows customers to submit inquiries and administrators to manage and respond to them efficiently.

## 🗄️ Database Schema

### Contact Queries Table
```sql
CREATE TABLE contact_queries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status ENUM('pending', 'in_progress', 'resolved', 'closed') DEFAULT 'pending',
    admin_notes TEXT,
    resolved_by INT,
    resolved_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (resolved_by) REFERENCES admins(id) ON DELETE SET NULL
);

-- Indexes for better performance
CREATE INDEX idx_contact_status ON contact_queries(status);
CREATE INDEX idx_contact_created_at ON contact_queries(created_at);
CREATE INDEX idx_contact_email ON contact_queries(email);
```

## 🔧 Backend Implementation

### Contact Controller (`server/controllers/contactController.js`)
**Complete contact query management with all necessary functions:**

#### Public Functions:
- **createContactQuery**: Create new contact query with validation
- **sendEmail**: Send confirmation email to user and notification to admin

#### Admin Functions:
- **getAllContactQueries**: Get all queries with pagination, filtering, and search
- **getContactQueryById**: Get single query by ID
- **updateContactQueryStatus**: Update query status and add admin notes
- **deleteContactQuery**: Delete contact query
- **getContactStatistics**: Get comprehensive statistics

### Contact Routes (`server/routes/contact.route.js`)
**API endpoints for contact management:**

#### Public Routes:
- `POST /api/contact-us` - Submit new contact query

#### Admin Routes (Authentication Required):
- `GET /api/admin/contact-queries` - Get all queries with filters
- `GET /api/admin/contact-queries/:id` - Get single query
- `PUT /api/admin/contact-queries/:id/status` - Update query status
- `DELETE /api/admin/contact-queries/:id` - Delete query
- `GET /api/admin/contact-statistics` - Get statistics

### Email Templates (`server/utils/emailSender.js`)
**Professional email templates for contact system:**

#### Templates Added:
1. **contactConfirmation**: Sent to user when query is submitted
2. **contactNotification**: Sent to admin when new query arrives
3. **contactStatusUpdate**: Sent to user when status changes

## 🎨 Frontend Implementation

### Contact Us Form (`frontend/src/components/contactUs/Contactus.jsx`)
**Enhanced contact form with proper validation:**

#### Features:
- Form validation for all required fields
- Email and phone number validation
- Separate subject and message fields
- Loading states and error handling
- Success confirmation
- Responsive design

#### Form Fields:
- Name (required)
- Email (required, validated)
- Phone (required, validated)
- Subject (required)
- Message (required, textarea)

### Admin Contact Management (`frontend/src/admin/pages/ContactManagement.jsx`)
**Professional admin interface for managing queries:**

#### Features:
- **Statistics Dashboard**: Total, today, this week, this month counts
- **Advanced Filtering**: By status and search functionality
- **Query Management**: View, update status, add notes, delete
- **Responsive Table**: Sortable columns with pagination
- **Modal Interface**: Detailed view and status updates
- **Real-time Updates**: Automatic refresh after actions

#### Status Management:
- **Pending**: New queries awaiting review
- **In Progress**: Queries being worked on
- **Resolved**: Queries that have been resolved
- **Closed**: Queries that are closed

## 📧 Email System Integration

### Automatic Email Notifications:
1. **User Confirmation**: Immediate confirmation when query is submitted
2. **Admin Notification**: Instant notification to admin team
3. **Status Updates**: User notification when query status changes

### Email Features:
- Professional HTML templates with Saanz branding
- Responsive design for all devices
- Clear call-to-action buttons
- Contact information and support details

## 🚀 Setup and Installation

### 1. Database Setup
Run the SQL commands from `server/database_update.sql`:
```bash
mysql -u your_username -p your_database < server/database_update.sql
```

### 2. Environment Variables
Add these to your `.env` file:
```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
ADMIN_EMAILS=admin1@example.com,admin2@example.com
ADMIN_PANEL_URL=https://admin.saanz.com
FRONTEND_URL=https://saanz.com
```

### 3. Server Integration
The contact routes are automatically integrated into the main server at `server/index.js`.

### 4. Frontend Integration
The contact form is ready to use in the existing contact us page.

## 🔐 Security Features

### Input Validation:
- Email format validation
- Phone number validation
- Required field validation
- SQL injection prevention

### Authentication:
- Admin routes protected with JWT authentication
- Public contact submission without authentication
- Role-based access control

### Rate Limiting:
- Built-in protection against spam
- Database constraints and validation

## 📱 Responsive Design

### Mobile-First Approach:
- Responsive form layout
- Touch-friendly interface
- Mobile-optimized admin panel
- Adaptive table design

### Cross-Platform Compatibility:
- Works on all modern browsers
- Mobile and tablet optimized
- Desktop-friendly interface

## 🎯 Key Features

### For Customers:
- Easy-to-use contact form
- Immediate confirmation
- Status tracking via email
- Professional communication

### For Administrators:
- Centralized query management
- Real-time notifications
- Status tracking and updates
- Comprehensive statistics
- Search and filtering
- Bulk operations support

## 🔄 Workflow

### 1. Query Submission:
1. Customer fills out contact form
2. System validates input data
3. Query saved to database
4. Confirmation email sent to customer
5. Notification email sent to admin

### 2. Query Management:
1. Admin receives notification
2. Admin reviews query in dashboard
3. Admin updates status and adds notes
4. Customer receives status update email
5. Query tracked until resolution

### 3. Resolution:
1. Admin marks query as resolved
2. System records resolution details
3. Customer receives final update
4. Query archived for future reference

## 🛠️ Customization

### Email Templates:
- Easily customizable HTML templates
- Brand colors and styling
- Multi-language support ready
- Template variables for dynamic content

### Status Workflow:
- Configurable status types
- Custom status transitions
- Automated email triggers
- Workflow automation ready

### Admin Interface:
- Customizable dashboard widgets
- Configurable table columns
- Flexible filtering options
- Export functionality ready

## 📊 Monitoring and Analytics

### Built-in Statistics:
- Total query counts
- Daily/weekly/monthly trends
- Status distribution
- Response time tracking
- Admin performance metrics

### Integration Ready:
- Google Analytics integration
- Custom reporting
- Data export capabilities
- Performance monitoring

## 🚀 Future Enhancements

### Planned Features:
- **Chat Integration**: Real-time chat support
- **Ticket System**: Advanced ticket management
- **Knowledge Base**: FAQ and self-service
- **Multi-language**: Internationalization support
- **API Integration**: Third-party CRM integration
- **Automation**: AI-powered response suggestions

## 📞 Support

For technical support or questions about the contact us system:
- Email: support@saanz.com
- Phone: +91 98238 89134
- Documentation: This README file

---

**Note**: This system is designed to be production-ready and follows industry best practices for security, performance, and user experience.
