import React from 'react';
import './return.css';
import { Clock, Package, CreditCard, Shield, Phone, Mail, MapPin, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

const Return = () => {
  return (
    <div className="return-policy-container">
      <div className="return-policy-content">
        <header className="return-header">
          <h1>Exchange & Cancellation Policy</h1>
          <p className="return-last-updated">
            Last Updated: {new Date().toLocaleDateString()}
          </p>
        </header>

        <section className="return-policy-section">
          <h2>1. Overview</h2>
          <p>
            At Mateshwari Moorti Bhandar, we understand that purchasing marble idols and temple structures is a personal choice that reflects your spiritual and cultural preferences. We are committed to providing you with a seamless shopping experience and stand behind the quality of our products with our comprehensive exchange and cancellation policy.
          </p>
          <p>
            Our policy is designed to protect both our customers and the integrity of our clothing pieces. We offer a 30-day exchange policy on most items, ensuring you can shop with confidence knowing that your satisfaction is our priority.
          </p>
        </section>

        <section className="return-policy-section">
          <h2>2. Exchange Policy</h2>

          <h3>2.1 Eligible Items for Exchange</h3>
          <p>The following items are eligible for exchange within 30 days of delivery: All clothing items in original, unworn condition; Items with original packaging, tags, and labels intact; Non-customized clothing pieces; Items purchased within the 30-day exchange window; Products that meet our quality standards upon inspection.</p>

          <h3>2.2 Non-Eligible Items</h3>
          <p>The following items are not eligible for exchange: Designer clothing and premium items above ₹10,000; Customized or personalized clothing pieces; Undergarments and intimate wear for hygiene reasons; Damaged, worn, or altered items; Items without original packaging and tags; Sale or clearance items (unless defective); Items purchased from third-party retailers.</p>
        </section>

        <section className="return-policy-section">
          <h2>3. Exchange Process</h2>
          <p>To initiate an exchange, follow these simple steps:</p>
          <p><strong>Step 1:</strong> Log into your Mateshwari Moorti Bhandar account and navigate to &quot;My Orders&quot; section. Select the item you wish to exchange and click &quot;Initiate Exchange&quot; within 30 days of delivery.</p>
          <p><strong>Step 2:</strong> Choose the item you want to exchange for. Ensure the item is in its original condition with all packaging, tags, labels, and documentation included. Any missing components may affect your exchange eligibility.</p>
          <p><strong>Step 3:</strong> Download and print the exchange shipping label provided by Mateshwari Moorti Bhandar. Securely package the item and attach the label to your package.</p>
          <p><strong>Step 4:</strong> Drop off your package at any authorized courier location. Exchange shipping is free for all eligible exchanges within India.</p>
          <p><strong>Step 5:</strong> Once we receive and inspect your exchange, we will process your new item shipment within 5-7 business days. If there&apos;s a price difference, it will be handled according to our exchange policy.</p>
        </section>

        <section className="return-policy-section">
          <h2>4. Cancellation Policy</h2>
          <p><strong>Order Cancellation:</strong> You can cancel your order at no cost any time before we send the Dispatch Confirmation email. For orders containing multiple items, you can cancel individual items without affecting the entire order.</p>
          <p><strong>Cancellation Timeline:</strong> Before dispatch - Free cancellation available; After dispatch - Exchange process applies (30-day window); After delivery - 30-day exchange policy applies.</p>
          <p><strong>Processing Time:</strong> Cancellation requests are processed within 24 hours during business days. You will receive a confirmation email once your cancellation is processed.</p>
        </section>

        <section className="return-policy-section">
          <h2>5. Exchange Information</h2>
          <p><strong>Exchange Options:</strong> You can exchange for items of equal or higher value. For exchanges of higher value, you will need to pay the price difference through the following methods: Credit/Debit Card; Net Banking; Mateshwari Moorti Bhandar Cash Account; Bank Transfer.</p>
          <p><strong>Exchange Timeline:</strong> Exchange received (1-2 business days) → Quality check (2-3 business days) → New item shipped (5-7 business days). Total processing time: 8-12 business days from receipt of exchange.</p>
          <p><strong>Exchange Value:</strong> Full exchange value of the original purchase price. For exchanges of higher value, the price difference must be paid before the new item is shipped.</p>
        </section>

        <section className="return-policy-section">
          <h2>6. Special Cases</h2>
          <p><strong>Defective Items:</strong> If you receive a defective item, contact our customer service immediately with photos of the defect. We will arrange for a replacement or exchange, including all shipping costs.</p>
          <p><strong>Wrong Item Received:</strong> If you receive the wrong item, we will arrange for the correct item to be shipped at no additional cost, or provide an exchange if the correct item is not available.</p>
          <p><strong>Gift Cards:</strong> Upon cancellation or exchange of orders placed using gift cards, the gift card amount will be credited back to the original gift card for future use.</p>
          <p><strong>Promotional Codes:</strong> For products ordered using promotional codes (FLAT10, DIWALI20, etc.), all products in the order must be exchanged together to maintain the promotional discount integrity.</p>
        </section>

        <section className="return-policy-section">
          <h2>7. Quality Standards</h2>
          <p>All exchanged items undergo a thorough quality inspection by our certified fashion experts. We check for: Original condition and finish; Presence of all original packaging and tags; No signs of wear, damage, or alteration; Authenticity of the clothing piece; Completeness of all components and accessories.</p>
          <p>Items that do not meet our quality standards may be refused for exchange, and you will be notified of the specific reason for rejection.</p>
        </section>

        <section className="return-policy-section">
          <h2>8. Shipping and Handling</h2>
          <p><strong>Exchange Shipping:</strong> We provide free exchange shipping for all eligible exchanges within India. Exchange shipping labels are valid for 7 days from the date of generation.</p>
          <p><strong>International Exchanges:</strong> For international orders, exchange shipping costs are the responsibility of the customer. We recommend using a trackable shipping method and purchasing insurance for valuable items.</p>
          <p><strong>Package Requirements:</strong> Items must be securely packaged to prevent damage during transit. We recommend using the original packaging or equivalent protective materials.</p>
        </section>

        <section className="return-policy-section">
          <h2>9. Legal and Compliance</h2>
          <p><strong>Government Regulations:</strong> As per Government of India guidelines, PAN (Permanent Account Number) is required for all purchases above ₹2,00,000. This information is mandatory for processing exchanges for high-value items.</p>
          <p><strong>Consumer Rights:</strong> This policy is in addition to your statutory rights under Indian consumer protection laws. Nothing in this policy affects your legal rights as a consumer.</p>
          <p><strong>Dispute Resolution:</strong> Any disputes regarding exchanges will be resolved through our customer service team. If a resolution cannot be reached, the matter will be referred to appropriate legal authorities.</p>
        </section>

        <section className="return-policy-section">
          <h2>10. Important Notes</h2>
          <p>All exchanges must be initiated within 30 days of the delivery date. Items must be in original condition with all packaging, tags, and labels included. Mateshwari Moorti Bhandar reserves the right to refuse exchanges that do not meet our policy requirements. Exchange shipping labels are valid for 7 days from the date of generation. For security reasons, we may require additional verification for high-value exchanges. This policy is subject to change without prior notice, but changes will not affect exchanges already in progress.</p>
        </section>

        <section className="return-policy-section">
          <h2>11. Contact Information</h2>
          <div className="return-contact-info">
            <p><strong>Customer Service:</strong> <a href="tel:+917791983156" style={{ textDecoration: 'none', color: 'inherit' }}>+91 77919 83156</a> | <a href="tel:+918824292890" style={{ textDecoration: 'none', color: 'inherit' }}>+91 88242 92890</a> | <a href="tel:+919784503338" style={{ textDecoration: 'none', color: 'inherit' }}>+91 97845 03338</a> (Mon-Sat: 9:00 AM - 8:00 PM)</p>
            <p><strong>Email Support:</strong> <a href="mailto:Mateshvariexporter@gmail.com" style={{ textDecoration: 'none', color: 'inherit' }}>Mateshvariexporter@gmail.com</a> (Response within 24 hours)</p>
            <p><strong>Store Address:</strong> <a href="https://www.google.com/maps/search/2310,+Khajane+walo+ka+Rasta,+Nehru+Tailour+Chouraha,+Chandpole+Bazar,+Jaipur-302001" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>2310, Khajane walo ka Rasta, Nehru Tailour Chouraha, Chandpole Bazar, Jaipur-302001 (Rajasthan) INDIA</a></p>
            <p><strong>Website:</strong> <a href="https://www.mateshwarimoortibhandar.com" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>www.mateshwarimoortibhandar.com</a></p>
            <p><strong>Business Hours:</strong> Monday to Saturday: 9:00 AM - 8:00 PM (Closed on Sundays and National Holidays)</p>
          </div>
        </section>

        <section className="return-policy-section">
          <h2>12. Frequently Asked Questions</h2>

          <h3>12.1 Can I exchange a gift I received?</h3>
          <p>Yes, you can exchange gifts within 30 days of delivery. The exchange will be processed as store credit for future purchases or you can choose another item of equal or higher value.</p>

          <h3>12.2 What if my item arrives damaged?</h3>
          <p>Contact us immediately with photos of the damage. We will arrange for a replacement or exchange, including all shipping costs.</p>

          <h3>12.3 How long does it take to get my exchange?</h3>
          <p>Exchanges are typically processed within 5-7 business days after we receive and inspect your exchanged item.</p>

          <h3>12.4 Can I exchange for a different size or style?</h3>
          <p>Yes, you can exchange for a different size, style, or color. Contact our customer service team for assistance with exchanges.</p>

          <h3>12.5 Is exchange shipping free?</h3>
          <p>Yes, we provide free exchange shipping for all eligible exchanges within India. You will receive a prepaid shipping label.</p>

          <h3>12.6 What happens if my exchange is rejected?</h3>
          <p>If your exchange is rejected, we will notify you of the specific reason and return the item to you at your expense. You may appeal the decision by contacting our customer service team.</p>
        </section>
      </div>
    </div>
  );
};

export default Return;
