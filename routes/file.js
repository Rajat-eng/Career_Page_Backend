const router = require('express').Router();
const fileUploadController = require('../controllers/fileUploadController');
const { multerUploads } = require('../utils/multer');

router.post('/upload',  multerUploads,  fileUploadController.fileUpload);
router.post('/delete',   fileUploadController.deleteMedia);



module.exports = router;