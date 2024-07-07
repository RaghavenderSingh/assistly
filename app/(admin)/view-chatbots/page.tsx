import Avatar from "@/app/components/Avatar";
import { Button } from "@/components/ui/button";
import { GET_CHATBOTS_BY_USER } from "@/graphql/queries/queries";
import { serverClient } from "@/lib/server/serverClient";
import {
  Chatbot,
  GetChatbotByUserData,
  GetChatbotByUserDataVariables,
} from "@/types/types";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

export const dynamic = "force-dynamic";
async function ViewChatbots() {
  const { userId } = await auth();
  if (!userId) return;

  const {
    data: { chatbotsByUser },
  } = await serverClient.query<
    GetChatbotByUserData,
    GetChatbotByUserDataVariables
  >({
    query: GET_CHATBOTS_BY_USER,
    variables: {
      clerk_user_id: userId,
    },
  });
  const sortedChatbotByUser: Chatbot[] = [...chatbotsByUser].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
  console.log(sortedChatbotByUser);
  return (
    <div className="flex-1 pb-20 p-10">
      <h1 className="text-xl lg:text-3xl font-semibold mb-5">
        Active Chatbots
      </h1>

      {sortedChatbotByUser.length === 0 && (
        <div>
          <p>
            You have not created chatbots yet, click the button below to create
          </p>
          <Link href={"/create-chatbot"}>
            <Button className="bg-[#64B5F5] text-white p-3 rounded-md">
              Create Chatbots
            </Button>
          </Link>
        </div>
      )}

      <ul className="flex flex-col space-y-5">
        {sortedChatbotByUser.map((chatbots) => (
          <Link key={chatbots.id} href={`/edit-chatbot/${chatbots.id}`}>
            <li className="relative p-10 border rounded-md max-w-3xl bg-white">
              <div className="flex justify-center items-center">
                <div className="flex items-center space-x-4">
                  <Avatar seed={chatbots.name} />
                  <h2 className="text-xl font-bold">{chatbots.name}</h2>
                </div>
                <p className="absolute top-5 right-5 text-xs text-gray-400">
                  Created :{new Date(chatbots.created_at).toLocaleDateString()}
                </p>
              </div>
              <hr className="mt-2" />
              <div className="grid grid-cols-2 gap-10 md:gap-5 p-5">
                <h3 className="italic">Characteristics:</h3>
                <ul className="text-xs">
                  {!chatbots.chatbot_characteristics.length && (
                    <p>No characteristics added yet.</p>
                  )}
                  {chatbots.chatbot_characteristics.map((characteristic) => (
                    <li
                      className="list-disc break-words"
                      key={characteristic.id}
                    >
                      {characteristic.content}
                    </li>
                  ))}
                </ul>
                <h3 className="italic">No of Sessions:</h3>
                <p>{chatbots.chat_session?.length}</p>
              </div>
            </li>
          </Link>
        ))}
      </ul>
    </div>
  );
}

export default ViewChatbots;
