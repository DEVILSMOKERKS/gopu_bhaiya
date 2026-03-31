import React from 'react';
import './privacy.css';

const Privacypolicy = () => {
  return (
    <div className="privacy-policy-container">
      <div className="privacy-policy-content">
        <header className="privacy-header">
          <h1>Privacy Policy</h1>
          <p>
            This page explains what information we collect, why we collect it, and how we keep it safe when you browse,
            enquire, or place an order with Mateshwari Moorti Bhandar.
          </p>
          <p className="privacy-last-updated">
            Last Updated: {new Date().toLocaleDateString()}
          </p>
        </header>

        <section className="privacy-policy-section">
          <h2>1. Introduction</h2>
          <p>
            Welcome to Mateshwari Moorti Bhandar. We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, use our mobile application, or make purchases from our store.
          </p>
          <p>
            By using our services, you consent to the data practices described in this policy. If you do not agree with our policies and practices, please do not use our services.
          </p>
        </section>

        <section className="privacy-policy-section">
          <h2>2. Information We Collect</h2>

          <h3>2.1 Personal Information</h3>
          <p>We may collect the following personal information: Name, email address, phone number, and postal address; payment information and billing details; order history and preferences; customer support conversations; and account or profile information you choose to share with us.</p>

          <h3>2.2 Automatically Collected Information</h3>
          <p>When you visit our website or use our app, we automatically collect: Device information (IP address, browser type, operating system); Usage data (pages visited, time spent, links clicked); Location data (with your consent); Cookies and similar tracking technologies.</p>
        </section>

        <section className="privacy-policy-section">
          <h2>3. How We Use Your Information</h2>
          <p>We use the collected information to process your orders, respond to enquiries, send shipping and delivery updates, improve your experience on the website, recommend relevant products or services, prevent fraud, and comply with legal requirements.</p>
        </section>

        <section className="privacy-policy-section">
          <h2>4. Information Sharing and Disclosure</h2>
          <p>We do not sell, trade, or rent your personal information to third parties. However, we may share your information in the following circumstances: <strong>Service Providers:</strong> With trusted third-party vendors who assist in operating our business (payment processors, shipping companies, IT services); <strong>Legal Requirements:</strong> When required by law or to protect our rights and safety; <strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets; <strong>Consent:</strong> With your explicit consent for specific purposes.</p>
        </section>

        <section className="privacy-policy-section">
          <h2>5. Data Security</h2>
          <p>We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include: Encryption of sensitive data during transmission and storage; Regular security assessments and updates; Access controls and authentication procedures; Employee training on data protection practices.</p>
        </section>

        <section className="privacy-policy-section">
          <h2>6. Cookies and Tracking Technologies</h2>
          <p>We use cookies and similar technologies to enhance your browsing experience: <strong>Essential Cookies:</strong> Required for basic website functionality; <strong>Analytics Cookies:</strong> Help us understand how visitors use our site; <strong>Marketing Cookies:</strong> Used for targeted advertising (with consent); <strong>Preference Cookies:</strong> Remember your settings and preferences. You can control cookie settings through your browser preferences.</p>
        </section>

        <section className="privacy-policy-section">
          <h2>7. Your Rights and Choices</h2>
          <p>You have the following rights regarding your personal information: <strong>Access:</strong> Request a copy of your personal data; <strong>Correction:</strong> Update or correct inaccurate information; <strong>Deletion:</strong> Request deletion of your personal data; <strong>Portability:</strong> Receive your data in a structured format; <strong>Objection:</strong> Object to certain processing activities; <strong>Withdrawal:</strong> Withdraw consent for marketing communications.</p>
        </section>

        <section className="privacy-policy-section">
          <h2>8. Marketing Communications</h2>
          <p>We may occasionally send updates about new collections, festive launches, consultations, and special offers. You can opt in when sharing your details, unsubscribe through the link in our emails, or ask us directly to update your communication preferences.</p>
        </section>

        <section className="privacy-policy-section">
          <h2>9. Children&apos;s Privacy</h2>
          <p>Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you believe we have collected information from a child under 13, please contact us immediately.</p>
        </section>

        <section className="privacy-policy-section">
          <h2>10. International Data Transfers</h2>
          <p>Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place to protect your data in accordance with this Privacy Policy and applicable laws.</p>
        </section>

        <section className="privacy-policy-section">
          <h2>11. Changes to This Privacy Policy</h2>
          <p>We may update this Privacy Policy from time to time. We will notify you of any material changes by: Posting the updated policy on our website; Sending an email notification to registered users; Displaying a prominent notice on our website. Your continued use of our services after such changes constitutes acceptance of the updated policy.</p>
        </section>

        <section className="privacy-policy-section">
          <h2>12. Contact Information</h2>
          <div className="privacy-contact-info">
            <p><strong>Mateshwari Moorti Bhandar</strong></p>
            <p><strong>Email:</strong> Mateshvariexporter@gmail.com</p>
            <p><strong>Phone:</strong> +91 77919 83156 | +91 88242 92890 | +91 97845 03338</p>
            <p><strong>Address:</strong> 2310, Khajane walo ka Rasta, Nehru Tailour Chouraha, Chandpole Bazar, Jaipur-302001 (Rajasthan) INDIA</p>
            <p><strong>Website:</strong> www.mateshwarimoortibhandar.com</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Privacypolicy;
