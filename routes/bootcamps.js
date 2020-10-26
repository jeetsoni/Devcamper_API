const express = require('express');

const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsInRadius,
  bootcampPhotoUpload,
} = require('../controllers/bootcamps');
const { getCourses, addCourse } = require('../controllers/courses');
const {
  getReviews, addReview
 } = require('../controllers/reviews');
const Bootcamp = require('../models/Bootcamp');


//Include other resoursce routers
const CourseRouter = require('./courses');
const reviewRouter = require('./reviews');

const router = express.Router();

const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

//Re-route into other resource routers
// router.use('/:bootcampId/courses', CourseRouter);
// router.use('/:bootcampId/reviews', reviewRouter);
router
  .route('/:bootcampId/courses')
  .get(getCourses)
  .post(protect, authorize('publisher', 'admin'), addCourse);

router.route('/:bootcampId/reviews').get(getReviews).post(protect,authorize('user', 'admin') , addReview)

router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);

router
  .route('/:id/photo')
  .put(protect, authorize('publisher', 'admin'), bootcampPhotoUpload);

router
  .route('/')
  .get(advancedResults(Bootcamp, 'courses'), getBootcamps)
  .post(protect, authorize('publisher', 'admin'), createBootcamp);

router
  .route('/:id')
  .get(getBootcamp)
  .put(protect, authorize('publisher', 'admin'), updateBootcamp)
  .delete(protect, authorize('publisher', 'admin'), deleteBootcamp);

module.exports = router;
