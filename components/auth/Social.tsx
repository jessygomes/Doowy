"use client";

// On importe signIn depuis next-auth/react quand on est dans un client component
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { DEFAULT_LOGIN_REDIRECT } from "@/route";

export function Social() {
  const onClick = (provider: "google") => {
    signIn(provider, { callbackUrl: DEFAULT_LOGIN_REDIRECT });
  };

  return (
    <div className="flex items-center w-full gap-x-2">
      <button
        className="w-full flex justify-center bg-grey-50 p-2 rounded-full hover:bg-slate-300 transition-all ease-in-out duration-200"
        onClick={() => onClick("google")}
      >
        <FcGoogle className="h-5 w-5" />
      </button>
    </div>
  );
}
