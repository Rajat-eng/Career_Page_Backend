const cloudinary = require("cloudinary").v2;
const { dataUri } = require("../utils/multer");

uploadToCloudinary = (buffer) => {
  const file = dataUri(buffer);
  return cloudinary.uploader
    .upload(file.content, {resource_type: 'auto'})
    .then((result) => {
      return result;
    })
    .catch((error) => {
      console.log({
        msg: `Cloudinary upload error ${error.message}`,
        action: "Cloudinary upload error",
      });
      return error;
    });
};

deleteFromCloudinary = (publicId) => {
  return cloudinary.uploader
  .destroy(publicId, function(error,result) {
    console.log(result, error);
    if(result) {
      return result;
    }

  });
};

deleteVideoFromCloudinary = (publicId, resource_type) => {
  if(resource_type.toLowerCase() === 'video') {
    return cloudinary.uploader
  .destroy(publicId, {resource_type: 'video'}, function(error,result) {
    console.log(result, error);
    if(result) {
      return result;
    }
  });
  }
};

module.exports = {
  uploadToCloudinary,
  deleteFromCloudinary,
  deleteVideoFromCloudinary
};