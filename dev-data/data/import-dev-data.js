const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('./../../modles/tourModle');
const Review = require('./../../modles/reviewModle');
const User = require('./../../modles/userModle');

// dotenv.config({ path: './config.env' });
dotenv.config({ path: `${__dirname}/../../config.env` });

// Database Connection
const DB = process.env.DATABASE;

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('DB connection successful!');
  })
  .catch((err) => {
    console.error('DB connection error:', err);
  });

// Read JSON File
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8'),
);

// Import data into database
const importData = async () => {
  try {
    await Tour.create(tours);
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews);
    console.log(' Data Loaded');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// Delete All data from collectiom

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log(' Data Deleted');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] == '--import') {
  importData();
} else if (process.argv[2] == '--delete') {
  deleteData();
}


// node dev-data/data/import-dev-data.js --import
// node dev-data/data/import-dev-data.js --delete