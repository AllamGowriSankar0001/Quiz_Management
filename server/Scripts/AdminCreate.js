const Admin = require('../Models/AdminModel');
const bcrypt = require("bcrypt");

const createAdmin = async () => {
  try {
    const email = "admin@gmail.com";
    const password = "ADMINPASSWORD";

    
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      console.log("Admin already exists");
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await Admin.create({
      email,
      password:hashedPassword,
      role: "Admin"
    });

    console.log("Admin created successfully");
  } catch (err) {
    console.error("Admin creation failed:", err.message);
  }
};

module.exports = createAdmin;
