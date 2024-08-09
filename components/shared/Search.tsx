"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";

export const Search = () => {
  const router = useRouter();
  const [query, setQuery] = useState("");

  //! Utliser le hook useSearchParams pour récupérer les paramètres de l'url pour la recherche
  const searchParams = useSearchParams();

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      let newUrl = "";
      if (query) {
        newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: "query",
          value: query,
        });
      } else {
        newUrl = removeKeysFromQuery({
          params: searchParams.toString(),
          keysToRemove: ["query"],
        });
      }

      router.push(newUrl, { scroll: false });
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query, searchParams, router]);

  return (
    <div className="flex-center min-h-[30px] w-full overflow-hidden rounded-sm bg-transparent px-4 ">
      <Image
        src="/assets/icons/search.svg"
        alt="Search"
        width={24}
        height={24}
      />
      <Input
        type="text"
        placeholder="Rechercher"
        onChange={(e) => setQuery(e.target.value)}
        className="rubik p-regular-16 border-0 bg-transparent outline-offset-0 placeholder:text-white  focus:border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
      />
    </div>
  );
};
