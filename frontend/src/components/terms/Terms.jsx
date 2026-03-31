import React from 'react';
import './terms.css';

const Terms = () => {
  return (
    <div className="terms-container">
      <div className="terms-content">
        <header className="terms-header">
          <h1>Terms & Conditions</h1>
          <p>
            Please read these terms carefully before using the website or placing an order with Mateshwari Moorti Bhandar.
          </p>
          <p className="terms-last-updated">
            Last Updated: {new Date().toLocaleDateString()}
          </p>
        </header>

        <section className="terms-section">
          <h2>Offer Details</h2>

          <h3>Promotional Offers</h3>
          <p>From time to time, customers may receive promotional discounts on selected products or collections, subject to eligibility, availability, and minimum order value.</p>

          <div className="terms-table-container">
            <table className="terms-table">
              <thead>
                <tr>
                  <th>Order Value</th>
                  <th>Discount</th>
                  <th>Voucher</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Rs 5,000 to Rs 9,999</td>
                  <td>10%</td>
                  <td>STYLE10</td>
                </tr>
                <tr>
                  <td>Rs 10,000 to Rs 19,999</td>
                  <td>20%</td>
                  <td>STYLE20</td>
                </tr>
                <tr>
                  <td>More than Rs 20,000</td>
                  <td>30%</td>
                  <td>STYLE30</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>Additional Offer Slabs</h3>
          <p>Some campaigns may include additional voucher slabs for selected order values. These offers apply only where they are explicitly displayed on the website or shared by our team.</p>

          <div className="terms-table-container">
            <table className="terms-table">
              <thead>
                <tr>
                  <th>Order Value</th>
                  <th>Discount</th>
                  <th>Voucher</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Rs 2,000 to Rs 4,999</td>
                  <td>10%</td>
                  <td>CASUAL10</td>
                </tr>
                <tr>
                  <td>More than Rs 5,000</td>
                  <td>15%</td>
                  <td>CASUAL15</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="terms-important-notes">
            <ul>
              <li>Voucher FLAT10 is applicable only on Premium Collection items.</li>
              <li>Voucher applicability may vary by collection, customization level, and campaign terms.</li>
              <li>Selected offers may not be valid on custom orders, consultation-led projects, or already discounted products.</li>
              <li>Offers and promotional pricing are valid only on selected products.</li>
              <li>All current vouchers are subject to discontinuation without prior notice.</li>
              <li>The applicability of any additional voucher is at the sole discretion of Mateshwari Moorti Bhandar.</li>
            </ul>
          </div>
        </section>

        <section className="terms-section">
          <h2>Use of the Website</h2>
          <p>
            By accessing the website, you warrant and represent to the website owner that you are legally entitled to do so and to make use of information made available via the website.
          </p>
        </section>

        <section className="terms-section">
          <h2>Trademarks</h2>
          <p>
            The trademarks, names, logos and service marks displayed on this website are the property of Mateshwari Moorti Bhandar. Nothing on this website should be interpreted as granting permission to use them without prior written consent.
          </p>
        </section>

        <section className="terms-section">
          <h2>External Links</h2>
          <p>
            External links may be provided for your convenience, but they are beyond the control of Mateshwari Moorti Bhandar. Use of those links and any third-party content is at your own discretion and risk.
          </p>
        </section>

        <section className="terms-section">
          <h2>Warranties</h2>
          <p>
            Except where otherwise required by law, Mateshwari Moorti Bhandar does not make additional warranties beyond those expressly stated for a product or service.
          </p>
        </section>

        <section className="terms-section">
          <h2>Prices</h2>
          <p>
            Pricing may vary based on material, craftsmanship, customization, size, and market conditions. Prices on the website may change without prior notice, and the final applicable price will be the one shown at the time of purchase or quotation.
          </p>
        </section>

        <section className="terms-section">
          <h2>Disclaimer of Liability</h2>
          <p>
            Mateshwari Moorti Bhandar Fashion disclaims all liability for any loss, damage, personal injury, or expense of any kind whatsoever and howsoever caused, whether directly or indirectly from the use of or reliance upon any information, material, or services available on this website, or any other matter relating to this website and even if such loss or damage is caused by or results from the negligence or gross negligence of Mateshwari Moorti Bhandar Fashion, or an authorized representative of Mateshwari Moorti Bhandar Fashion, or for any other reason whatsoever.
          </p>
        </section>

        <section className="terms-section">
          <h2>Conflict of Terms</h2>
          <p>
            If there is a conflict or contradiction between the provisions of these website terms and conditions and any other relevant terms and conditions, policies or notices, the other relevant terms and conditions, policies or notices which relate specifically to a particular section or module of the website shall prevail in respect of your use of the relevant section or module of the website.
          </p>
        </section>

        <section className="terms-section">
          <h2>Severability</h2>
          <p>
            Any provision of any relevant terms and conditions, policies and notices, which is or becomes unenforceable in a jurisdiction, whether due to voidness, invalidity, illegality, unlawfulness or for any reason whatever, shall, in such jurisdiction only, be treated as void and the remaining provisions of any relevant terms and conditions, policies and notices, shall remain in full force and effect.
          </p>
        </section>

        <section className="terms-section">
          <h2>Cancellation & Returns</h2>
          <p><strong>Order Cancellation:</strong> Orders can be canceled at no cost before the Dispatch Confirmation E-mail. Individual items can be canceled within an order if it contains 2 or more items without canceling the entire order.</p>
          <p><strong>Refunds for Prepaid Orders:</strong> Amount will be credited to the payment source (Credit Card/Debit Card/Net Banking).</p>
          <p><strong>30 Day Money Back Policy:</strong> Refunds are credited to the Mateshwari Moorti Bhandar Cash account (not applicable on designer items above INR 10,000, accessories, and customized orders). You can choose to make another purchase or get the amount refunded to your bank account.</p>
          <p><strong>Refunds for Cash on Delivery Orders:</strong> Processed to the user&apos;s bank account.</p>
          <p><strong>Gift Card Orders:</strong> Refunded back to the gift card.</p>
          <p><strong>Return Conditions for Specific Vouchers:</strong> For products ordered using FLAT02, FLAT05, FLAT10, FLAT15, FLAT20, DIWALI05, DIWALI10, DIWALI15, DIWALI20, DIWALI25, LOVE05, LOVE10, LOVE15, all products in the order need to be returned together.</p>
        </section>

        <section className="terms-section">
          <h2>Applicable Laws</h2>
          <p>
            The website is governed by the laws of India. The parties agree that the courts in India have exclusive jurisdiction over disputes. Customers must provide their Permanent Account Number (PAN) for all purchases above INR 2 lakh, as per government guidelines.
          </p>
        </section>

        <section className="terms-section">
          <h2>Contests</h2>
          <p>
            Winners of contests and giveaways are selected at the company&apos;s discretion. Prizes/gifts are non-returnable/exchangeable. Any additional facilities are at the company&apos;s discretion. Mateshwari Moorti Bhandar reserves the right to change contest terms and conditions without prior intimation. All disputes will be resolved via email at legal@Mateshwari Moorti Bhandarfashion.com.
          </p>
        </section>

        <section className="terms-section">
          <h2>Contact Information</h2>
          <div className="terms-contact-info">
            <p><strong>Mateshwari Moorti Bhandar Fashion</strong></p>
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

export default Terms;
