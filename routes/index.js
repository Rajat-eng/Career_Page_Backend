const router=require('express').Router()

const {isAuthenticated}=require('../middleware/verifyToken');
const {getProfile,logout}=require('../controllers/index');


const applicantRoute=require('./applicant');
const jobRoute=require('./jobs');
const recruiterRoute=require('./recruiter');
const applicationRoute=require('./application');
const fileRoute=require('./file');
const categoryRoute=require('./category')

router.use('/applicant',applicantRoute);
router.use('/job',jobRoute);
router.use('/recruiter',recruiterRoute);
router.use('/application',applicationRoute);
router.use('/category',categoryRoute);
router.use('/file',fileRoute);

// get profile of logged in user
router.route('/getme').get(isAuthenticated,getProfile);

// logout
router.route('/logout').post(logout)

module.exports=router