const Review = require('./../modles/reviewModle');
const factory = require('./../controller/handlerFactory');
// const catchAsync = require('./../utils/catchAsync');
// const AppError = require('./../utils/appError');

exports.setTourUserId = (req, res, next) => {
  // Allow nestes route
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getAllReview = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
