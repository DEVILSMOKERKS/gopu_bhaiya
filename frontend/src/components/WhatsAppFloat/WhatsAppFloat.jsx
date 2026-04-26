import { useState, useEffect } from 'react';
import { MessageCircle, X, Phone } from 'lucide-react';
import './WhatsAppFloat.css';

const WhatsAppFloat = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [showBlinker, setShowBlinker] = useState(true); // State for blinker

    // Show the icon after a small delay for better UX
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    // Auto-hide blinker after 30 seconds (optional)
    useEffect(() => {
        if (isVisible) {
            const blinkerTimer = setTimeout(() => {
                setShowBlinker(false);
            }, 30000); // Hide after 30 seconds

            return () => clearTimeout(blinkerTimer);
        }
    }, [isVisible]);

    // WhatsApp number and message
    const whatsappNumber = "+917791983156";
    const defaultMessage = "Hello! I'm interested in Welcome To Mateshwari Moorti Bhanda collection. Can you help me?";

    const phoneNumbers = [
        {
            label: "Sales & Orders",
            number: "+91 77919 83156"
        },
        {
            label: "Support & Queries",
            number: "+91 97845 03338"
        }
    ];

    const handleWhatsAppClick = () => {
        const encodedMessage = encodeURIComponent(defaultMessage);
        const phoneForWhatsApp = whatsappNumber.replace(/[^\d]/g, '');
        const whatsappURL = `https://wa.me/${phoneForWhatsApp}?text=${encodedMessage}`;
        window.open(whatsappURL, '_self');
        setShowBlinker(false); // Hide blinker when clicked
    };

    const handleCallClick = () => {
        setIsExpanded(prev => !prev);
        setShowBlinker(false); // Hide blinker when call menu is opened
    };

    const toggleExpanded = () => {
        setIsExpanded(!isExpanded);
    };

    const handleDirectCall = (number) => {
        const cleaned = number.replace(/[^+\d]/g, '');
        window.open(`tel:${cleaned}`, '_self');
        setIsExpanded(false);
    };

    if (!isVisible) return null;

    return (
        <div className={`whatsapp-float-container ${isExpanded ? 'expanded' : ''}`}>
            {/* Expanded Menu */}
            {isExpanded && (
                <div className="whatsapp-float-menu">
                    <div className="whatsapp-float-header">
                        <h4>Call Us</h4>
                        <button
                            className="whatsapp-close-btn"
                            onClick={toggleExpanded}
                            aria-label="Close menu"
                        >
                            <X size={16} />
                        </button>
                    </div>

                    <div className="whatsapp-float-content">
                        <p>Select a number to call us directly.</p>

                        <div className="whatsapp-float-actions">
                            {phoneNumbers.map((entry) => (
                                <button
                                    key={entry.number}
                                    className="whatsapp-action-btn call-btn"
                                    onClick={() => handleDirectCall(entry.number)}
                                    aria-label={`Call ${entry.label}`}
                                >
                                    <Phone size={18} />
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                                        <span style={{ fontWeight: 600 }}>{entry.label}</span>
                                        <span style={{ fontSize: 12 }}>{entry.number}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Main floating buttons row */}
            <div className="whatsapp-float-buttons">
                {/* Main WhatsApp Button with Blinker */}
                <div
                    className="whatsapp-float-button"
                    onClick={handleWhatsAppClick}
                    title="Chat with us on WhatsApp"
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            handleWhatsAppClick();
                        }
                    }}
                >
                    {/* Blinker - positioned at top right of button */}
                    {showBlinker && !isExpanded && (
                        <div className="whatsapp-float-blinker"></div>
                    )}

                    <div className="whatsapp-float-icon">
                        {/* WhatsApp SVG Icon */}
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.891 3.488" />
                        </svg>
                    </div>

                    {!isExpanded && (
                        <div className="whatsapp-float-pulse">
                            <div className="whatsapp-pulse-ring"></div>
                            <div className="whatsapp-pulse-ring"></div>
                        </div>
                    )}

                    {!isExpanded && (
                        <div className="whatsapp-float-tooltip">
                            <span>Need Help? Chat with us!</span>
                        </div>
                    )}
                </div>

                {/* Call Button */}
                <button
                    className="whatsapp-float-button call-float-button"
                    onClick={handleCallClick}
                    aria-label="Call us directly"
                    type="button"
                >
                    <div className="whatsapp-float-icon">
                        <Phone size={24} />
                    </div>
                </button>
            </div>

            {/* Background overlay when expanded */}
            {isExpanded && (
                <div
                    className="whatsapp-float-overlay"
                    onClick={toggleExpanded}
                ></div>
            )}
        </div>
    );
};

export default WhatsAppFloat;