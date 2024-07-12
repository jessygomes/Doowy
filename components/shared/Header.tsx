import Link from "next/link";
import { auth } from "@/auth";

import NavItems from "./NavItems";
import NavMobile from "./NavMobile";
import { UserBtn } from "../auth/UserBtn";
import { Button } from "../ui/button";

const Header = async () => {
  const session = await auth();
  const userName = session?.user?.name;

  return (
    <header className="w-full border-b">
      <div className="wrapper flex items-center justify-between">
        <Link href="/" className="font-bold text-4xl">
          vibey!
        </Link>

        <nav className="md:flex-between hidden w-full max-w-xs">
          <NavItems />
        </nav>

        <div className="flex w-32 justify-end gap-3">
          <NavMobile />

          {session ? (
            <div className="flex justify-center items-center gap-4">
              <p className="h4-bold font-bold text-center">
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
        </div>
      </div>
    </header>
  );
};

export default Header;
