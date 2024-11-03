"use server";

import { CreateTagParams } from "@/types";
import { db } from "../db";

// //! Créer une catégorie
export const createTag = async ({ tagName }: CreateTagParams) => {
  try {
    const newTag = await db.tag.create({
      data: { name: tagName },
    });

    return JSON.parse(JSON.stringify(newTag));
  } catch (error) {
    console.log(error);
  }
};

// //! Récupérer toutes les catégories
export const getAllTags = async () => {
  try {
    const tags = await db.tag.findMany();

    return tags;
  } catch (error) {
    console.log(error);
  }
};
