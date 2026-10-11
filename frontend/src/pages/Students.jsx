
import React, { useState, useEffect } from 'react';
import api from '../services/api';

const emptyForm = {
  name: '',
  rollNo: '',
  email: '',
  course: '',
  semester: '',
  phone: ''
};

function Students() {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Get students from the backend
  const fetchStudents = async () => {
    try {
      const response = await api.get('/students');
      setStudents(response.data.data);
    } catch (err) {
      setError('Could not load students');
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Update form values when typing
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Open the form with existing student details
  const handleEdit = (student) => {
    setEditId(student._id);

    setFormData({
      name: student.name,
      rollNo: student.rollNo,
      email: student.email,
      course: student.course,
      semester: student.semester,
      phone: student.phone
    });

    setMessage('');
    setError('');
  };

  // Cancel editing
  const handleCancel = () => {
    setEditId(null);
    setFormData(emptyForm);
    setMessage('');
    setError('');
  };

  // Add or update a student
  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage('');
    setError('');

    try {
      let response;

      if (editId) {
        // Update the selected student
        response = await api.put(
          `/students/${editId}`,
          formData
        );
      } else {
        // Add a new student
        response = await api.post('/students', formData);
      }

      setMessage(response.data.message);

      setFormData(emptyForm);
      setEditId(null);

      // Refresh the student list
      await fetchStudents();
    } catch (err) {
      setError(
        err.response?.data?.message || 'Something went wrong'
      );
    }
  };

  return (
    <div className="page-container">
      <div className="card">
        <h2>{editId ? 'Edit Student' : 'Add New Student'}</h2>

        {message && (
          <div className="alert alert-success">{message}</div>
        )}

        {error && (
          <div className="alert alert-error">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="student-form">
          <div className="form-group">
            <label>Full Name *</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Roll Number *</label>
            <input
              name="rollNo"
              value={formData.rollNo}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email Address *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Course *</label>
            <input
              name="course"
              value={formData.course}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Semester *</label>
            <input
              name="semester"
              value={formData.semester}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Phone Number *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary">
            {editId ? 'Update Student' : 'Add Student'}
          </button>

          {editId && (
            <button
              type="button"
              className="btn"
              onClick={handleCancel}
            >
              Cancel
            </button>
          )}
        </form>
      </div>

      <div className="card" style={{ marginTop: '24px' }}>
        <h2>Student List</h2>

        {students.length === 0 ? (
          <p>No students found.</p>
        ) : (
          students.map((student) => (
            <div
              key={student._id}
              style={{
                borderBottom: '1px solid #ddd',
                padding: '16px 0'
              }}
            >
              <h3>{student.name}</h3>
              <p>Roll Number: {student.rollNo}</p>
              <p>Email: {student.email}</p>
              <p>Course: {student.course}</p>
              <p>Semester: {student.semester}</p>
              <p>Phone: {student.phone}</p>

              <button
                className="btn btn-primary"
                onClick={() => handleEdit(student)}
              >
                Edit
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Students;
