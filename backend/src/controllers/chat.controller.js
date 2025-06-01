// import cloudinary from "../lib/cloudinary.js";
import { generateStreamToken } from "../lib/stream.js";
// import Message from "../models/message.model.js";
// import User from "../models/user.model.js";


// export const getUsersForMessage = async (req, res) => {
//     try {
//         const loggedInUserId = req.user?._id;
//         const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
//         if (!filteredUsers) {
//             return res.status(404).json({
//                 success: false,
//                 message: "No users found"
//             });
//         }
//         res.status(200).json({
//             success: true,
//             message: "Users fetched successfully",
//             data: filteredUsers
//         });
//     } catch (error) {
//         console.error("Error fetching users for message:", error.message);
//         res.status(500).json({
//             success: false,
//             message: "Error fetching users for message",
//             error: error.message
//         });
//     }
// };

// export const getMessages = async (req, res) => {
//     try {
//         const { id: userToChatId } = req.params
//         const myId = req.user?._id
//         const messages = await Message.find({
//             $or: [
//                 { senderID: myId, receiverID: userToChatId },
//                 { senderID: userToChatId, receiverID: myId }
//             ]
//         })
//         if (!messages) {
//             return res.status(404).json({
//                 success: false,
//                 message: "No messages found"
//             });
//         }

//         res.status(200).json({
//             success: true,
//             message: "Messages fetched successfully",
//             data: messages
//         })
//     } catch (error) {
//         console.error("Error fetching messages:", error.message);
//         res.status(500).json({
//             success: false,
//             message: "Error fetching messages",
//             error: error.message
//         });
//     }
// };

// export const sendMessage = async (req, res) => {
//     try {
//         const { text, image } = req.body
//         const { id: receiverID } = req.params
//         const senderID = req.user?._id
//         let imageURL;
//         if (image) {
//             const uploadResponse = await cloudinary.uploader.upload(image)
//             imageURL = uploadResponse.secure_url
//         }

//         const newMessage = await Message.create({
//             senderID,
//             receiverID,
//             text,
//             image: imageURL
//         })
//         await newMessage.save();
//         if (!newMessage) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Message not sent"
//             });
//         }

//         res.status(200).json({
//             success: true,
//             message: "Message sent successfully",
//             data: newMessage
//         })
//     } catch (error) {
//         console.error("Error sending message:", error.message);
//         res.status(500).json({
//             success: false,
//             message: "Error sending message",
//             error: error.message
//         });
//     }
// };

export const getStreamToken = async (req, res) => {
    try {
        const token = generateStreamToken(req.user._id);
        if (!token) {
            return res.status(404).json({
                success: false,
                message: "Failed to generate token"
            });
        }
        res.status(200).json({ token });
    } catch (error) {
        console.error(`Error getting stream token: ${error}`);
        res.status(500).json({ message: "Error getting stream token" });
    }
};