const mongoose = require('mongoose');

// Connecting to the MongoDB using Mongoose
// The 'process.env.MONGODB_URI' allows connection to a remote DB specified in an env (like on a deployment platform)
// If 'process.env.MONGODB_URI' is not set, it will use a local MongoDB instance at 'mongodb://localhost/googlebooks'
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/googlebooks', {
  useNewUrlParser: true,        // Parse connection strings using the MongoDB driver's URL parser
  useUnifiedTopology: true,    // Use the new MongoDB driver's engine
});

// Exporting the Mongoose connection object
module.exports = mongoose.connection;