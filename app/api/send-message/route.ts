import { INSERT_MESSAGE } from "@/graphql/mutations/mutations";
import { GET_CHATBOT_BY_ID, GET_MESSAGES_BY_CHAT_SESSION_ID } from "@/graphql/queries/queries";
import { serverClient } from "@/lib/server/serverClient";
import { GetChatbotByIdResponse, MessageBYChatSessionIdResponse } from "@/types/types";
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(`${process.env.GOOGLE_AI_API_KEY}`);

export async function POST(req: NextRequest) {
    const { chat_session_id, chatbot_id, content, name, created_at } = await req.json();
    console.log(`Received message from chat session ${chat_session_id}:${content} (chatbot:${chatbot_id})`);

    try {
        const { data } = await serverClient.query<GetChatbotByIdResponse>({
            query: GET_CHATBOT_BY_ID,
            variables: { id: chatbot_id },
        });

        const chatbot = data.chatbots;

        if (!chatbot) {
            return NextResponse.json({ error: "Chatbot not found" }, { status: 404 })
        }

        const { data: messagesData } = await serverClient.query<MessageBYChatSessionIdResponse>({
            query: GET_MESSAGES_BY_CHAT_SESSION_ID,
            variables: { chat_session_id },
            fetchPolicy: "no-cache",
        });

        const previousMessages = messagesData.chat_sessions.messages;

        const formattedPreviousMessages = previousMessages.map((message) => ({
            role: message.sender === "ai" ? "model" : "user",
            parts: [{ text: message.content }],
        }));

        const systemPrompt = chatbot.chatbot_characteristics.map((c) => c.content).join(" + ");
        console.log(systemPrompt);

        // Initialize a chat model
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        // Start a chat session
        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: `You are a helpful assistant talking to ${name}. If a generic question is asked which is not relevant or in the same scope or domain as the points mentioned in the key information section, kindly inform the user they're only allowed to search for the specified content. Use Emojis where possible. Here is some key information that you need to be aware of, these are elements you may be asked about: ${systemPrompt}` }],
                },
                {
                    role: "model",
                    parts: [{ text: "Understood. I'm ready to assist within the specified parameters." }],
                },
                ...formattedPreviousMessages
            ],
        });

        // Send the message and get the response
        const result = await chat.sendMessage(content);
        const aiResponse = result.response.text();
        console.log(aiResponse)
        if (!aiResponse) {
            return NextResponse.json("Failed to generate AI response", { status: 500 });
        }

        await serverClient.mutate({
            mutation: INSERT_MESSAGE,
            variables: { chat_session_id, content, sender: "user", created_at: created_at }
        });


        const aiMessageResult = await serverClient.mutate({
            mutation: INSERT_MESSAGE,
            variables: { chat_session_id, content: aiResponse, sender: "ai", created_at: created_at }
        });
        return NextResponse.json({
            id: aiMessageResult.data.insertMessages.id,
            content: aiResponse
        });

    } catch (error) {
        console.error("Error sending message:", error)
        return NextResponse.json({ error }, { status: 500 })
    }
}