const axios = require("axios");
const ProjectModel = require("../models/ProjectModel.js");
const path = require("path");
const fs = require("fs");
const FormData = require("form-data"); // Import FormData

// Global variables
const activeStatus = "Active";
const inactiveStatus = "In-Active";

// Function to upload image to ImgBB
const uploadImageToImgBB = async (imagePath) => {
  try {
    // Ensure the image file exists
    if (!fs.existsSync(imagePath)) {
      throw new Error("File not found at path: " + imagePath);
    }

    const formData = new FormData();
    const file = fs.createReadStream(path.resolve(imagePath));
    formData.append("image", file);

    // Perform the image upload request
    const response = await axios.post(
      "https://api.imgbb.com/1/upload?expiration=600&key=adce5d9026cd006ed040c469a3200ae6",
      formData,
      {
        headers: formData.getHeaders(), // Automatically set correct headers for multipart/form-data
      }
    );

    if (response.data.success) {
      return response.data.data.url;
    } else {
      console.error("ImgBB Error:", response.data.error);
      throw new Error("Image upload failed: " + response.data.error.message);
    }
  } catch (error) {
    console.error(
      "Error uploading image:",
      error.response ? error.response.data : error
    );
    throw new Error("Image upload failed");
  }
};

// Create project API
const CreateProject = async (req, res) => {
  try {
    // Validate if the files are provided and handle accordingly
    let coverUrl =
      req.files && req.files.cover
        ? await uploadImageToImgBB(req.files.cover[0].path)
        : null;
    let screenshotUrl =
      req.files && req.files.screenshot
        ? await uploadImageToImgBB(req.files.screenshot[0].path)
        : null;

    const newProject = await ProjectModel.create({
      ...req.body,
      cover: coverUrl,
      screenshot: screenshotUrl,
    });

    return res.json({
      message: "Project created successfully",
      projectData: newProject,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

// Get all projects API
const GetAllProjects = async (req, res) => {
  try {
    const allProjects = await ProjectModel.find();
    if (!allProjects) {
      return res.json({ message: "No projects found" });
    }
    return res.json({
      message: "Here are all the projects",
      projectData: allProjects,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

// Update specific project API
const updateSpecificProject = async (req, res) => {
  try {
    console.log('Request body:', req.body);
    console.log('Uploaded files:', req.files);

    let coverUrl =
      req.files && req.files.cover
        ? await uploadImageToImgBB(req.files.cover[0].path)  
        : req.body.cover; 

    let screenshotUrl =
      req.files && req.files.screenshot
        ? await uploadImageToImgBB(req.files.screenshot[0].path)  
        : req.body.screenshot;
    const updatedProject = await ProjectModel.findByIdAndUpdate(
      req.params.id,
      { ...req.body, cover: coverUrl, screenshot: screenshotUrl }, // Update project with new data
      { new: true }  // Return the updated document
    );

    // Return the updated project as a response
    return res.json({
      message: "Project updated successfully",
      projectData: updatedProject,
    });
  } catch (error) {
    // Log and return any errors
    console.error('Error updating project:', error);
    return res.status(500).json({ message: "Update failed", error });
  }
};


// Activate Projects API
const activateSingleProject = async (req, res) => {
  try {
    const specificProjectId = req.params.id;
    const specificProject = await ProjectModel.findById(specificProjectId);

    if (!specificProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (specificProject.status === activeStatus) {
      return res.json({ message: "This project is already active" });
    }

    const statusActivation = await ProjectModel.findByIdAndUpdate(
      specificProjectId,
      { status: activeStatus },
      { new: true }
    );
    if (statusActivation) {
      return res.json({
        message: "This project has been activated",
        data: statusActivation,
      });
    }
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

// Deactivate project API
const deactivateSingleProject = async (req, res) => {
  try {
    const specificProjectId = req.params.id;
    const specificProject = await ProjectModel.findById(specificProjectId);

    if (!specificProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (specificProject.status === inactiveStatus) {
      return res.json({ message: "This project is already In-Active" });
    }

    const statusDeactivation = await ProjectModel.findByIdAndUpdate(
      specificProjectId,
      { status: inactiveStatus },
      { new: true }
    );
    if (statusDeactivation) {
      return res.json({
        message: "This project has been deactivated",
        data: statusDeactivation,
      });
    }
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

// Get all active projects API
const getActiveProjects = async (req, res) => {
  try {
    const projects = await ProjectModel.find({ status: activeStatus });
    if (!projects || projects.length === 0) {
      return res.json({
        message: "No active projects found",
        projectData: projects,
      });
    }
    return res.json({
      message: "Here are the active projects",
      projectData: projects,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

// Get all inactive projects
const getInactiveProjects = async (req, res) => {
  try {
    const inactiveProjects = await ProjectModel.find({
      status: inactiveStatus,
    });
    if (!inactiveProjects || inactiveProjects.length === 0) {
      return res.json({
        message: "No inactive projects found",
        projectData: inactiveProjects,
      });
    }
    return res.json({
      message: "Here are the inactive projects",
      projectData: inactiveProjects,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

// Delete project API
const deleteProject = async (req, res) => {
  try {
    const projectId = req.params.id;
    const removeProject = await ProjectModel.findByIdAndDelete(projectId);
    if (!removeProject) {
      return res.status(404).json({ message: "Project not found" });
    }
    return res.json({ message: "Project has been deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

// Count All Projects API

const countAllProjects = async (req, res) => {
  try {
    const countAll = await ProjectModel.countDocuments();
    console.log(countAll)
    return res.status(200).json({ message: "All projects count", count: countAll });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", error: error });
  }
}

// Count Active Projects API

const countActiveProjects = async (req, res) => {
  try {
    const countActive = await ProjectModel.countDocuments({ status: activeStatus });
    console.log(countActive)
    return res.status(200).json({ message: "All active projects count", count: countActive });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", error: error });
  }
}

// Count Active Projects API

const countInActiveProjects = async (req, res) => {
  try {
    const countInActive = await ProjectModel.countDocuments({ status: inactiveStatus });
    console.log(countInActive)
    return res.status(200).json({ message: "All inactive projects count", count: countInActive });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", error: error });
  }
}

const getSingleProject = async (req, res) => {
  try {
    const getProject = await ProjectModel.find({ _id: req.params.id });
    if (!getProject) {
      res.status(500).json({ message: "Project not found" });
    }

    return res.status(200).json({ message: "Here are the project details", project: getProject });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });

  }
}


module.exports = {
  CreateProject,
  GetAllProjects,
  updateSpecificProject,
  activateSingleProject,
  deactivateSingleProject,
  getActiveProjects,
  getInactiveProjects,
  deleteProject,
  countAllProjects,
  countActiveProjects,
  countInActiveProjects,
  getSingleProject
};
