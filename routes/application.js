const router=require('express').Router()

const {isAuthenticated,authorizeRoles}=require('../middleware/verifyToken')
const {scheduleInterview,getApplications,applicationStatus,getMyApplications}=require('../controllers/application');
//schedule an interview

router.route('/schedule/:id').post(isAuthenticated,authorizeRoles("Recruiter"),scheduleInterview);

router.route('/find').get(
    isAuthenticated,
    authorizeRoles("Recruiter"),
    getApplications
);

router.route('/myapplication').get(isAuthenticated,authorizeRoles("Applicant"),getMyApplications);

router.route("/status/:id").put(isAuthenticated,authorizeRoles("Recruiter"),applicationStatus);

module.exports=router;