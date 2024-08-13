import Image from "next/image";
import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="p-20 bg-gradient-to-t from-[#9000ff]  to-[#ff4000]">
      <div className="flex-center wrapper flex-between flex flex-col gap-8 p-5 text-center">
        <Link
          href="/"
          className="text-5xl text-white kronaOne -tracking-[0.40rem] font-semibold"
        >
          vibey!
        </Link>

        <div className="flex gap-8 uppercase text-white rubik">
          <Link
            href="/"
            className="hover:text-grey-400 transition-all ease-in-out duration-300"
          >
            Accueil
          </Link>
          <Link
            href="/events"
            className="hover:text-grey-400 transition-all ease-in-out duration-300"
          >
            Events
          </Link>
          <Link
            href="/a-propos"
            className="hover:text-grey-400 transition-all ease-in-out duration-300"
          >
            à propos
          </Link>
          <Link
            href="/contact"
            className="hover:text-grey-400 transition-all ease-in-out duration-300"
          >
            Contact
          </Link>
        </div>

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
