import Link from "next/link";
import Avatar from "./Avatar";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

function Header() {
  return (
    <header className="bg-white shadow-sm text-gray-800 flex justify-between p-5">
      <Link className="flex items-center text-4xl font-thin" href="/">
        <Avatar seed="Assistly" />
        <div className="space-y-1 pl-3">
          <h1>Assistly</h1>
          <h2 className="text-sm">Your Customisable AI Chat Agent</h2>
        </div>
      </Link>
      <div className="flex items-center">
        <SignedIn>
          <UserButton showName />
        </SignedIn>
        <SignedOut>
          <SignInButton />
        </SignedOut>
      </div>
    </header>
  );
}

export default Header;
