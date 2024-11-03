"use client";
import Link from "next/link";
import { IoMenu } from "react-icons/io5";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "../ui/separator";
import NavItems from "./NavItems";
import { useState } from "react";

const NavMobile = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  return (
    <nav className="md:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger className="align-middle" onClick={handleOpen}>
          <IoMenu size={40} className="text-white" />
        </SheetTrigger>

        <SheetContent className="flex flex-col gap-6 bg-dark md:hidden">
          <Link
            href="/"
            onClick={handleClose}
            className="text-4xl text-white kronaOne -tracking-[0.40rem] font-semibold"
          >
            Doowy!
          </Link>
          <Separator className="border border-white" />
          <NavItems onLinkClick={handleClose} />
        </SheetContent>
      </Sheet>
    </nav>
  );
};

export default NavMobile;
