const ProfessionalUserModel = require('../Models/prefessionalUserModel');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");

class ProfessionalUserController {
    static createToken(_id) {
        const jwtkey = process.env.JWT_SECRET_KEY;
        return jwt.sign({ _id }, jwtkey, { expiresIn: "3d" });
    }

    static async create(req, res) {
        try {
            const {
                name,
                age,
                gender,
                email,
                profilePicture,
                password,
                expertise,
            } = req.body;

            // Check if user with the provided email already exists
            let existingUser = await ProfessionalUserModel.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ error: "User with the given email already exists." });
            }

            // Validate input fields
            if (!name || !age || !gender || !email || !profilePicture || !password || !expertise) {
                return res.status(400).json({ error: "All fields are required." });
            }

            // Validate email format
            if (!validator.isEmail(email)) {
                return res.status(400).json({ error: "Email must be a valid email address." });
            }

            // Hash the password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Create a new professional user
            const newUser = new ProfessionalUserModel({
                name,
                age,
                gender,
                email,
                profilePicture,
                password: hashedPassword,
                expertise,
            });

            // Save the user to the database
            await newUser.save();

            // Generate token
            const token = ProfessionalUserController.createToken(newUser._id);

            // Send success response
            res.status(200).json({ _id: newUser._id, name, email, token });
        } catch (error) {
            console.error("Error creating professional user:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    };


    static async getAll(req, res) {
        try {
            const professionalUsers = await ProfessionalUserModel.find();
            res.status(200).json({ data: professionalUsers });
        } catch (error) {
            console.error('Error getting professional users:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

   static async getById(req, res) {
        const { id } = req.body;
        try {
            const professionalUser = await ProfessionalUserModel.findById(id);
            if (!professionalUser) {
                return res.status(404).json({ error: 'Professional user not found' });
            }
            res.status(200).json({ data: professionalUser });
        } catch (error) {
            console.error('Error getting professional user by ID:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }


   static async loginUser(req, res) {
        const { email, password } = req.body;

        try {
            let user = await ProfessionalUserModel.findOne({ email });

            if (!user) {
                return res.status(400).json({ error: "Invalid email or password.." });
            }

            const isValidPassword = await bcrypt.compare(password, user.password);

            if (!isValidPassword) {
                return res.status(400).json({ error: "Invalid email or password..." });
            }


            const token = ProfessionalUserController.createToken(user._id);

            res.status(200).json({ _id: user._id, name: user.name, email, token });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Internal server error" });
        }
    }

    static async update(req, res) {
        const { id } = req.body;
        try {
            let professionalUser = await ProfessionalUserModel.findById(id);
            if (!professionalUser) {
                return res.status(404).json({ error: 'Professional user not found' });
            }

            // Update professionalUser object with truthy properties from req.body
            Object.keys(req.body).forEach(key => {
                if (req.body[key]) {
                    professionalUser[key] = req.body[key];
                }
            });

            // Save the updated professionalUser object
            professionalUser = await professionalUser.save();

            res.status(200).json({ message: 'Professional user updated successfully', data: professionalUser });
        } catch (error) {
            console.error('Error updating professional user:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    static async delete(req, res) {
        const { id } = req.params;
        try {
            const deletedProfessionalUser = await ProfessionalUserModel.findByIdAndDelete(id);
            if (!deletedProfessionalUser) {
                return res.status(404).json({ error: 'Professional user not found' });
            }
            res.status(200).json({ message: 'Professional user deleted successfully' });
        } catch (error) {
            console.error('Error deleting professional user:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}

module.exports = ProfessionalUserController;
