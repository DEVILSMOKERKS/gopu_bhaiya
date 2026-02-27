import React, { useState, useEffect } from 'react';
import './popup.css';

const WelcomePopup = () => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        // Site open hone ke 2 second baad dikhayega
        const timer = setTimeout(() => {
            setShow(true);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    const closePopup = () => setShow(false);

    if (!show) return null;

    return (
        <div className="popup-overlay" onClick={closePopup}>
            <div className="popup-content" onClick={(e) => e.stopPropagation()}>
                <span className="close-btn" onClick={closePopup}>&times;</span>
                <h2>Welcome to CLASS</h2>
                <p>Humein apni details dein, hum aapse sampark karenge.</p>
                
                <form className="popup-form">
                    <input type="text" placeholder="Apna Naam" required />
                    <input type="email" placeholder="Email Address" required />
                    <input type="tel" placeholder="Mobile Number" required />
                    <button type="submit" className="submit-btn">Submit Karein</button>
                </form>
            </div>
        </div>
    );
};

export default WelcomePopup;