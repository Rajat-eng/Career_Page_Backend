const router=require('express').Router()


const {createCategory,getCategories}=require('../controllers/category');
const {isAuthenticated,authorizeRoles}=require('../middleware/verifyToken')

router.post('/create',isAuthenticated,authorizeRoles("Recruiter"),createCategory);

router.get('/getAll',isAuthenticated,authorizeRoles("Recruiter"),getCategories)


module.exports=router;