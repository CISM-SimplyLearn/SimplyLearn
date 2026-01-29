const express = require('express');
const router = express.Router();
const { enrollCourse, getMyEnrollments, checkEnrollment } = require('../controllers/enrollmentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, enrollCourse);
router.get('/my', protect, getMyEnrollments);
router.get('/check/:courseId', protect, checkEnrollment);

module.exports = router;
