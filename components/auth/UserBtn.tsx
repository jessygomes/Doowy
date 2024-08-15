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
          <AvatarFallback className="bg-gradient-to-r from-purple-600 to-orange-600">
            <FaUser className="text-white" />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-40 border-none font-semibold bg-dark rounded-sm text-white rubik shadowCj"
        align="end"
      >
        <Link href="/profil">
          <DropdownMenuItem className="cursor-pointer hover:bg-linear-hover">
            <FaUser className="h-4 w-4 mr-2" />
            {user?.role === "organizer" ? "Mon profil" : "Mon compte"}
          </DropdownMenuItem>
        </Link>

        <DropdownMenuSeparator className="bg-dark" />
        <Link href={`/profil/${user?.id}/parametres`}>
          <DropdownMenuItem className="cursor-pointer hover:bg-linear-hover">
            <FaRegSun className="h-4 w-4 mr-2" />
            Paramètres
          </DropdownMenuItem>
        </Link>

        <DropdownMenuSeparator className="bg-dark" />
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
