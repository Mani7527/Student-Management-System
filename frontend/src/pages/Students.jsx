import React, { useState, useEffect } from 'react';
import api from '../services/api';

function Students() {
  // Form state for student details
  const [formData, setFormData] = useState({
    name: '',
    rollNo: '',
    email: '',
    course: '',
    semester: '',
    phone: ''
  });

  // State for list of students
  const [students, setStudents] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // State for submission feedback and loading indicator
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

  // Fetch students from backend on mount
  const fetchStudents = async () => {
    try {
      setFetching(true);
      const response = await api.get('/students');
      setStudents(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch students:', error);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

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

      // Refresh list to show newly added student
      fetchStudents();
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

  // Handle student deletion with confirmation
  const handleDelete = async (id, name) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${name}? This action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);
      const response = await api.delete(`/students/${id}`);

      // Update the displayed list only after successful deletion
      setStudents((prevStudents) =>
        prevStudents.filter((student) => student._id !== id)
      );

      setStatusMessage({
        type: 'success',
        text: response.data?.message || 'Student deleted successfully!'
      });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        'Failed to delete the student. Please try again.';

      setStatusMessage({
        type: 'error',
        text: errorMessage
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="page-container">
      <div className="card">
        <h2>Add New Student</h2>
        <p className="subtitle">
          Enter student information below to add a new record to MongoDB.
        </p>

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
              disabled={loading}
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
              disabled={loading}
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
              disabled={loading}
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
              disabled={loading}
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
              disabled={loading}
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
              disabled={loading}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Adding Student...' : 'Submit Student'}
          </button>
        </form>
      </div>

      {/* Existing Students List */}
      <div className="card student-list-card">
        <h2>Existing Students</h2>
        <p className="subtitle">
          View all registered students or delete a record.
        </p>

        {fetching ? (
          <p className="status-text">Loading students...</p>
        ) : students.length === 0 ? (
          <div className="empty-state">
            <p>No student records found. Add a student using the form above.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="student-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Roll No</th>
                  <th>Email</th>
                  <th>Course</th>
                  <th>Semester</th>
                  <th>Phone</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student._id}>
                    <td>{student.name}</td>
                    <td>{student.rollNo}</td>
                    <td>{student.email}</td>
                    <td>{student.course}</td>
                    <td>{student.semester}</td>
                    <td>{student.phone}</td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(student._id, student.name)}
                        disabled={deletingId === student._id}
                      >
                        {deletingId === student._id ? 'Deleting...' : 'Delete'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Students;

