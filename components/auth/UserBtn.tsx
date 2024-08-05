"use client";
import Link from "next/link";

import { useCurrentUser } from "@/hooks/use-current-user";
import { LogoutBtn } from "./LogoutBtn";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FaUser, FaSignOutAlt, FaRegSun } from "react-icons/fa";

export const UserBtn = () => {
  const user = useCurrentUser();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={user?.image || ""} />
          <AvatarFallback className="bg-gradient-to-r from-purple-600 to-orange-600 dark:bg-white">
            <FaUser className="text-white" />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-40 bg-primary font-semibold dark:bg-dark rounded-sm"
        align="end"
      >
        <Link href="/profil">
          <DropdownMenuItem className="cursor-pointer hover:bg-linear-hover">
            <FaUser className="h-4 w-4 mr-2" />
            {user?.role === "organizer" ? "Mon profil" : "Mon compte"}
          </DropdownMenuItem>
        </Link>
        {/* <DropdownMenuSeparator />

        <DropdownMenuItem
          className="cursor-pointer"
          style={{ pointerEvents: "none" }}
        >
          <FaRegSun className="h-4 w-4 mr-2" />
          <div className="flex gap-4 justify-between items-center">
            <p>Thème</p>
            <div style={{ pointerEvents: "auto" }}>
              <ThemeToggle />
            </div>
          </div>
        </DropdownMenuItem> */}

        <DropdownMenuSeparator className="bg-white" />
        <Link href={`/profil/${user?.id}/parametres`}>
          <DropdownMenuItem className="cursor-pointer hover:bg-linear-hover">
            <FaRegSun className="h-4 w-4 mr-2" />
            Paramètres
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator className="bg-white" />
        <LogoutBtn>
          <DropdownMenuItem className="cursor-pointer hover:bg-linear-hover">
            <FaSignOutAlt className="h-4 w-4 mr-2" />
            Se déconnecter
          </DropdownMenuItem>
        </LogoutBtn>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
