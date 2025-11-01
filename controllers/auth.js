import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User  from "../models/userSchema.js";
export const Login = async (req, res) => {
    try {
        const body = req.body
        const user = await User.findOne({ email: body.email });  
        console.log("user", user);
        if (!user) {
            return res.json({
                message: "User not found",
                status: false,
                data: null,
            });
        }
        const passCheck = await bcrypt.compare(body.password, user.password);
        console.log("passCheck", passCheck);
        if (!passCheck) {
            return res.json({
                message: "Email or password is incorrect!",
                status: false,
                data: null,
            });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_PRIVATE_KEY);
        res.json({
            message: "Login Successful!",
            status: true,
            data: user,
            token,
        });
    } catch (error) {
        res.json({
            message: error.message || "Something went wrong",
            status: false,
            data: null,
        });
    }
}

export const Signup = async (req, res) => {
    try {
        const { name, email, password, age, gender } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                status: false,
                message: "Name, email, and password are required.",
                data: null,
            });
        }

        const isExists = await User.findOne({ email });
        if (isExists) {
            return res.status(409).json({
                status: false,
                message: "Email address already exists.",
                data: null,
            });
        }

        const hashPass = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name,
            email,
            password: hashPass,
            age,
            gender,
        });

        const userData = newUser.toObject();
        delete userData.password;

        return res.status(201).json({
            status: true,
            message: "Signup successful.",
            data: userData,
        });

    } catch (error) {
        console.error("Signup Error:", error);
        return res.status(500).json({
            status: false,
            message: error.message || "Something went wrong during signup.",
            data: null,
        });
    }
};



