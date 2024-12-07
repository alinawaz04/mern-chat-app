import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/generateToken.js";

export const signup = async (req, res) => {
  try {
    const { fullName, username, password, confirmPassword, gender } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    const user = await User.findOne({ username });

    if (user) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    // Hash password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const maleProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
    const femaleProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

    const newUser = new User({
      fullName,
      username,
      password: hashedPassword,
      gender,
      profilePic: gender === "male" ? maleProfilePic : femaleProfilePic,
    });

    if (newUser) {
      // Generate JWT token
      generateTokenAndSetCookie(newUser._id, res);
      await newUser.save();

      return res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        username: newUser.username,
        profilePic: newUser.profilePic,
      });
    } else {
      return res.status(400).json({ error: "Error in user data" });
    }
  } catch (error) {
    console.log("Error in signup controller", error.message);
    return res.status(400).json({ error: "Passwords do not match" });
  }
};

export const login = (req, res) => {
  res.send("login route");
};

export const logout = (req, res) => {
  res.send("logout route");
};
