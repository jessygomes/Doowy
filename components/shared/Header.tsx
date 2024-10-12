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
    <header className="bg-transparent">
      <div className="wrapper flex items-center justify-between">
        <Link
          href="/"
          className="text-2xl text-white kronaOne -tracking-[0.35rem] font-semibold"
        >
          DOOWY!
        </Link>

        <div className="flex w-32 justify-end items-center gap-4">
          {session ? (
            <div className="flex gap-16 w-fit">
              <nav className="md:flex-between hidden w-full max-w-xs text-white">
                <NavItems />
              </nav>
              <div className="flex justify-center items-center gap-4">
                <UserBtn />
                {/* <ThemeToggle /> */}
              </div>
            </div>
          ) : (
            <div className="flex gap-16">
              <nav className="md:flex-between hidden w-full max-w-fit text-white">
                <NavItems />
              </nav>
              <div className="flex gap-2">
                <Button
                  asChild
                  className="text-white border border-white bg-transparent uppercase text-[10px] sm:text-[12px] hover:bg-linear-hover hover:text-white p-2"
                >
                  <Link href="/auth/connexion">connexion</Link>
                </Button>
                {/* <ThemeToggle /> */}
              </div>
            </div>
          )}
          <NavMobile />
        </div>
      </div>
    </header>
  );
};

export default Header;
