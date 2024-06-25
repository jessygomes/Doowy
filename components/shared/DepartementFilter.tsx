"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";

type Departement = {
  numero: string;
  nom: string;
};

interface DepartementFilterProps {
  departements: Departement[];
}

export const DepartementFilter = ({ departements }: DepartementFilterProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const onSelectDepartement = (departement: string) => {
    let newUrl = "";
    if (departement && departement !== "All") {
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "departement",
        value: departement,
      });
    } else {
      newUrl = removeKeysFromQuery({
        params: searchParams.toString(),
        keysToRemove: ["departement"],
      });
    }

    router.push(newUrl, { scroll: false });
  };

  return (
    <Select onValueChange={(value: string) => onSelectDepartement(value)}>
      <SelectTrigger className="select-field">
        <SelectValue placeholder="Département" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="All" className="select-item p-regular-14">
          Tous les départements
        </SelectItem>
        {departements.map((departement) => (
          <SelectItem
            key={departement.numero}
            value={departement.nom}
            className="select-item p-regular-14"
          >
            {departement.nom} - {departement.numero}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
