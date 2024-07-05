import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import NavItems from "./NavItems";
import NavMobile from "./NavMobile";
import { signOut } from "@/auth";

const Header = () => {
  return (
    <header className="w-full border-b">
      <div className="wrapper flex items-center justify-between">
        <Link href="/" className="font-bold text-4xl">
          vibey!
        </Link>

        {/* <SignedIn> */}
        <nav className="md:flex-between hidden w-full max-w-xs">
          <NavItems />
        </nav>
        {/* </SignedIn> */}

        <div className="flex w-32 justify-end gap-3">
          {/* <SignedIn> */}
          {/* <UserButton afterSignOutUrl="/" /> */}
          <NavMobile />
          {/* </SignedIn> */}

          {/* <SignedOut> */}
          <Link
            href="/devenir-organisateur"
            className="text-primary hover:text-grey-500 transition-all ease-in-out duration-200"
          >
            <p className="text-sm text-center">Devenir Organisateur</p>
          </Link>
          <Button asChild className="rounded-full" size="lg">
            <Link href="/auth/connexion">Connexion</Link>
          </Button>

          <form
            action={async () => {
              "use server";
              await signOut();
            }}
          >
            <button type="submit" className="rounded-full">
              <p>Déconnexion</p>
            </button>
          </form>
        </div>
      </div>
    </header>
  );
};

export default Header;
