var express = require('express');
var app = express();
var bodyParser = require('body-parser');
require('dotenv').config();
require('./utils/connection.js');
var authRouter = require('./Routes/auth-router.js');
var projectRouter = require('./Routes/project-router.js');
app.use(bodyParser.json());
app.use(express.json());
const cors = require('cors');
app.use(cors({
    origin: 'https://trackfolio-5otd3zr5e-shehzonias-projects.vercel.app',
    methods: ['GET', 'POST', 'PUT'], // Adjust methods as needed
    allowedHeaders: ['Content-Type', 'Authorization']
}));



app.use("/api/auth", authRouter);
app.use("/api/projects", projectRouter);


app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});




