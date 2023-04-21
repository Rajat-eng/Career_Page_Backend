const router=require('express').Router();
const upload = require("../utils/multer");

const {getJob,deleteJob, postJob,applyJob,updateJob,getSingleJob}=require('../controllers/jobs')

const {isAuthenticated,authorizeRoles}=require('../middleware/verifyToken');

// post job
router.route('/post').post(postJob); // authRecruiter

// find jobs
router.route('/find').get(getJob);

// find single job
router.route('/:id').get(getSingleJob);

// delete job
router.route('/delete/:id').delete(isAuthenticated,authorizeRoles("Recruiter"),deleteJob);

// apply job
router.route('/apply/:id').post(isAuthenticated,authorizeRoles("Applicant"),applyJob);

// update job
router.route('/update/:id').put(isAuthenticated,authorizeRoles("Recruiter"),updateJob);


module.exports=router;