"use server";

import { CreateCategoryParams } from "@/types";
import Category from "../mongoDb/database/models/Category";
import { handleError } from "../utils";
import { connectToDb } from "../mongoDb/database";

//! Créer une catégorie
export const createCategory = async ({
  categoryName,
}: CreateCategoryParams) => {
  try {
    await connectToDb();

    const newCategory = await Category.create({ name: categoryName });

    return JSON.parse(JSON.stringify(newCategory));
  } catch (error) {
    handleError(error);
  }
};

//! Récupérer toutes les catégories
export const getAllCategory = async () => {
  try {
    await connectToDb();

    const categories = await Category.find();

    return JSON.parse(JSON.stringify(categories));
  } catch (error) {
    handleError(error);
  }
};
