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
  origin: 'https://trackfolio-194c2.web.app/',  // Allow this origin
  methods: ['GET', 'POST', 'PUT', 'OPTIONS'],  // Allow preflight OPTIONS request
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true  // If your requests include cookies or authentication headers
}));




app.use("/api/auth", authRouter);
app.use("/api/projects", projectRouter);


app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});




