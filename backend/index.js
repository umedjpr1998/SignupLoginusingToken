const express = require("express");
const cors = require('cors');
require('dotenv').config();
const upload = require('./multerconfig');
const UserModel = require("./usermodel");
const cloudinary = require("./cloudinary");
const connectDB = require('./dbconfig');
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);



const app = express();
app.use(express.json());
app.use(cors());
connectDB();

app.use('/upload', express.static('upload')); // Fixed path to '/uploads'

app.get('/', (req, res) => {
    res.send("Done");
});


app.post('/register', upload.single('profilepic'), async (req, res) => {
    console.log("Register API hitted by user ");

    const { name, email, contact, cpassword, password, bloodgroup, city, address, dob, gender, aadhar, term
    } = req.body;

    const profilepic = req.file;

    // Validate fields
    if (!name) return res.send("First name is required");
    else if (!address) return res.send("Address is required");
    else if (!city) return res.send("City is required");
    else if (!contact) return res.send("Contact is required");
    else if (!dob) return res.send("Date Of Birth is required");
    else if (!bloodgroup) return res.send("Blood group is required");
    else if (!aadhar) return res.send("Aadhar number is required");
    else if (!gender) return res.send("Gender is required");
    else if (!email) return res.send("Email is required");
    else if (!profilepic) return res.send("Profile Image is required");
    else if (!password) return res.send("Password is required");
    else if (!cpassword) return res.send("Confirm Password is required");
    else if (!term) return res.send("You must agree to the terms and conditions");

    let cloudinaryUrl = null;

    // Upload to Cloudinary if file exists
    if (req.file) {
        try {
            const uploadResult = await cloudinary.uploader.upload(req.file.path, {
                folder: 'user_profiles',
            });
            cloudinaryUrl = uploadResult.secure_url;
        } catch (uploadError) {
            console.error("Cloudinary upload failed:", uploadError);
            return res.status(500).json({
                error: "Failed to upload profile picture",
                details: uploadError.message
            });
        }
    } else {
        return res.status(400).json({ error: "Profile picture is required" });
    }


    try {
        const userData = {
            ...req.body,
            profilepic: cloudinaryUrl, // 🔧 Corrected key
            dob: new Date(req.body.dob),
            term: req.body.term === 'true' || req.body.term === true,
        };


        const hash = await bcrypt.hash(password, salt);
        userData.password = hash;

        console.log("User data is ", userData);

        const user = new UserModel(userData);
        await user.save();

        console.log("User data is", user);

        res.status(201).json({ message: 'User registered successfully', user });

    } catch (error) {
        console.error("Error while saving data in MongoDB:", error);
        res.status(500).json({ error: "Internal server error", details: error.message });
    }
});



//Login api
// Add this code alongside your other routes in your backend file

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required." });
        }

        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Invalid credentials." });
        }

        const isMatch = bcrypt.compareSync(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid credentials." });
        }

        const token = jwt.sign({ id: user._id, name: user.name }, JWT_SECRET, { expiresIn: "1h" });

        // Save token in DB (optional: for session tracking)
        user.token = token;
        await user.save();

        res.json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});




app.listen(5000, () => {
    console.log('Server running on http://localhost:5000');
});
