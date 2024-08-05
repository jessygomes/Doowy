import Image from "next/image";
import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-primary dark:bg-dark">
      {/* <div className="wrapper flex justify-center items-center gap-8">
        <p className="font-bold text-dark dark:text-primary text-sm kronaOne">
          vibey!
        </p>
        <div className="w-full h-[1px] rounded-sm bg-dark dark:bg-primary"></div>
        <p className="font-bold text-sm kronaOne text-dark dark:text-primary">
          vibey!
        </p>
      </div> */}
      <div className="flex-center wrapper flex-between flex flex-col gap-4 p-5 text-center">
        <Link
          href="/"
          className="text-5xl text-dark dark:text-white kronaOne -tracking-[0.40rem] font-semibold"
        >
          vibey!
          {/* <Image
            src="/assets/images/logo.svg"
            alt="logo"
            width={128}
            height={38}
          /> */}
        </Link>

        <p className="text-dark dark:text-white rubik">
          2024 vibey! | All Rights reserved
        </p>
      </div>
    </footer>
  );
};

export default Footer;
