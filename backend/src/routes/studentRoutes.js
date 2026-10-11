const express = require('express');
const router = express.Router();
const { addStudent, getStudents } = require('../controllers/studentController');
const { protect } = require('../middleware/authMiddleware');

// GET /api/students - Fetch all students
router.get('/', getStudents);

// POST /api/students - Add a new student (Protected: Requires login)
router.post('/', protect, addStudent);

module.exports = router;

