const express = require('express');
const router = express.Router();
const homecontroller = require('../controllers/home');
const usercontroller = require('../controllers/user');
const jobcontroller = require('../controllers/job');
const { upload } = require('../middleware/multer');
const passport = require('passport');
const { checkAuth, checkNotAuth } = require('../middleware/checkAuth');

//home page
router.get('/', checkNotAuth, homecontroller.index);
router.get('/sign-up/:value', checkNotAuth, homecontroller.signup);
router.get('/signin', checkNotAuth, homecontroller.signin);
router.post('/signin', passport.authenticate('local', { successRedirect: '/login', failureRedirect: '/signin', failureFlash: true }));
router.get('/about', checkNotAuth, homecontroller.about);
router.get('/search', checkNotAuth, homecontroller.search);

//user routes
router.post('/createStudent', checkNotAuth, usercontroller.createStudent);
router.post('/createRecruiter', checkNotAuth, usercontroller.createRecruiter);
router.get('/login', checkAuth, usercontroller.login);

//job routes
router.post('/post-job', checkAuth, jobcontroller.postJob);
router.post('/apply-job/:id', checkAuth, jobcontroller.applyJob);
router.get('/apply-search', checkAuth, jobcontroller.applySearch);
router.get('/post-search', checkAuth, jobcontroller.postSearch);

router.get('/jobs/:id', checkNotAuth, jobcontroller.jobs);
router.get('/recruiterjobs/:id', checkAuth, jobcontroller.jobsForRecruiter);
router.get('/studentjobs/:id', checkAuth, jobcontroller.jobsForApplier);
module.exports = router;