var mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI).then(() => {
console.log("Database connected")
});
