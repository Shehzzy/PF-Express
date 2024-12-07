var express = require('express');
var router = express.Router();
var projectController = require('../Controllers/projects-controller');
var authenticateJWT = require('../Middlewares/authenticateMiddleware');
var authorizeRole = require('../Middlewares/authorizationMiddleware');
const multer = require('multer');
const path = require('path');

// Define where to store the uploaded files
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Store files in 'uploads' folder
    },
    filename: (req, file, cb) => {      
        // Use the original file extension based on the MIME type
        const fileExtension = path.extname(file.originalname) || '.jpg'; // Default to .jpg if no extension
        cb(null, Date.now() + '-' + file.fieldname + fileExtension); // Name the file with a unique timestamp and original extension
    }
});

const upload = multer({ storage: storage });

// In your route
router.post('/createproject', upload.fields([{ name: 'cover' }, { name: 'screenshot' }]), authenticateJWT, projectController.CreateProject);

router.get("/projects", authenticateJWT, projectController.GetAllProjects);
router.get("/getSingleProject/:id", authenticateJWT, projectController.getSingleProject);
router.put("/updateproject/:id" , upload.fields([{ name: 'cover' }, { name: 'screenshot' }]), authenticateJWT, projectController.updateSpecificProject);
router.put("/activateproject/:id", authenticateJWT, projectController.activateSingleProject);
router.put("/deactivateproject/:id", authenticateJWT, projectController.deactivateSingleProject);
router.get("/activeprojects", authenticateJWT, projectController.getActiveProjects);
router.get("/inactiveprojects", authenticateJWT, projectController.getInactiveProjects);
router.delete("/deleteproject/:id", authenticateJWT, projectController.deleteProject);
router.get("/countallprojects", authenticateJWT, projectController.countAllProjects);
router.get("/countactiveprojects", authenticateJWT, projectController.countActiveProjects);
router.get("/countinactiveprojects", authenticateJWT, projectController.countInActiveProjects);




module.exports = router;


