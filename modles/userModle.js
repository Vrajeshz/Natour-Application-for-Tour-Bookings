const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');

const schema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, 'Please tell your name'],
  },
  email: {
    type: String,
    require: [true, 'Please provide your Email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid Email'],
  },
  photo: {
    type: String,
    default: 'default.jpg',
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guid', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    require: [true, 'Please provide your password'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    require: [true, 'Please conform your Password'],
    validate: {
      validator: function (el) {
        // Only works on .save() and .create()
        return this.password === el;
      },
      message: 'Passwords do not match',
    },
  },
  passwordChangeAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

schema.pre('save', async function (next) {
  // run only with send() or create()
  // only run this function if password was actually modified
  if (!this.isModified('password')) next();

  // Hash the password with coast 12
  this.password = await bcryptjs.hash(this.password, 12);

  // Delete passwordCOnfirm fields
  this.passwordConfirm = undefined;
  next();
});

schema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangeAt = Date.now() - 1000;
  next();
});

schema.pre(/^find/, function (next) {
  // this point to current query
  this.find({ active: { $ne: false } });
  next();
});

schema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcryptjs.compare(candidatePassword, userPassword);
};

schema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangeAt) {
    const changeTimestamp = parseInt(
      this.passwordChangeAt.getTime() / 1000,
      10,
    );
    return JWTTimestamp < changeTimestamp; // 100 < 200
  }

  // False means not changed
  return false;
};

schema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 Min
  // this.passwordResetExpires = Date.now() + 864000000; // 10 days
  return resetToken;
};

const User = mongoose.model('User', schema);

module.exports = User;
