const express = require('express');
const router = express.Router();
const { addStudent, getStudents } = require('../controllers/studentController');

// GET /api/students - Fetch all students
router.get('/', getStudents);

// POST /api/students - Add a new student
router.post('/', addStudent);

module.exports = router;

