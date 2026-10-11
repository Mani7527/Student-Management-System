import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

function Students() {
  // Check if user is logged in
  const token = localStorage.getItem('token');

  // Form state for student details
  const [formData, setFormData] = useState({
    name: '',
    rollNo: '',
    email: '',
    course: '',
    semester: '',
    phone: ''
  });

  // State for submission feedback and loading indicator
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

  // Update form fields on input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage({ type: '', text: '' });

    // Ensure user is authenticated
    if (!token) {
      setStatusMessage({
        type: 'error',
        text: 'Access denied. Please log in before adding a student.'
      });
      return;
    }

    // Client-side validation: ensure no empty fields
    const { name, rollNo, email, course, semester, phone } = formData;
    if (!name || !rollNo || !email || !course || !semester || !phone) {
      setStatusMessage({
        type: 'error',
        text: 'Please fill in all the required fields.'
      });
      return;
    }


    try {
      setLoading(true);

      // Send POST request to backend API
      const response = await api.post('/students', formData);

      // Show success feedback
      setStatusMessage({
        type: 'success',
        text: response.data.message || 'Student added successfully!'
      });

      // Clear the form fields after successful submission
      setFormData({
        name: '',
        rollNo: '',
        email: '',
        course: '',
        semester: '',
        phone: ''
      });
    } catch (error) {
      // Show backend error message (e.g. duplicate roll number or validation error)
      const errorMessage =
        error.response?.data?.message ||
        'Failed to connect to the server. Please ensure the backend is running.';

      setStatusMessage({
        type: 'error',
        text: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="card">
        <h2>Add New Student</h2>
        <p className="subtitle">
          Enter student information below to add a new record to MongoDB.
        </p>

        {/* Authentication Warning if not logged in */}
        {!token && (
          <div className="alert alert-error" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
            <span>🔒 <strong>Login Required:</strong> You must be logged in to add a student record.</span>
            <Link to="/login" className="btn btn-primary" style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem' }}>
              Log In Now
            </Link>
          </div>
        )}

        {/* Success or error message notification */}
        {statusMessage.text && (
          <div className={`alert alert-${statusMessage.type}`}>
            {statusMessage.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="student-form">
          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="e.g. John Doe"
              value={formData.name}
              onChange={handleChange}
              disabled={loading || !token}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="rollNo">Roll Number *</label>
            <input
              type="text"
              id="rollNo"
              name="rollNo"
              placeholder="e.g. 21CS001"
              value={formData.rollNo}
              onChange={handleChange}
              disabled={loading || !token}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="e.g. john@college.edu"
              value={formData.email}
              onChange={handleChange}
              disabled={loading || !token}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="course">Course *</label>
            <input
              type="text"
              id="course"
              name="course"
              placeholder="e.g. B.Tech CSE"
              value={formData.course}
              onChange={handleChange}
              disabled={loading || !token}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="semester">Semester *</label>
            <input
              type="text"
              id="semester"
              name="semester"
              placeholder="e.g. 6th"
              value={formData.semester}
              onChange={handleChange}
              disabled={loading || !token}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number *</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              placeholder="e.g. 9876543210"
              value={formData.phone}
              onChange={handleChange}
              disabled={loading || !token}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading || !token}>
            {loading ? 'Adding Student...' : !token ? '🔒 Please Log In to Submit' : 'Submit Student'}
          </button>
        </form>

      </div>
    </div>
  );
}

export default Students;
