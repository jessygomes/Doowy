"use client";
import { ICategory } from "@/lib/mongoDb/database/models/Category";
import { startTransition, useEffect, useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "../ui/input";
import { createCategory, getAllCategory } from "@/lib/actions/category.actions";

type DropDownProps = {
  value?: string;
  onChangeHandler?: () => void;
};

const Dropdown = ({ value, onChangeHandler }: DropDownProps) => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [newCategory, setNewCategory] = useState("");

  //! Méthode pour créer une catégorie en appelant l'actions créé dans lib/actions/category.actions.ts
  const handleAddCategory = () => {
    createCategory({ categoryName: newCategory.trim() }).then((category) => {
      setCategories((prevState) => [...prevState, category]);
    });
  };

  //! Chargment des catégories en appelant l'actions créé dans lib/actions/category.actions.ts
  useEffect(() => {
    const getCategories = async () => {
      const categoryList = await getAllCategory();

      categoryList && setCategories(categoryList as ICategory[]); // On vérifie si la liste des catégories est définie avant de la mettre à jour dans le state
    };

    getCategories();
  }, [setCategories]);

  return (
    <Select onValueChange={onChangeHandler} defaultValue={value}>
      <SelectTrigger className="select-field">
        <SelectValue placeholder="Catégorie" />
      </SelectTrigger>
      <SelectContent>
        {categories.length > 0 &&
          categories.map((category) => (
            <SelectItem
              key={category._id}
              value={category._id}
              className="select-item p-regular-14 "
            >
              {category.name}
            </SelectItem>
          ))}

        {/* Créer la catégorie */}
        <AlertDialog>
          <AlertDialogTrigger className="p-medium-14 flex w-full rounded-sm py-3 pl-8 text-primary-500 hover:bg-primary-50 focus:text-primary-500">
            Ajouter une catégorie
          </AlertDialogTrigger>

          <AlertDialogContent className="bg-white">
            <AlertDialogHeader>
              <AlertDialogTitle>Nouvelle Catégorie</AlertDialogTitle>

              <AlertDialogDescription>
                <Input
                  type="text"
                  placeholder="Nom de la catégorie"
                  className="input-field mt-3"
                  onChange={(e) => setNewCategory(e.target.value)}
                />
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => startTransition(handleAddCategory)}
              >
                Confirmer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </SelectContent>
    </Select>
  );
};

export default Dropdown;
