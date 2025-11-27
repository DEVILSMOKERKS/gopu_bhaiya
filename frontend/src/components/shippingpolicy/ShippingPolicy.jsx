import React, { useState, useEffect } from 'react';
import './shippingpolicy.css';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const ShippingPolicy = () => {
  const [policyData, setPolicyData] = useState({
    header: null,
    sections: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPolicyData();
  }, []);

  const fetchPolicyData = async () => {
    try {
      console.log('🔄 Fetching Shipping Policy data...');
      const response = await axios.get(`${API_URL}/shipping-policy/all`);

      if (response.data.success) {
        const data = response.data.data;
        console.log('✅ Shipping Policy Data fetched successfully:', data);
        setPolicyData(data);
      } else {
        console.error('❌ Failed to fetch Shipping Policy data:', response.data.message);
      }
    } catch (error) {
      console.error('🚨 Error fetching Shipping Policy data:', error);
      console.error('Error Response:', error.response);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to render sections with subsections
  const renderSections = () => {
    if (!policyData.sections || policyData.sections.length === 0) {
      return renderStaticContent();
    }

    // Group sections by main sections and subsections
    const mainSections = policyData.sections.filter(section => !section.parent_section_number);
    const subsections = policyData.sections.filter(section => section.parent_section_number);

    return mainSections.map((section, index) => {
      const sectionSubsections = subsections.filter(sub => sub.parent_section_number === section.section_number);

      return (
        <section key={section.id || index} className="shipping-policy-section">
          <h2>{section.section_number} {section.section_title}</h2>
          {section.content && <p style={{ whiteSpace: 'pre-line' }}>{section.content}</p>}

          {/* Render subsections */}
          {sectionSubsections.map((subsection, subIndex) => (
            <div key={subsection.id || subIndex}>
              <h3>{subsection.section_number} {subsection.section_title}</h3>
              <p style={{ whiteSpace: 'pre-line' }}>{subsection.content}</p>
            </div>
          ))}
        </section>
      );
    });
  };

  // Fallback static content
  const renderStaticContent = () => {
    return (
      <>
        <section className="shipping-policy-section">
          <h2>1. SHIPPING INFORMATION</h2>
          <p>At Mateshwari Moorti Bhandar, we understand the importance of timely delivery for your marble idols and temple structures. We offer reliable shipping services across India with secure packaging and insurance coverage. Our commitment to excellence extends beyond crafting beautiful idols to ensuring they reach you safely and on time.</p>
          <p>We partner with trusted logistics providers to deliver your orders with the utmost care and attention. Every shipment is handled with the same precision and dedication that goes into creating our fashion pieces.</p>
        </section>

        <section className="shipping-policy-section">
          <h2>2. DELIVERY AREAS</h2>
          <p>We currently ship to all major cities and towns across India. Our delivery network covers the entire country, ensuring that no matter where you are, you can access our beautiful fashion collections. Our extensive reach includes:</p>

          <h3>2.1 Metro Cities</h3>
          <p>• Delhi, Mumbai, Bangalore, Chennai, Kolkata, Hyderabad, Pune, Ahmedabad, Gurgaon, Noida, Faridabad, Ghaziabad</p>
          <p>• Estimated delivery: 2-3 business days</p>
          <p>• Priority handling and express delivery options available</p>
          <p>• Same-day dispatch for orders placed before 12 PM</p>

          <h3>2.2 Tier 1 & Tier 2 Cities</h3>
          <p>• Jaipur, Lucknow, Chandigarh, Indore, Bhopal, Nagpur, Surat, Vadodara, Patna, Ranchi, Bhubaneswar, Cuttack, Visakhapatnam, Vijayawada, Coimbatore, Madurai, Trichy, Salem, Erode, Tirupur</p>
          <p>• Estimated delivery: 3-5 business days</p>
          <p>• Standard delivery with tracking updates</p>
          <p>• Customer support available in local languages</p>

          <h3>2.3 Other Cities & Towns</h3>
          <p>• All other locations across India including remote areas</p>
          <p>• Estimated delivery: 5-7 business days</p>
          <p>• Extended delivery time for hilly and remote regions</p>
          <p>• Special handling for delicate and premium items</p>
        </section>

        <section className="shipping-policy-section">
          <h2>3. SHIPPING CHARGES</h2>
          <p>Our shipping charges are designed to be fair and transparent, based on order value and delivery location. We believe in providing value to our customers while maintaining high service standards:</p>

          <h3>3.1 Free Shipping</h3>
          <p>• Orders above ₹2,000: Free shipping across India</p>
          <p>• Mateshwari Moorti Bhandar Elite Members: Free shipping on all orders regardless of value</p>
          <p>• Corporate orders: Free shipping for bulk purchases</p>
          <p>• Designer collections: Free shipping for orders above ₹5,000</p>

          <h3>3.2 Standard Shipping</h3>
          <p>• Orders below ₹2,000: ₹100 shipping charge</p>
          <p>• Remote locations: Additional ₹50 surcharge may apply</p>
          <p>• Express delivery: Additional ₹200 for same-day dispatch</p>
          <p>• Weekend delivery: Additional ₹100 for Saturday/Sunday delivery</p>
        </section>

        <section className="shipping-policy-section">
          <h2>4. PACKAGING & SECURITY</h2>
          <p>We ensure your clothing reaches you safely with multiple layers of protection and security measures. Our packaging is designed to withstand the rigors of transportation while maintaining the elegance of your purchase:</p>

          <h3>4.1 Secure Packaging</h3>
          <p>• Premium packaging boxes with Mateshwari Moorti Bhandar branding and elegant design</p>
          <p>• Tamper-evident seals for security and authenticity verification</p>
          <p>• Bubble wrap and protective materials to prevent damage</p>
          <p>• Water-resistant outer packaging for monsoon protection</p>
          <p>• Delicate item handling for premium clothing pieces</p>
          <p>• Custom packaging for special occasions and gifts</p>

          <h3>4.2 Insurance Coverage</h3>
          <p>• All shipments are insured for full order value</p>
          <p>• Coverage against damage, loss, or theft during transit</p>
          <p>• No additional cost to customers - insurance included</p>
          <p>• Quick claim processing in case of any issues</p>
          <p>• 24/7 customer support for insurance-related queries</p>
        </section>

        <section className="shipping-policy-section">
          <h2>5. TRACKING & UPDATES</h2>
          <p>Stay informed about your order with our comprehensive tracking system that provides real-time updates at every stage of the delivery process. We believe in complete transparency and keeping you updated:</p>

          <h3>5.1 Order Tracking</h3>
          <p>• Real-time tracking via SMS and email notifications</p>
          <p>• Track order status on our website and mobile app</p>
          <p>• Delivery confirmation notifications with photos</p>
          <p>• Estimated delivery time updates</p>
          <p>• Route optimization for faster delivery</p>
          <p>• Live chat support for tracking queries</p>

          <h3>5.2 Delivery Updates</h3>
          <p>• Order confirmation email with order details</p>
          <p>• Shipping confirmation with tracking number and courier details</p>
          <p>• Out for delivery notification with delivery person details</p>
          <p>• Delivery completion confirmation with signature</p>
          <p>• Post-delivery feedback request</p>
          <p>• Customer satisfaction survey</p>
        </section>

        <section className="shipping-policy-section">
          <h2>6. DELIVERY PROCESS</h2>
          <p>Our delivery process is designed to ensure a smooth and hassle-free experience from order placement to delivery. We follow industry best practices and maintain high standards:</p>

          <h3>6.1 Order Processing</h3>
          <p>• Orders placed before 2 PM are processed same day</p>
          <p>• Orders placed after 2 PM are processed next business day</p>
          <p>• Quality check and packaging: 1 business day</p>
          <p>• Multiple quality checks before dispatch</p>
          <p>• Professional photography of packaged items</p>
          <p>• Inventory verification and stock confirmation</p>

          <h3>6.2 Delivery Schedule</h3>
          <p>• Monday to Saturday: 9 AM to 8 PM delivery window</p>
          <p>• Sunday deliveries available in select cities</p>
          <p>• Multiple delivery attempts if required</p>
          <p>• Flexible delivery time slots</p>
          <p>• Evening delivery options for working professionals</p>
          <p>• Weekend delivery for convenience</p>
        </section>

        <section className="shipping-policy-section">
          <h2>7. DELIVERY REQUIREMENTS</h2>
          <p>To ensure smooth delivery and maintain security standards, we have certain requirements that help us provide the best service while protecting your interests:</p>

          <h3>7.1 ID Verification</h3>
          <p>• Valid government ID proof required (Aadhar, PAN, Driving License, Passport)</p>
          <p>• PAN card mandatory for orders above ₹2 lakhs as per government guidelines</p>
          <p>• Delivery person will verify identity before handing over the package</p>
          <p>• OTP verification for high-value orders</p>
          <p>• Authorized representative can receive on behalf with proper authorization</p>

          <h3>7.2 Payment Verification</h3>
          <p>• OTP verification for online payments and card transactions</p>
          <p>• Cash on delivery: Exact amount required, no change provided</p>
          <p>• No partial payments accepted for security reasons</p>
          <p>• Digital payment options available at doorstep</p>
          <p>• Invoice and payment receipt provided</p>
        </section>

        <section className="shipping-policy-section">
          <h2>8. DELIVERY ISSUES</h2>
          <p>In case of delivery issues, we're here to help and ensure your satisfaction. Our customer support team is trained to handle various scenarios professionally:</p>

          <h3>8.1 Failed Deliveries</h3>
          <p>• Multiple delivery attempts made (up to 3 attempts)</p>
          <p>• Customer contacted for rescheduling via phone and SMS</p>
          <p>• Return to sender after 3 failed attempts</p>
          <p>• Refund processing within 3-5 business days</p>
          <p>• Alternative delivery address options</p>
          <p>• Pickup from nearest courier office</p>

          <h3>8.2 Damaged Packages</h3>
          <p>• Do not accept damaged packages - refuse delivery</p>
          <p>• Contact customer service immediately for assistance</p>
          <p>• Replacement or refund provided as per customer preference</p>
          <p>• Investigation and quality improvement measures</p>
          <p>• Compensation for inconvenience caused</p>
          <p>• Priority handling for replacement orders</p>
        </section>

        <section className="shipping-policy-section">
          <h2>9. INTERNATIONAL SHIPPING</h2>
          <p>Currently, we only ship within India to ensure the highest quality of service and timely delivery. International shipping will be available soon with the following features:</p>
          <p>• Worldwide shipping to major countries</p>
          <p>• International tracking and insurance</p>
          <p>• Customs clearance assistance</p>
          <p>• Multi-currency payment options</p>
          <p>• Local customer support in major markets</p>
          <p>• Express international delivery options</p>
        </section>

        <section className="shipping-policy-section">
          <h2>10. CONTACT INFORMATION</h2>
          <div className="shipping-policy-contact-info">
            <p><strong>Mateshwari Moorti Bhandar</strong></p>
            <p><strong>Shipping Support:</strong> Mateshvariexporter@gmail.com</p>
            <p><strong>Customer Care:</strong> Mateshvariexporter@gmail.com</p>
            <p><strong>Phone:</strong> +91 77919 83156</p>
            <p><strong>WhatsApp:</strong> +91 77919 83156</p>
            <p><strong>Address:</strong> Plot no.9 Chandni Nagar, Durgapura Bypass, Vidhyadhar Nagar, Jaipur, Rajasthan, Pin 302018.</p>
            <p><strong>Website:</strong> www.mateshwarimoortibhandar.com</p>
            <p><strong>Business Hours:</strong> Monday to Saturday: 9:00 AM - 8:00 PM</p>
            <p><strong>Emergency Support:</strong> Available 24/7 for urgent delivery issues</p>
          </div>
        </section>
      </>
    );
  };

  if (loading) {
    return (
      <div className="shipping-policy-container">
        <div className="shipping-policy-content">
          <div style={{ textAlign: 'center', padding: '40px', fontSize: '1.1rem', color: '#666' }}>
            Loading Shipping Policy...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="shipping-policy-container">
      <div className="shipping-policy-content">
        <header className="shipping-policy-header">
          <h1>{policyData.header?.page_title || 'SHIPPING POLICY'}</h1>
          <p className="shipping-policy-last-updated">
            Last Updated: {policyData.header?.last_updated ? new Date(policyData.header.last_updated).toLocaleDateString() : new Date().toLocaleDateString()}
          </p>
        </header>
        {renderSections()}
      </div>
    </div>
  );
};

export default ShippingPolicy; 