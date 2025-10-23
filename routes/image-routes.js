const express = require("express");
const authMiddleware = require("../middleware/auth-middleware");
const adminMiddleware = require("../middleware/admin-middleware");
const uploadMiddleware = require("../middleware/upload-middleware");

const { uploadImageController, fetchImagesController, deleteImageController } = require("../controllers/image-controller");
const router = express.Router();

// upload the image
router.post(
  "/upload",
  authMiddleware,
  adminMiddleware,
  uploadMiddleware.single("image"), // uplading single file (Check restrictions of an file ( fileType, fileSize, create file name, upload destination in our folder))
  uploadImageController // store the file in our database
);

// to get all the images
router.get('/get', authMiddleware, fetchImagesController);

// delete image 
router.delete('/delete/:id', authMiddleware, adminMiddleware, deleteImageController)
module.exports = router;
