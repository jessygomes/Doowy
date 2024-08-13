"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useCurrentRole } from "@/hooks/use-current-role";
import { Role } from "@prisma/client";

import {
  headerLinkNoUser,
  headerLinksAdmin,
  headerLinksOrganizer,
  headerLinksUser,
} from "@/constants";

const NavItems = () => {
  const pathname = usePathname();

  const role = useCurrentRole();

  if (role === Role.organizer) {
    return (
      <ul className="md-flex-between flex flex-col items-start gap-8 sm:gap-16 md:flex-row rubik">
        {headerLinksOrganizer.map((link, index) => {
          const isActive = pathname === link.route;
          return (
            <li
              key={index}
              className={`${
                isActive && "text-white border-white font-bold"
              } flex-center p-medium-20 sm:p-medium-16 whitespace-nowrap py-2 border-b-2 border-transparent hover:border-white transition-all ease-in-out`}
            >
              <Link href={link.route}>{link.label}</Link>
            </li>
          );
        })}
      </ul>
    );
  }

  if (role === Role.admin) {
    return (
      <ul className="md-flex-between flex flex-col items-start gap-8 sm:gap-16 md:flex-row rubik">
        {headerLinksAdmin.map((link, index) => {
          const isActive = pathname === link.route;
          return (
            <li
              key={index}
              className={`${
                isActive && "text-white border-white font-bold"
              } flex-center p-medium-20 sm:p-medium-16 whitespace-nowrap py-2 border-b-2 border-transparent hover:border-white transition-all ease-in-out`}
            >
              <Link href={link.route}>{link.label}</Link>
            </li>
          );
        })}
      </ul>
    );
  }

  if (role === Role.user) {
    return (
      <ul className="md:flex-between flex flex-col items-start gap-16 md:flex-row">
        {headerLinksUser.map((link, index) => {
          const isActive = pathname === link.route;
          return (
            <li
              key={index}
              className={`${
                isActive && "text-white border-white font-bold"
              } flex-center p-medium-20 sm:p-medium-16 whitespace-nowrap py-2 border-b-2 border-transparent hover:border-white transition-all ease-in-out`}
            >
              <Link href={link.route}>{link.label}</Link>
            </li>
          );
        })}
      </ul>
    );
  }

  if (role === undefined) {
    return (
      <ul className="md-flex-between flex flex-col items-start gap-16 md:flex-row">
        {headerLinkNoUser.map((link, index) => {
          const isActive = pathname === link.route;
          return (
            <li
              key={index}
              className={`${
                isActive && "text-white border-white font-bold"
              } flex-center p-medium-20 sm:p-medium-16 whitespace-nowrap py-2 border-b-2 border-transparent hover:border-white transition-all ease-in-out`}
            >
              <Link href={link.route}>{link.label}</Link>
            </li>
          );
        })}
      </ul>
    );
  }
};

export default NavItems;
