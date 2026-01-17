const express = require('express');
const userController = require('./../controller/userControllers');
const authController = require('./../controller/authController');

const route = express.Router();

route.post('/signup', authController.signup);
route.post('/login', authController.login);
route.get('/logout', authController.logout);

route.post('/forgetPassword', authController.forgotPassword);
route.patch('/resetPassword/:token', authController.resetPassword);

// Protect all route after this middleware
route.use(authController.protect);

route.patch('/updateMyPassword', authController.updatePassword);
route.get('/me', userController.getMe, userController.getUser);
route.patch(
  '/updateMe',
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe,
);
route.delete('/deleteMe', userController.deleteMe);

// Admin Protected Route
route.use(authController.restrictTo('admin'));

route
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

route
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = route;
