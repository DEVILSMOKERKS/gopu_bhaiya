import React from 'react'
import './paymentsuccessful.css'

const Paymentsuccessful = () => {

    return (
        <div className="paymentsuccessful-container">

            <div className="paymentsuccessful-content">
                <div className="paymentsuccessful-icon">
                    <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="30" cy="30" r="30" fill="#4CAF50" />
                        <path d="M25 35L20 30L18 32L25 39L42 22L40 20L25 35Z" fill="white" />
                    </svg>
                </div>

                <h1 className="paymentsuccessful-title">Payment Successful</h1>

                <div className="paymentsuccessful-message">
                    <p>Thank You For Choosing Mateshwari Moorti Bhandar, Your Order Will Be Generated Based On Your Delivery Request.</p>
                    <p>The Receipt Has Been Sent To Your Email</p>
                </div>

                <div className="paymentsuccessful-contact">
                    <p>Please Contact Us For Any Query</p>
                    <p className="paymentsuccessful-phone">+91 77919 83156</p>
                    <p>OR</p>
                    <p className="paymentsuccessful-email">Hello @ MateshwariMoortiBhandar.Com</p>
                </div>
            </div>
        </div>
    )
}

export default Paymentsuccessful