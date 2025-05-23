const uploadCound = require("../helpers/uploadCloud");

module.exports.uploadCloudinary = async (req, res, next) => {
  // Upload an image
  if (req.file) {
    //CHU Y DOAN NEXT
    const result = await uploadCound.upload(req.file.buffer);
    req.body[req.file.fieldname] = result.url;
  }
  next();
};
