const multer = require('multer');
const Datauri = require('datauri');
const storage = multer.memoryStorage();
const multerUploads = multer({ storage }).single('file');

const dUri = new Datauri();
const dataUri = buffer => dUri.format((new Date().getTime()).toString(), buffer);

module.exports = {
  multerUploads,
  dataUri
};
