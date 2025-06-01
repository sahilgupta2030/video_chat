import express from "express";
import {
    acceptFriendRequest,
    getFriendRequest,
    getMyFriends,
    getOutgoingFriendRequest,
    getRecommendedUsers,
    sendFriendRequest
} from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Middleware to protect routes
router.use(protectRoute);

router.get("/", getRecommendedUsers);

router.get("/friends", getMyFriends);

router.post("/friend-request/:id", sendFriendRequest);

router.put("/friend-request/:id/accept", acceptFriendRequest);

router.get("/friend-requests", getFriendRequest);

router.get("/outgoing-friend-requests", getOutgoingFriendRequest);

export default router;