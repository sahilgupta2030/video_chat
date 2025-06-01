import User from "../models/user.model.js";
import FriendRequest from "../models/friend-request.model.js";
import mongoose from "mongoose";

export const getRecommendedUsers = async (req, res) => {
    try {
        const currentUserId = req.user.id;
        const currentUser = req.user;

        const recommendedUsers = await User.find({
            $and: [
                { _id: { $ne: currentUserId } },
                { _id: { $nin: currentUser.friends } },
                { isOnboarding: true },
            ]
        })
        // .select("-password -__v -friends -isOnboarding -createdAt -updatedAt").limit(10);

        res.status(200).json(recommendedUsers);
    } catch (error) {
        console.error(`Error fetching recommended users: ${error}`);
        res.status(500).json({ message: "Error fetching recommended users" });
    }
};

export const getMyFriends = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("friends").populate("friends", "fullName profilePicture");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user.friends);
    } catch (error) {
        console.error(`Error fetching friends: ${error}`);
        res.status(500).json({ message: "Error fetching friends" });
    }
};

export async function sendFriendRequest(req, res) {
    try {
        const myId = req.user.id;
        const { id: recipientId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(recipientId)) {
            return res.status(400).json({ message: 'Invalid recipient ID' });
        }

        // prevent sending req to yourself
        if (myId === recipientId) {
            return res.status(400).json({ message: "You can't send friend request to yourself" });
        }

        const recipient = await User.findById(recipientId);
        if (!recipient) {
            return res.status(404).json({ message: "Recipient not found" });
        }

        // check if user is already friends
        if (recipient.friends.includes(myId)) {
            return res.status(400).json({ message: "You are already friends with this user" });
        }

        // check if a req already exists
        const existingRequest = await FriendRequest.findOne({
            $or: [
                { sender: myId, recipient: recipientId },
                { sender: recipientId, recipient: myId },
            ],
        });

        if (existingRequest) {
            return res
                .status(400)
                .json({ message: "A friend request already exists between you and this user" });
        }

        const friendRequest = await FriendRequest.create({
            sender: myId,
            recipient: recipientId,
        });

        res.status(201).json(friendRequest);
    } catch (error) {
        console.error("Error in sendFriendRequest controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

export const acceptFriendRequest = async (req, res) => {
    try {
        const { id: requestId } = req.params
        const friendRequest = await FriendRequest.findById(requestId);
        if (!friendRequest) {
            return res.status(404).json({ message: "Friend request not found" });
        }
        if (friendRequest.recipient.toString() !== req.user.id) {
            return res.status(403).json({ message: "You are not authorized to accept this friend request" });
        }

        friendRequest.status = "accepted";
        await friendRequest.save();

        await User.findByIdAndUpdate(friendRequest.sender, {
            $addToSet: { friends: friendRequest.recipient }
        });
        await User.findByIdAndUpdate(friendRequest.recipient, {
            $addToSet: { friends: friendRequest.sender }
        });

        res.status(200).json({ message: "Friend request accepted" });
    } catch (error) {
        console.error(`Error accepting friend request: ${error}`);
        res.status(500).json({ message: "Error accepting friend request" });
    }
};

export const getFriendRequest = async (req, res) => {
    try {
        const incomingRequests = await FriendRequest.find({
            recipient: req.user.id,
            status: "pending"
        }).populate("sender", "fullName profilePicture");

        const acceptRequest = await FriendRequest.find({
            sender: req.user.id,
            status: "accepted"
        }).populate("recipient", "fullName profilePicture");

        res.status(200).json({
            incomingRequests,
            acceptRequest
        });
    } catch (error) {
        console.error(`Error fetching friend requests: ${error}`);
        res.status(500).json({ message: "Error fetching friend requests" });
    }
};

export const getOutgoingFriendRequest = async (req, res) => {
    try {
        const outgoingRequests = await FriendRequest.find({
            sender: req.user.id,
            status: "pending"
        }).populate("recipient", "fullName profilePicture");

        if (!outgoingRequests) {
            return res.status(404).json({ message: "No outgoing friend requests found" });
        }
        res.status(200).json(outgoingRequests);
    } catch (error) {
        console.error(`Error fetching outgoing friend requests: ${error}`);
        res.status(500).json({ message: "Error fetching outgoing friend requests" });
    }
};