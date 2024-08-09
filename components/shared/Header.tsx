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
    <header className="bg-transparent bg-slate-400">
      <div className="wrapper flex items-center justify-between">
        <Link
          href="/"
          className="text-4xl text-dark dark:text-white kronaOne -tracking-[0.40rem] font-semibold"
        >
          vibey!
        </Link>

        <div className="flex w-32 justify-end items-center gap-4">
          <NavMobile />

          {session ? (
            <div className="flex gap-16 w-fit">
              <nav className="md:flex-between hidden w-full max-w-xs dark:text-white">
                <NavItems />
              </nav>
              <div className="flex justify-center items-center gap-4">
                <UserBtn />
                {/* <ThemeToggle /> */}
              </div>
            </div>
          ) : (
            <div className="flex gap-16">
              <nav className="md:flex-between hidden w-full max-w-fit dark:text-white">
                <NavItems />
              </nav>
              <div className="flex gap-2">
                <Button
                  asChild
                  className="text-dark dark:text-white border border-dark dark:border-white bg-transparent uppercase text-[12px] hover:bg-primary dark:hover:bg-dark dark:hover:text-white"
                >
                  <Link href="/auth/connexion">connexion</Link>
                </Button>
                {/* <ThemeToggle /> */}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
