import { axiosInstance } from "./axios.js";

export const signUp = async (signupData) => {
    const response = await axiosInstance.post("/auth/signup", signupData);
    return response.data;
}

export const login = async (loginData) => {
    const response = await axiosInstance.post("/auth/login", loginData);
    return response.data;
}

export const logout = async () => {
    const response = await axiosInstance.post("/auth/logout");
    return response.data;
}

export const getRecommendedUsers = async () => {
    const response = await axiosInstance.get("/users");
    return response.data;
}

export const getUserFriends = async () => {
    const response = await axiosInstance.get("/users/friends");
    return response.data;
}

export const getOutgoingFriendReqs = async () => {
    const response = await axiosInstance.get("/users/outgoing-friend-requests");
    return response.data;
}

export const getAuthUser = async () => {
    try {
        const res = await axiosInstance.get("/auth/check");
        return res.data;
    } catch (error) {
        console.log(`Error on getAuthUser :- ${error}`)
        return null
    }
}

export const completeOnboarding = async (userData) => {
    const res = await axiosInstance.post("/auth/onboarding", userData);
    return res.data;
}

export const sendFriendRequest = async ({ recipientId }) => {
    const res = await axiosInstance.post(`/users/friend-request/${recipientId}`);
    return res.data;
};

export const getFriendRequest = async () => {
    const res = await axiosInstance.get("/users/friend-requests");
    return res.data
}

export const acceptFriendRequest = async ({ requestId }) => {
    try {
        console.log("Request ID:", requestId);
        const res = await axiosInstance.put(`/users/friend-request/${requestId}/accept`);
        return res.data;
    } catch (error) {
        console.error("API Error:", error.response?.data || error.message);
        throw error;
    }
};

export const getStreamToken = async () => {
    const res = await axiosInstance.get("/chat/token")
    return res.data
}