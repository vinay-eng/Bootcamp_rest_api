const express = require('express');
const router = express.Router({mergeParams:true});
const {protect} = require('../middleware/auth');

const {getCourses,getCourse,addCourse} = require('../controllers/course');

router.route('/').get(getCourses);
router.route('/:id').get(getCourse).post(protect,addCourse);
module.exports = router;
