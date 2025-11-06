import React from 'react';
import { FiMessageCircle } from 'react-icons/fi';

const WhatsAppFloat = () => {
  const phoneNumber = '911234567890'; // Replace with actual WhatsApp number
  const message = 'Hello! I would like to know more about Mateshwari Exports products.';
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-all duration-300 z-50 animate-float"
      aria-label="Contact us on WhatsApp"
    >
      <FiMessageCircle className="text-2xl" />
    </a>
  );
};

export default WhatsAppFloat;

