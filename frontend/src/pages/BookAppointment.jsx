'use client';

import { useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import axios from 'axios';
import './BookAppointment.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const BookAppointment = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contactNumber: '',
    city: '',
    appointmentType: 'store-tour',
    selectedDate: null,
    selectedTime: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState({ type: '', text: '' });

  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const appointmentTypes = [
    {
      id: 'store-tour',
      title: 'Store Tour',
      duration: '45 minutes',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
      )
    },
    {
      id: 'temple-customization',
      title: 'Temple Customization',
      duration: '1 hour 30 minutes',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
          <path d="M2 17l10 5 10-5"></path>
          <path d="M2 12l10 5 10-5"></path>
        </svg>
      )
    }
  ];

  const timeSlots = [
    '11:30 AM', '12:15 PM', '1:00 PM', '1:45 PM', '2:30 PM',
    '3:15 PM', '4:00 PM', '4:45 PM', '5:30 PM', '6:15 PM', '7:00 PM'
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tues', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAppointmentTypeChange = (typeId) => {
    setFormData({
      ...formData,
      appointmentType: typeId
    });
  };

  const handleDateSelect = (date) => {
    setFormData({
      ...formData,
      selectedDate: date
    });
  };

  const handleTimeSelect = (time) => {
    setFormData({
      ...formData,
      selectedTime: time
    });
  };

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const handlePreviousMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isSelected = formData.selectedDate === dateStr;
      const isPast = new Date(dateStr) < new Date(new Date().setHours(0, 0, 0, 0));

      days.push(
        <div
          key={day}
          className={`calendar-day ${isSelected ? 'selected' : ''} ${isPast ? 'past' : ''}`}
          onClick={() => !isPast && handleDateSelect(dateStr)}
        >
          {day}
        </div>
      );
    }

    return days;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.selectedDate || !formData.selectedTime) {
      setSubmitMessage({ type: 'error', text: 'Please select both date and time.' });
      return;
    }
    setSubmitting(true);
    setSubmitMessage({ type: '', text: '' });
    try {
      const response = await axios.post(`${API_URL}/book-appointment`, {
        name: formData.name,
        email: formData.email || undefined,
        contactNumber: formData.contactNumber,
        city: formData.city,
        appointmentType: formData.appointmentType,
        selectedDate: formData.selectedDate,
        selectedTime: formData.selectedTime
      });
      if (response.data.success) {
        setSubmitMessage({
          type: 'success',
          text: response.data.message || 'Your appointment request has been submitted. We will contact you soon.'
        });
        setFormData({
          name: '',
          email: '',
          contactNumber: '',
          city: '',
          appointmentType: 'store-tour',
          selectedDate: null,
          selectedTime: ''
        });
        setTimeout(() => setSubmitMessage({ type: '', text: '' }), 6000);
      } else {
        setSubmitMessage({ type: 'error', text: response.data.message || 'Something went wrong. Please try again.' });
      }
    } catch (err) {
      setSubmitMessage({
        type: 'error',
        text: err.response?.data?.message || err.message || 'Failed to submit appointment. Please try again later.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="book-appointment-page">
      <div className="book-appointment-container">
        <h1 className="book-appointment-title">BOOK AN APPOINTMENT NOW</h1>
        <p style={{ textAlign: 'center', fontSize: '1.1rem', color: '#666', marginBottom: '2rem' }}>
          Schedule a personalized consultation with our expert team to discuss your custom marble idol design, temple setup, or spiritual art needs. We're here to help bring your vision to life with authentic craftsmanship and devotion.
        </p>

        <form onSubmit={handleSubmit} className="appointment-form">
          {/* Personal Information Fields */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="For appointment confirmation"
              />
            </div>
            <div className="form-group">
              <label htmlFor="contactNumber">Contact Number *</label>
              <input
                type="tel"
                id="contactNumber"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="city">City *</label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Appointment Type Selection */}
          <div className="appointment-type-section">
            <div className="appointment-type-grid">
              {appointmentTypes.map((type) => (
                <div
                  key={type.id}
                  className={`appointment-type-card ${formData.appointmentType === type.id ? 'selected' : ''}`}
                  onClick={() => handleAppointmentTypeChange(type.id)}
                >
                  <div className="appointment-type-radio">
                    <div className={`radio-circle ${formData.appointmentType === type.id ? 'filled' : ''}`}></div>
                    <div className="appointment-type-icon">{type.icon}</div>
                  </div>
                  <div className="appointment-type-content">
                    <h3 className="appointment-type-title">{type.title}</h3>
                    <p className="appointment-type-duration">{type.duration}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Date and Time Selection */}
          <div className="datetime-section">
            {/* Calendar Section */}
            <div className="calendar-section">
              <div className="calendar-header">
                <span className="select-date-label">SELECT DATE:</span>
              </div>
              <div className="calendar-container">
                <div className="calendar-month-header">
                  <button type="button" className="calendar-nav-btn" onClick={handlePreviousMonth}>
                    <FaChevronLeft />
                  </button>
                  <span className="calendar-month-year">
                    {monthNames[currentMonth]} {currentYear}
                  </span>
                  <button type="button" className="calendar-nav-btn" onClick={handleNextMonth}>
                    <FaChevronRight />
                  </button>
                </div>
                <div className="calendar-weekdays">
                  {daysOfWeek.map((day) => (
                    <div key={day} className="calendar-weekday">{day}</div>
                  ))}
                </div>
                <div className="calendar-days">
                  {renderCalendar()}
                </div>
              </div>
            </div>

            {/* Time Slots Section */}
            <div className="time-slots-section">
              <div className="time-slots-grid">
                {timeSlots.map((time) => (
                  <button
                    key={time}
                    type="button"
                    className={`time-slot-btn ${formData.selectedTime === time ? 'selected' : ''}`}
                    onClick={() => handleTimeSelect(time)}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Submit Message */}
          {submitMessage.text && (
            <div className={`book-appointment-message ${submitMessage.type === 'success' ? 'success' : 'error'}`}>
              {submitMessage.text}
            </div>
          )}

          {/* Submit Button */}
          <button type="submit" className="book-appointment-btn" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Book Appointment'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookAppointment;
