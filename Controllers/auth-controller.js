var User = require("../Models/UserModel");
var jwt = require("jsonwebtoken");

// ADMIN registration API - Not for consuming
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.json({ message: "User already exists." });
    }
    const userCount = await User.countDocuments(); // Counts the number of users

    if (userCount > 0) {
      return res.json({
        message: "Only one user can be registered in this application",
      });
    }
    const userCreate = await User.create({ name, email, password });
    const token = jwt.sign(
      {
        userId: userCreate._id,
        email: userCreate.email,
        role: userCreate.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res
      .status(200)
      .json({ token, message: "User has been registered successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

//ADMIN LOGIN API
const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.json({ message: "Invalid credentials" });
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.json({ message: "Invalid credentials" });
  }
  const token = jwt.sign(
    { userId: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return res.json({ token });
};

// ADMIN PROFILE API - currently no use
const admin = async (req, res) => {
  try {
    const findAdmin = await User.findOne({ _id: req.user.userId });
    if (!findAdmin) {
      return res.json({ message: "No admin was found" });
    }

    var adminData = { name: findAdmin.name, email: findAdmin.email };
    return res.json({
      message: "Here is the admin data",
      adminData: adminData,
    });
  } catch (error) {
    return res.json({ mesage: "Server error", error });
  }
};

//USER PROFILE API = currently no use
const simpleUser = async (req, res) => {
  try {
    const findUser = await User.findOne({ _id: req.user.userId });
    if (!findUser) {
      return res.json({ message: "No user was found" });
    }
    const userData = { name: findUser.name, email: findUser.email };
    return res.json({ message: "Here is the user data", userData: userData });
  } catch (error) {
    return res.json({ message: "Server error", error });
  }
};

module.exports = { register, login, admin, simpleUser };
