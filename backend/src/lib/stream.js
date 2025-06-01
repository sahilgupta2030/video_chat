import { StreamChat } from 'stream-chat';
import dotenv from 'dotenv';

dotenv.config();
const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

if (!apiKey || !apiSecret) {
    throw new Error('STREAM_API_KEY and STREAM_API_SECRET must be set');
}

const serverClient = StreamChat.getInstance(apiKey, apiSecret);

export const upsertStreamUser = async (userData) => {
    try {
        const streamUser = await serverClient.upsertUser({ id: userData?.id, ...userData });
        return streamUser;
    } catch (error) {
        console.error(`Error upserting user to Stream: ${error}`);
    }
}

export const generateStreamToken = (userId) => {
    try {
        const userIdString = userId.toString();
        return serverClient.createToken(userIdString);
    } catch (error) {
        console.error(`Error generating Stream token: ${error}`);
    }
}