    const { model, Schema } = require('mongoose');

    const ProjectSchema = new Schema({
        category: { type: String },
        cover: { type: String }, // URL for the cover image
        screenshot: { type: String }, // URL for the screenshot image
        title: { type: String },
        description: { type: String },
        client: { type: String },
        projectType: { type: String },
        date: { type: String },
        address: { type: String },
        liveUrl: { type: String },
        features: { type: [String] },
        status:{type:String, default:"Active"}
        
    });

    module.exports = new model("Project", ProjectSchema);



//     import { useState } from 'react';
// import axios from 'axios';

// const ProjectForm = () => {
//   const [formData, setFormData] = useState({
//     category: '',
//     cover: '',
//     screenshot: '',
//     title: '',
//     description: '',
//     client: '',
//     projectType: '',
//     date: '',
//     address: '',
//     liveUrl: '',
//     features: '', // Features as a comma-separated string
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Split the 'features' string into an array
//     const featuresArray = formData.features.split(',').map((feature) => feature.trim());

//     const projectData = {
//       ...formData,
//       features: featuresArray, // Send the features as an array
//     };

//     try {
//       await axios.post('/api/projects', projectData); // Replace with your backend API URL
//       alert('Project added successfully!');
//     } catch (error) {
//       console.error('Error adding project:', error);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <label>
//         Title:
//         <input
//           type="text"
//           name="title"
//           value={formData.title}
//           onChange={handleChange}
//         />
//       </label>
//       <label>
//         Features (comma-separated):
//         <input
//           type="text"
//           name="features"
//           value={formData.features}
//           onChange={handleChange}
//         />
//       </label>
//       {/* Other fields for project data */}
//       <button type="submit">Submit</button>
//     </form>
//   );
// };

// export default ProjectForm;
