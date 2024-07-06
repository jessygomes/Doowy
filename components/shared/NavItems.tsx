"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useCurrentRole } from "@/hooks/use-current-role";
import { Role } from "@prisma/client";

import {
  headerLinkNoUser,
  headerLinksOrganizer,
  headerLinksUser,
} from "@/constants";

const NavItems = () => {
  const pathname = usePathname();

  const role = useCurrentRole();

  if (role === Role.organizer) {
    return (
      <ul className="md-flex-between flex flex-col items-start gap-5 md:flex-row">
        {headerLinksOrganizer.map((link, index) => {
          const isActive = pathname === link.route;
          return (
            <li
              key={index}
              className={`${
                isActive && "text-primary-500"
              } flex-center p-medium-16 whitespace-nowrap`}
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
      <ul className="md-flex-between flex flex-col items-start gap-5 md:flex-row">
        {headerLinksUser.map((link, index) => {
          const isActive = pathname === link.route;
          return (
            <li
              key={index}
              className={`${
                isActive && "text-primary-500"
              } flex-center p-medium-16 whitespace-nowrap`}
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
      <ul className="md-flex-between flex flex-col items-start gap-5 md:flex-row">
        {headerLinkNoUser.map((link, index) => {
          const isActive = pathname === link.route;
          return (
            <li
              key={index}
              className={`${
                isActive && "text-primary-500"
              } flex-center p-medium-16 whitespace-nowrap`}
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
