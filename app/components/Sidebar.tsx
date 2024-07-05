import { Bot, BotMessageSquare, PencilLineIcon, SearchIcon } from "lucide-react";
import Link from "next/link";

function Sidebar() {
  return (
    <div className="bg-white text-white p-5">
      <ul className="gap-5 flex lg:flex-col">
        <li className="flex-1">
          <Link
            className="hover:opacity-50 flex flex-col text-center lg:text-left lg:flex-row items-center gap-2 p-5 rounded-md bg-[#2991EE]"
            href="/create-chatbot"
          >
            <BotMessageSquare className="h-6 w-6 lg:h-8 lg:w-8" />
            <div className="hidden md:inline">
                <p className="text-xl">Create</p>
                <p className="text-sm font-extralight">New Chatbot</p>
            </div>
          </Link>
        </li>
        <li className="flex-1">
          <Link 
         className="hover:opacity-50 flex flex-col text-center lg:text-left lg:flex-row items-center gap-2 p-5 rounded-md bg-[#2991EE]"
          href="/view-chatbots">
            <PencilLineIcon className="h-6 w-6 lg:h-6 lg:w-8"/>
            <div className="hidden md:inline">
                <p className="text-xl">Edit</p>
                <p className="text-sm font-extralight">Chatbots</p>
            </div>
          </Link>
        </li>
        <li className="flex-1">
          <Link           
           className="hover:opacity-50 flex flex-col text-center lg:text-left lg:flex-row items-center gap-2 p-5 rounded-md bg-[#2991EE]"
         href="/review-sessions">
            <SearchIcon className="h-6 w-6 lg:h-8 lg:w-8"/>
            <div className="hidden md:inline">
                <p className="text-xl">View</p>
                <p className="text-sm font-extralight">Sessions</p>
            </div>
         </Link>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
