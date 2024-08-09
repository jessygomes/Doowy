import Image from "next/image";
import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="pt-10 bg-dark">
      <div className="flex-center wrapper flex-between flex flex-col gap-4 p-5 text-center">
        <Link
          href="/"
          className="text-5xl text-dark dark:text-white kronaOne -tracking-[0.40rem] font-semibold"
        >
          vibey!
        </Link>

        <p className="text-dark dark:text-white rubik">
          2024 vibey! | All Rights reserved
        </p>
      </div>
    </footer>
  );
};

export default Footer;
