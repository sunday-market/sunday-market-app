const Stall = require("../models/Stall");
const ErrorResponse = require("../utils/errorResponse");

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
    const newStall = await Stall.create(req.body);

    res.status(200).json({
      success: true,
      data: newStall,
    });
  } catch (error) {
    return next(error);
  }
};

// PUT
exports.updateStall = async (req, res, next) => {
  const stallID = req.params.stallid;
  const data = req.body;
  try {
    // check that no stall with the same name exists
    const stall = await Stall.findOne({ stallName: req.body.stallName });
    if (stall && stall._id.toString() !== stallID) {
      return next(
        new ErrorResponse(
          "Stall with this name already exists!, please try another name."
        )
      );
    }
    await Stall.findByIdAndUpdate(stallID, data);
    res.status(200).json({
      success: true,
      message: `Stall with the ID: ${stallID}, was successfully updated.`,
      data: data,
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
    res.status(200).json({
      success: true,
      message: `Successfullt removed stall with stall id: ${req.params.stallid}`,
    });
  } catch (error) {
    next(error);
  }
};
