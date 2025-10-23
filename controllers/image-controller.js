const { uploadToCloudinary } = require("../helpers/cloudinaryHelper");
const Image = require("../models/Image");
const fs = require("fs");
const cloudinary = require('../config/cloudinary')

const uploadImageController = async (req, res) => {
  try {
    // check if file is missing in req object
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "File is required. Please upload an image",
      });
    }

    // upload to cloudinary
    const { url, publicId } = await uploadToCloudinary(req.file.path);

    // store the iamge url and public id along with the uploaded user id in database
    const newlyUploadedImage = new Image({
      url,
      publicId,
      uploadedBy: req.userInfo.userId,
    });

    await newlyUploadedImage.save();

    // delete the file from local storage
    fs.unlinkSync(req.file.path); // if you want to remove the image in local after uploading in cloudinary1

    res.status(201).json({
      success: true,
      message: "Image Uploaded Successfully!",
      image: newlyUploadedImage,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong! Please try again",
    });
  }
};

const fetchImagesController = async (req, res) => {
  try {
    const currentPage = parseInt(req.query.page) || 1; // currentPage
    const limit = parseInt(req.query.limit) || 3; // oru page la katta vendiya data
    const skip = (currentPage - 1) * limit;

    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder ==='asc' ? 1 : -1;
    const totalImages = await Image.countDocuments();

    const totalPages = Math.ceil(totalImages/limit); // calculate total pages (totalCount/singlePageLimit)
    const sortObj = {};
    sortObj[sortBy] = sortOrder
    const images = await Image.find().sort(sortObj).skip(skip).limit(limit);
    if (images) {
      res.status(200).json({
        success: true,
        currentPage,
        totalPages,
        totalImages,
        data: images,   
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong! Please try again",
    });
  }
};

const deleteImageController = async (req, res) => {
  try {
      const getCurrentIdOfImageToBeDeleted = req.params.id;
      const userId = req.userInfo.userId;
      const image = await Image.findById(getCurrentIdOfImageToBeDeleted);
      if(!image){
        return res.status(404).json({
           success: false,
           message: 'Image not found.'
        })
      }
      //Check if this image is uploaded by the current user who is trying to delete this image
      if(image.uploadedBy.toString() !== userId){
        return res.status(403).json({
          success: false,
          message : `You're are not authorized to delete this image because you haven't uploaded it`
        })
      }

      // delete this image first from your cloudinary storage
    await cloudinary.uploader.destroy(image.publicId);  // publicId is used to delete cloudinary

    // delete this image from mongodb database
    await Image.findByIdAndDelete(getCurrentIdOfImageToBeDeleted); // _id is used to delete database

    res.status(200).json({
      success: true,
      message: 'Image deleted successfully!'
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong! Please try again",
    });
  }
};

module.exports = {
  uploadImageController,
  fetchImagesController,
  deleteImageController
};
