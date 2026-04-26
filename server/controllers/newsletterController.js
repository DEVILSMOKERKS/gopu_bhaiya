const db = require('../config/db');
const { sendEmail } = require('../utils/emailSender');

// Subscribe to newsletter
const subscribeNewsletter = async (req, res) => {
    try {
        const { email, consent } = req.body;

        // Validation
        if (!email || !consent) {
            return res.status(400).json({
                success: false,
                message: 'Email and consent are required'
            });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a valid email address'
            });
        }

        // Check if email already exists
        const [existingSubscribers] = await db.execute(
            'SELECT id FROM newsletter_subscribers WHERE email = ?',
            [email]
        );

        if (existingSubscribers.length > 0) {
            return res.status(409).json({
                success: false,
                message: 'This email is already subscribed to our newsletter'
            });
        }

        // Insert new subscriber
        const [result] = await db.execute(
            'INSERT INTO newsletter_subscribers (email, consent, subscribed_at) VALUES (?, ?, NOW())',
            [email, consent]
        );

        // Send welcome email
        try {
            await sendEmail(email, 'newsletterWelcome', {
                email
            });
        } catch (emailError) {
            console.error('Failed to send welcome email:', emailError);
            // Don't fail the request if email fails
        }

        // Send notification to admin
        try {
            const adminEmails = process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(',') : [];
            if (adminEmails.length > 0) {
                await sendEmail(adminEmails.join(','), 'newsletterSubscription', {
                    email,
                    subscriberId: result.insertId
                });
            }
        } catch (adminEmailError) {
            console.error('Failed to send admin notification:', adminEmailError);
            // Don't fail the request if admin email fails
        }

        res.status(201).json({
            success: true,
            message: 'Successfully subscribed to newsletter! Welcome to the Welcome To Mateshwari Moorti Bhanda family!'
        });

    } catch (error) {
        console.error('Newsletter subscription error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to subscribe to newsletter. Please try again later.'
        });
    }
};

// Get all newsletter subscribers (admin only)
const getAllSubscribers = async (req, res) => {
    try {
        const [subscribers] = await db.execute(
            'SELECT id, email, consent, subscribed_at FROM newsletter_subscribers ORDER BY subscribed_at DESC'
        );

        res.json({
            success: true,
            data: subscribers,
            count: subscribers.length
        });

    } catch (error) {
        console.error('Error fetching newsletter subscribers:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch newsletter subscribers'
        });
    }
};

// Unsubscribe from newsletter
const unsubscribeNewsletter = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }

        // Check if email exists
        const [existingSubscribers] = await db.execute(
            'SELECT id FROM newsletter_subscribers WHERE email = ?',
            [email]
        );

        if (existingSubscribers.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Email not found in our newsletter list'
            });
        }

        // Remove subscriber
        await db.execute(
            'DELETE FROM newsletter_subscribers WHERE email = ?',
            [email]
        );

        res.json({
            success: true,
            message: 'Successfully unsubscribed from newsletter'
        });

    } catch (error) {
        console.error('Newsletter unsubscribe error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to unsubscribe. Please try again later.'
        });
    }
};

// Get newsletter statistics
const getNewsletterStatistics = async (req, res) => {
    try {
        // Get total subscribers
        const [totalResult] = await db.execute(
            'SELECT COUNT(*) as total FROM newsletter_subscribers'
        );
        const totalSubscribers = totalResult[0].total;

        // Get new subscribers this month
        const [monthlyResult] = await db.execute(
            'SELECT COUNT(*) as count FROM newsletter_subscribers WHERE MONTH(subscribed_at) = MONTH(CURRENT_DATE()) AND YEAR(subscribed_at) = YEAR(CURRENT_DATE())'
        );
        const newThisMonth = monthlyResult[0].count;

        // Get new subscribers this week
        const [weeklyResult] = await db.execute(
            'SELECT COUNT(*) as count FROM newsletter_subscribers WHERE subscribed_at >= DATE_SUB(CURRENT_DATE(), INTERVAL 7 DAY)'
        );
        const newThisWeek = weeklyResult[0].count;

        // Get new subscribers today
        const [dailyResult] = await db.execute(
            'SELECT COUNT(*) as count FROM newsletter_subscribers WHERE DATE(subscribed_at) = CURRENT_DATE()'
        );
        const newToday = dailyResult[0].count;

        // Get consent rate
        const [consentResult] = await db.execute(
            'SELECT COUNT(*) as total, SUM(CASE WHEN consent = 1 THEN 1 ELSE 0 END) as consented FROM newsletter_subscribers'
        );
        const consentRate = consentResult[0].total > 0
            ? Math.round((consentResult[0].consented / consentResult[0].total) * 100)
            : 0;

        // Get monthly growth data for the last 12 months
        const [growthResult] = await db.execute(`
      SELECT 
        DATE_FORMAT(subscribed_at, '%Y-%m') as month,
        COUNT(*) as count
      FROM newsletter_subscribers 
      WHERE subscribed_at >= DATE_SUB(CURRENT_DATE(), INTERVAL 12 MONTH)
      GROUP BY DATE_FORMAT(subscribed_at, '%Y-%m')
      ORDER BY month ASC
    `);

        const monthlyGrowth = growthResult.map(row => ({
            month: new Date(row.month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
            count: row.count
        }));

        res.json({
            success: true,
            data: {
                totalSubscribers,
                newThisMonth,
                newThisWeek,
                newToday,
                consentRate,
                monthlyGrowth
            }
        });

    } catch (error) {
        console.error('Error fetching newsletter statistics:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch newsletter statistics'
        });
    }
};

// Send newsletter to subscribers
const sendNewsletter = async (req, res) => {
    try {
        const { subject, content, recipientType, selectedEmails } = req.body;

        if (!subject || !content) {
            return res.status(400).json({
                success: false,
                message: 'Subject and content are required'
            });
        }

        let subscribers = [];

        if (recipientType === 'all') {
            const [allSubscribers] = await db.execute(
                'SELECT email FROM newsletter_subscribers WHERE consent = 1'
            );
            subscribers = allSubscribers;
        } else if (recipientType === 'selected' && selectedEmails.length > 0) {
            const placeholders = selectedEmails.map(() => '?').join(',');
            const [selectedSubscribers] = await db.execute(
                `SELECT email FROM newsletter_subscribers WHERE id IN (${placeholders}) AND consent = 1`,
                selectedEmails
            );
            subscribers = selectedSubscribers;
        }

        if (subscribers.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No valid subscribers found'
            });
        }

        // Send emails to all subscribers
        let sentCount = 0;
        const failedEmails = [];

        for (const subscriber of subscribers) {
            try {
                await sendEmail(subscriber.email, 'newsletter', {
                    subject,
                    content,
                    email: subscriber.email
                });
                sentCount++;
            } catch (emailError) {
                console.error(`Failed to send email to ${subscriber.email}:`, emailError);
                failedEmails.push(subscriber.email);
            }
        }

        res.json({
            success: true,
            message: `Newsletter sent successfully to ${sentCount} subscribers`,
            sentCount,
            failedCount: failedEmails.length,
            failedEmails
        });

    } catch (error) {
        console.error('Error sending newsletter:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send newsletter'
        });
    }
};

// Delete subscriber
const deleteSubscriber = async (req, res) => {
    try {
        const { id } = req.params;

        const [result] = await db.execute(
            'DELETE FROM newsletter_subscribers WHERE id = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Subscriber not found'
            });
        }

        res.json({
            success: true,
            message: 'Subscriber deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting subscriber:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete subscriber'
        });
    }
};

module.exports = {
    subscribeNewsletter,
    getAllSubscribers,
    unsubscribeNewsletter,
    getNewsletterStatistics,
    sendNewsletter,
    deleteSubscriber
};
