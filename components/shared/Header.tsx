import Link from "next/link";
import { auth } from "@/auth";

import NavItems from "./NavItems";
import NavMobile from "./NavMobile";
import { UserBtn } from "../auth/UserBtn";
import { Button } from "../ui/button";
import { ThemeToggle } from "./ThemeToggle";

const Header = async () => {
  const session = await auth();
  const userName = session?.user?.name;

  return (
    <header className="w-full border-b dark:bg-primary-500">
      <div className="wrapper flex items-center justify-between">
        <Link href="/" className="font-bold text-4xl dark:text-white">
          vibey!
        </Link>

        <nav className="md:flex-between hidden w-full max-w-xs dark:text-white">
          <NavItems />
        </nav>

        <div className="flex w-32 justify-end items-center gap-3">
          <NavMobile />

          {session ? (
            <div className="flex justify-center items-center gap-4">
              <p className="h4-bold font-bold text-center dark:text-white">
                {userName?.split(" ")[0]}
              </p>
              <UserBtn />
            </div>
          ) : (
            <>
              <Link
                href="/devenir-organisateur"
                className="text-primary hover:text-grey-500 transition-all ease-in-out duration-200"
              >
                <p className="text-sm text-center">Devenir Organisateur</p>
              </Link>
              <Button asChild className="rounded-full" size="lg">
                <Link href="/auth/connexion">Connexion</Link>
              </Button>
            </>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
