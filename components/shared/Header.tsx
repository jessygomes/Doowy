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
    <header className="w-full border-b-0 border-dark dark:border-primary bg-primary dark:bg-dark">
      <div className="wrapper flex items-center justify-between">
        <Link
          href="/"
          className="font-bold text-4xl dark:text-white kronaOne -tracking-[0.35rem]"
        >
          vibey!
        </Link>

        <div className="flex w-32 justify-end items-center gap-4">
          <NavMobile />

          {session ? (
            <div className="flex gap-16">
              <nav className="md:flex-between hidden w-full max-w-xs dark:text-white">
                <NavItems />
              </nav>
              <div className="flex justify-center items-center gap-4">
                <p className="h4-bold font-bold text-center dark:text-white">
                  {userName?.split(" ")[0]}
                </p>
                <UserBtn />
                <ThemeToggle />
              </div>
            </div>
          ) : (
            <div className="flex gap-16">
              <nav className="md:flex-between hidden w-full max-w-xs dark:text-white">
                <NavItems />
              </nav>
              <div className="flex gap-4">
                <Button asChild className="button uppercase">
                  <Link href="/auth/connexion">Connexion/Inscription</Link>
                </Button>
                <ThemeToggle />
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
