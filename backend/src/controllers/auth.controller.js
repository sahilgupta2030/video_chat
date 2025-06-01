import { generateJWT } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
// import cloudinary from "../lib/cloudinary.js";
import { upsertStreamUser } from "../lib/stream.js";


export const signup = async (req, res) => {
    const { fullName, email, password } = req.body
    try {
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "Please fill all the fields" })
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" })
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        const user = await User.findOne({ email })
        if (user) {
            return res.status(400).json({ message: "User already exists with this email" })
        }
        const index = Math.floor(Math.random() * 100) + 1
        const randomAvatar = `https://avatar.iran.liara.run/public/${index}.png`

        const newUser = await User.create({
            fullName,
            email,
            password,
            profilePicture: randomAvatar,
        })
        try {
            await upsertStreamUser({
                id: newUser._id,
                name: newUser.fullName,
                image: newUser.profilePicture || "",
            })
        } catch (error) {
            console.error(`Error in upsertStreamUser: ${error}`)
            return res.status(500).json({ message: "Error in upsertStreamUser" })
        }
        if (newUser) {
            generateJWT(newUser._id, res)
            await newUser.save()

            return res.status(200).json({ success: true, user: newUser })
        } else {
            return res.status(400).json({ message: "Invalid user data" })
        }
    } catch (error) {
        console.log(`Error in signup controller ${error?.message}`)
        return res.status(500).json({ message: "Something went wrong" })
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body
    try {
        if (!email || !password) {
            return res.status(400).json({ message: "Please fill all the fields" })
        }
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "User not found with this email" })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" })
        }
        generateJWT(user._id, res)
        return res.status(200).json({ success: true, user })
    } catch (error) {
        console.log(`Error in login controller ${error?.message}`)
        return res.status(500).json({ message: "Something went wrong while Login" })
    }
}

export const logout = async (req, res) => {
    try {
        res.cookie('jwt', '', { maxAge: '0' })
        res.status(200).json({ message: "Logout successfully" })
    } catch (error) {
        console.log(`Error in login controller ${error?.message}`)
        return res.status(500).json({ message: "Something went wrong while LogOut" })
    }
}

// export const updateProfile = async (req, res) => {
//     try {
//         const { profilePicture } = req.body;
//         const userId = req.user._id
//         if (!profilePicture) {
//             res.status(400).json({ message: "Please upload profile picture" })
//         }
//         const uploadResponse = await cloudinary.uploader.upload(profilePicture)
//         if (!uploadResponse) {
//             console.error("Failed to upload in cloudinary")
//         }
//         const updateUser = await User.findByIdAndUpdate(userId, { profilePicture: uploadResponse.secure_url }, { new: true })
//         if (!updateUser) {
//             console.error("Failed to update profile")
//         }
//         return res.status(200).json(updateUser)
//     } catch (error) {
//         console.log(`Error in update profile :- ${error?.message}`)
//         res.status(500).json({ message: "Error in update profile" })
//     }
// }

export const checkAuth = async (req, res) => {
    try {
        await res.status(200).json(req.user)
    } catch (error) {
        console.log(`Error in checkAuth controller :- ${error?.message}`)
        res.status(500).json({ message: "Error while checking auth controller" })
    }
}

export const onboard = async (req, res) => {
    try {
        const userId = req.user._id
        const { fullName, bio, location } = req.body
        if (!fullName || !bio || !location) {
            return res.status(400).json({
                message: "Please fill all the fields",
                missingFields: [
                    !fullName && "fullName",
                    !bio && "bio",
                    !location && "location"
                ]
            })
        }

        const updatedUser = await User.findByIdAndUpdate(userId, {
            ...req.body,
            isOnboarding: true,
        }, { new: true })
        if (!updatedUser) {
            return res.status(400).json({ message: "User not found" })
        }
        try {
            await upsertStreamUser({
                id: updatedUser._id.toString(),
                name: updatedUser.fullName,
                image: updatedUser.profilePicture || "",
            })
        } catch (error) {
            console.error(`Error in upsertStreamUser: ${error}`)
            return res.status(500).json({ message: "Error in upsertStreamUser" })

        }
        res.status(200).json({ success: true, user: updatedUser })
    } catch (error) {
        console.log(`Error in onboarding controller :- ${error?.message}`)
        res.status(500).json({ message: "Error in onboarding controller" })
    }
}