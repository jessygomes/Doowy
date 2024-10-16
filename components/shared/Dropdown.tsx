"use client";
import { startTransition, useEffect, useState } from "react";
import { createCategory, getAllCategory } from "@/lib/actions/category.actions";

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

interface ICategory extends Document {
  id: string;
  name: string;
}

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
        <SelectValue
          placeholder="Catégorie"
          className="placeholder:text-dark dark:placeholder:text-dark text-dark dark:text-dark"
        />
      </SelectTrigger>
      <SelectContent>
        {categories.length > 0 &&
          categories.map((category) => (
            <SelectItem
              key={category.id}
              value={category.id}
              className="select-item p-regular-14 bg-dark"
            >
              {category.name}
            </SelectItem>
          ))}

        {/* Créer la catégorie */}
        <AlertDialog>
          <AlertDialogTrigger className="p-medium-14 flex w-full rounded-sm bg-dark py-3 pl-8 hover:bg-dark-50 focus:text-primary-500">
            Ajouter une catégorie
          </AlertDialogTrigger>

          <AlertDialogContent className="bg-white">
            <AlertDialogHeader>
              <AlertDialogTitle>Nouvelle Catégorie</AlertDialogTitle>

              <AlertDialogDescription>
                <Input
                  type="text"
                  name="name"
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
