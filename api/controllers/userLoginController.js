const User = require("../models/userSchema")
const Student = require('../models/studentSchema');
const Company = require('../models/companySchema');
const Admin = require('../models/adminSchema');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); 


exports.login = async (req, res) => {
    const { email, password } = req.body;
    console.log(email, password); 
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid user' });
        }
        if ( !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate token
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        // Fetch additional role-specific data
        let userDetails;
        if (user.role === 'Student') {
            userDetails = await Student.findOne({ user: user._id });
        } else if (user.role === 'Company') {
            userDetails = await Company.findOne({ user: user._id });
        } else if (user.role === 'Admin') {
            userDetails = await Admin.findOne({ user: user._id });
        }

        res.status(200).json({ token, role: user.role, userDetails });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// User Signup
exports.signup = async (req, res) => {
    try {
      const {name, email, password ,role} = req.body;
  
      const userExists = await User.findOne({ email });
      if (userExists) return res.status(400).json({ message: 'User already exists' });
      
      const newUser = new User({ name, email, password ,role });
      await newUser.save();

      // Role-Specific Data Creation
      if (role === 'Student') {
        await Student.create({
            user: newUser._id,
        });
    } else if (role === 'Company') {
        await Company.create({
            user: newUser._id,
        });
    } else if (role === 'Admin') {
        await Admin.create({
            user: newUser._id,
        });
    } else {
        return res.status(400).json({ message: 'Invalid role specified.' });
    }

      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };