import Image from "next/image";
import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="p-20 bg-gradient-to-t from-[#9000ff]  to-[#ff4000]">
      <div className="flex-center wrapper flex-between flex flex-col gap-4 p-5 text-center">
        <Link
          href="/"
          className="text-5xl text-white kronaOne -tracking-[0.40rem] font-semibold"
        >
          vibey!
        </Link>

        <p className="text-white text-[0.8rem] rubik">
          Copyright © 2024 vibey! - All Rights reserved | App by{" "}
          <Link
            target="_blank"
            href={"https://www.inthegleam.com/"}
            className="hover:text-grey-400"
          >
            inTheGleam
          </Link>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
