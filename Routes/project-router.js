var express = require('express');
var router = express.Router();
var projectController = require('../Controllers/projects-controller');
var authenticateJWT = require('../Middlewares/authenticateMiddleware');
var authorizeRole = require('../Middlewares/authorizationMiddleware');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const multerStorageCloudinary = require('multer-storage-cloudinary');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Set up multer storage with Cloudinary
const storage = multerStorageCloudinary({
    cloudinary: cloudinary,
    folder: 'uploads', // Optional: Folder name in Cloudinary
    allowedFormats: ['jpg', 'png', 'jpeg', 'gif'], // Allowed file formats
    transformation: [
        { width: 800, height: 800, crop: 'limit' } // Optional: Resize images before upload
    ]
});

// Initialize multer with Cloudinary storage
const upload = multer({ storage: storage });

// Route to create a project with file uploads (cover, screenshot)
router.post('/createproject', upload.fields([{ name: 'cover' }, { name: 'screenshot' }]), authenticateJWT, projectController.CreateProject);

// Other routes...
router.get("/projects", authenticateJWT, projectController.GetAllProjects);
router.get("/getSingleProject/:id", authenticateJWT, projectController.getSingleProject);
router.put("/updateproject/:id", upload.fields([{ name: 'cover' }, { name: 'screenshot' }]), authenticateJWT, projectController.updateSpecificProject);
router.put("/activateproject/:id", authenticateJWT, projectController.activateSingleProject);
router.put("/deactivateproject/:id", authenticateJWT, projectController.deactivateSingleProject);
router.get("/activeprojects", authenticateJWT, projectController.getActiveProjects);
router.get("/inactiveprojects", authenticateJWT, projectController.getInactiveProjects);
router.delete("/deleteproject/:id", authenticateJWT, projectController.deleteProject);
router.get("/countallprojects", authenticateJWT, projectController.countAllProjects);
router.get("/countactiveprojects", authenticateJWT, projectController.countActiveProjects);
router.get("/countinactiveprojects", authenticateJWT, projectController.countInActiveProjects);

module.exports = router;
