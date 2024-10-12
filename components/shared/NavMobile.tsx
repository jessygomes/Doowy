import Link from "next/link";
import { IoMenu } from "react-icons/io5";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "../ui/separator";
import NavItems from "./NavItems";

const NavMobile = () => {
  return (
    <nav className="md:hidden">
      <Sheet>
        <SheetTrigger className="align-middle">
          <IoMenu size={40} className="text-white" />
        </SheetTrigger>

        <SheetContent className="flex flex-col gap-6 bg-dark md:hidden">
          <Link
            href="/"
            className="text-4xl text-white kronaOne -tracking-[0.40rem] font-semibold"
          >
            Doowy!
          </Link>
          <Separator className="border border-white" />
          <NavItems />
        </SheetContent>
      </Sheet>
    </nav>
  );
};

export default NavMobile;
