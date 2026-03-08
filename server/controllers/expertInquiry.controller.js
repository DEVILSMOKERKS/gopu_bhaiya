const db = require('../config/db');
const { sendMail } = require('../utils/emailService');

exports.createInquiry = async (req, res) => {
    const { name, email, productName, quantity } = req.body;

    if (!name || !email || !productName) {
        return res.status(400).json({ success: false, message: "Please fill all required fields." });
    }

    try {
        const sql = "INSERT INTO expert_inquiries (name, email, product_name, quantity) VALUES (?, ?, ?, ?)";
        const [result] = await db.execute(sql, [name, email, productName, quantity]);

        const adminEmail = process.env.ADMIN_EMAIL || 'admin@mateshwariexports.com';
        const html = `
            <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                <h2 style="color: #b18b5e;">New Bulk Order Inquiry</h2>
                <p><strong>Customer Name:</strong> ${name}</p>
                <p><strong>Customer Email:</strong> ${email}</p>
                <p><strong>Product Interest:</strong> ${productName}</p>
                <p><strong>Quantity Requested:</strong> ${quantity}</p>
                <hr style="border: 0; border-top: 1px solid #eee;" />
                <p style="font-size: 12px; color: #888;">Submitted via Mateshwari Moorti Bhandar Expert Form.</p>
            </div>
        `;

        const mailResult = await sendMail({
            to: adminEmail,
            subject: `New Expert Inquiry: ${productName}`,
            html,
        });

        if (!mailResult.success) {
            console.error('Inquiry email failed:', mailResult.error);
        }

        res.status(200).json({
            success: true,
            message: "Inquiry sent successfully!",
            inquiryId: result.insertId
        });
    } catch (error) {
        console.error("Inquiry Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};