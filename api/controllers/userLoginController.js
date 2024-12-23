const User = require('../models/User');
const Student = require('../models/Student');
const Company = require('../models/Company');
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user || user.password !== password) {
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
            user: user._id,
        });
    } else if (role === 'Company') {
        await Company.create({
            user: user._id,
        });
    } else if (role === 'Admin') {
        await Admin.create({
            user: user._id,
        });
    } else {
        return res.status(400).json({ message: 'Invalid role specified.' });
    }

      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };