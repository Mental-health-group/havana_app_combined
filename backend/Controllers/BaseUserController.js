const userModel = require("../Models/BaseUser");
const bcrypt = require("bcrypt");
const validator = require("validator"); // Import validator library
const jwt = require("jsonwebtoken");
const ProfessionalUserModel = require("../Models/prefessionalUserModel");

class UserController {
  static createToken(_id) {
    const jwtkey = process.env.JWT_SECRET_KEY;
    return jwt.sign({ _id }, jwtkey, { expiresIn: "3d" });
  }

  static async registerUser(req, res) {
    try {
      const { name, age, gender, email, profilePicture, password, anonymous } = req.body;

      let user = await userModel.findOne({ email });

      if (user)
        return res.status(400).json({ error: "User with the given email already exists..." });

      if (!name || !age || !gender || !email || !password)
        return res.status(400).json({ error: "All fields are required..." });

      if (!validator.isEmail(email)) // Validate email
        return res.status(400).json({ error: "Email must be a valid email address..." });

      user = new userModel({ name, age, gender, email, profilePicture, password, anonymous});

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);

      await user.save();

      const token = UserController.createToken(user._id);

      res.status(200).json({ _id: user._id, name, email, token });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async loginUser(req, res) {
    const { email, password } = req.body;

    try {
      let user = await userModel.findOne({ email });

      if (!user) return res.status(400).json({ error: "Invalid email or password.." });

      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword)
        return res.status(400).json({ error: "Invalid email or password..." });

      const token = UserController.createToken(user._id);

      res.status(200).json({ _id: user._id, name: user.name, email, token });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async findUser(req, res) {
    const {_id} = req.body;
    try {
      const user = await userModel.findById(_id);
      if (!user) return res.status(404).json({ error: "User not found" });
      res.status(200).json(user);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async getUsers(req, res) {
    try {
      const users = await userModel.find();
      res.status(200).json(users);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
  static async update(req, res) {
    const { _id } = req.body;
    try {
      let user = await userModel.findById(_id);
      if (!user) {
        return res.status(404).json({ error: 'Basic User Not Found' });
      }

      // Update professionalUser object with truthy properties from req.body
      Object.keys(req.body).forEach(key => {
        if (req.body[key]) {
          user[key] = req.body[key];
        }
      });

      // Save the updated professionalUser object
      user = await user.save();

      res.status(200).json({ message: 'Professional user updated successfully', data: professionalUser });
    } catch (error) {
      console.error('Error updating professional user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = UserController;
