"use client";
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
import { FaUser, FaTimesCircle } from "react-icons/fa";
import Link from "next/link";

export const UserBtn = () => {
  const user = useCurrentUser();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={user?.image || ""} />
          <AvatarFallback className="bg-primary">
            <FaUser className="text-white" />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40" align="end">
        <Link href="/profil">
          <DropdownMenuItem className="cursor-pointer">
            <FaUser className="h-4 w-4 mr-2" />
            {user?.role === "organizer" ? "Mon profil" : "Mon compte"}
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <LogoutBtn>
          <DropdownMenuItem className="cursor-pointer">
            <FaTimesCircle className="h-4 w-4 mr-2" />
            Se déconnecter
          </DropdownMenuItem>
        </LogoutBtn>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
