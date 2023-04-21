const {
  uploadToCloudinary,
  deleteFromCloudinary,
  deleteVideoFromCloudinary,
} = require("../services/cloudinaryUploadService");

let fileUploadController = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(404).json({
        success: false,
        message: "file required",
      });
    }
    if (req.file.buffer) {
      console.log("buffer exists for length - ", req.file.buffer.length);
    }
    let result = await uploadToCloudinary(req.file.buffer);
    
    if (result.url) {
      return res.status(200).json({
        success: true,
        result,
        message: "upload successful",
      });
    }

    return res.status(404).json({
      success: false,
      message: "upload failed",
    });
  } catch (error) {
    console.log("upload server error", error);
    return res.status(500).json({
      success: false,
      message: "upload failed - server error",
    });
  }
};

let deleteMediaController = async (req, res) => {
  if (!req.body.publicId) {
    return res.status(404).json({
      success: false,
      message: "file id required",
    });
  }

  let result;

  if (req.body.media_type.toLowerCase() === "video") {
    result = await deleteVideoFromCloudinary(
      req.body.publicId,
      req.body.media_type
    );
  } else {
    result = await deleteFromCloudinary(req.body.publicId);
  }
  if (result) {
    console.log({
      msg: `deletion result is ${result}`,
    });
    return res.status(200).json({
      success: true,
      result,
      message: "delete successful",
    });
  }

  return res.status(404).json({
    success: false,
    message: "delete failed",
  });
};



module.exports = {
  fileUpload: fileUploadController,
  deleteMedia: deleteMediaController,
};
