const Stall = require("../models/Stall");
const ErrorResponse = require("../utils/errorResponse");
const fs = require("fs");
const path = require("path");

// GETS
// Get All Stalls
exports.getAllStalls = async (req, res, next) => {
  try {
    const stall = await Stall.find({});
    if (stall.length === 0) {
      return next(new ErrorResponse("No stalls exist."));
    }
    res.status(200).json(stall);
  } catch (error) {
    return next(error);
  }
};

// Get all Stalls ascosiated to user
exports.getMyStalls = async (req, res, next) => {
  try {
    const stall = await Stall.find({ user: req.params.userid });
    if (stall.length === 0) {
      return next(new ErrorResponse("No stalls exist for that user."));
    }
    res.status(200).json(stall);
  } catch (error) {
    return next(error);
  }
};

// Get all Stalls ascosiated to user
exports.getStallByID = async (req, res, next) => {
  try {
    const stall = await Stall.find({ _id: req.params.stallid });
    if (stall.length === 0) {
      return next(new ErrorResponse("No stall exists with that stall id."));
    }
    res.status(200).json(stall);
  } catch (error) {
    return next(error);
  }
};

// POSTS
// Add Stall
exports.addNewStall = async (req, res, next) => {
  try {
    const stall = await Stall.findOne({ stallName: req.body.stallName });
    if (stall) {
      return next(
        new ErrorResponse(
          "Stall with this name already exists!, please try another name."
        )
      );
    }
    const stallData = {
      user: req.body.user,
      stallName: req.body.stallName,
      category: req.body.category,
      activated: req.body.activated,
      description: req.body.description ? req.body.description : "",
      image_url: req.file ? req.file.filename : "noimage.png",
      email: req.body.email ? req.body.email : "",
      city_location: req.body.city_location,
    };

    const newStall = await Stall.create(stallData);
    res.status(200).json({
      success: true,
      message: "Stall successfully added.",
      data: newStall,
    });
  } catch (error) {
    return next(error);
  }
};

// PUT
exports.updateStall = async (req, res, next) => {
  const stallID = req.params.stallid;
  const stallData = {
    user: req.body.user,
    stallName: req.body.stallName,
    category: req.body.category,
    activated: req.body.activated,
    description: req.body.description ? req.body.description : "",
    image_url: req.file ? req.file.filename : "noimage.png",
    email: req.body.email ? req.body.email : "",
    city_location: req.body.city_location,
  };

  try {
    await Stall.findByIdAndUpdate(stallID, stallData);
    res.status(200).json({
      success: true,
      message: `Stall with the ID: ${stallID}, was successfully updated.`,
      data: stallData,
    });
  } catch (error) {
    return next(error);
  }
};

// DELETE
// delete stall by stall id
exports.deleteStallByID = async (req, res, next) => {
  try {
    await Stall.deleteOne({ _id: req.params.stallid });
    if (req.body.image !== "noimage.jpg") {
      await fs.unlink(
        path.resolve(`../server/public/images/stalls/${req.body.image}`),
        (err) => {
          if (err) next(err);
        }
      );
    }
    res.status(200).json({
      success: true,
      message: `Successfullt removed stall with stall id: ${req.params.stallid}`,
    });
  } catch (error) {
    next(error);
  }
};
