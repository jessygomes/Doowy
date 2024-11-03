"use server";

import { CreateCategoryParams } from "@/types";
import { db } from "../db";

// //! Créer une catégorie
export const createCategory = async ({
  categoryName,
}: CreateCategoryParams) => {
  try {
    const newCategory = await db.category.create({
      data: { name: categoryName },
    });

    return JSON.parse(JSON.stringify(newCategory));
  } catch (error) {
    console.log(error);
  }
};

// //! Récupérer toutes les catégories
export const getAllCategory = async () => {
  try {
    const categories = await db.category.findMany();

    return categories;
  } catch (error) {
    console.log(error);
  }
};
