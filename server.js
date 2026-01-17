const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const mongoose = require('mongoose');

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION!!! 💥 Shutting down...');
  process.exit(1);
});

const app = require('./app');
const port = process.env.PORT || 3000;

// Database Connection
const DB = process.env.DATABASE;

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('DB connection successful!');
  });
// .catch((err) => {
//   console.error('DB connection error:', err);
// });

const server = app.listen(port, () => {
  console.log(`App running on Port ${port}`);
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION!!! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close((err) => {
    process.exit(1);
  });
});
