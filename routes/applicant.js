const express = require("express");
const router = express.Router();
const {isAuthenticated, isApplicant, authorizeRoles}=require('../middleware/verifyToken');

const { register, update, login, deleteApplicant,deleteApplication, sendCode, } = require("../controllers/applicant");

router.route("/register").post(
  register
);

router.route("/sendCode").post(sendCode)

router.route('/login').post(login)


router.route("/upload").post(
  isAuthenticated,
  authorizeRoles("Applicant"),
  update
);

// applicant deletes himself
router.route("/delete/:id").delete(isAuthenticated,authorizeRoles("Applicant"),deleteApplicant)

// applicant deletes his/her application
router.route('/deleteApplication/:id').delete(isAuthenticated,authorizeRoles(["Applicant","Recruiter"]),deleteApplication)


module.exports = router;
