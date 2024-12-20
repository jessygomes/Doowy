"use client";
import { useEffect, useState } from "react";
import { createTag, getAllTags } from "@/lib/actions/tags.actions";

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

export interface ITags {
  id: string;
  name: string;
}

type DropDownProps = {
  selectedTags: ITags[];
  setSelectedTags: (tags: ITags[]) => void;
  onChangeHandler: (tags: ITags[]) => void;
};

const DropdownTags = ({
  selectedTags,
  setSelectedTags,
  onChangeHandler,
}: DropDownProps) => {
  const [tags, setTags] = useState<ITags[]>([]);
  const [newTag, setNewTag] = useState("");

  //! Méthode pour créer un tag en appelant l'action créée dans lib/actions/tags.actions.ts
  const handleAddTag = () => {
    createTag({ tagName: newTag.trim() }).then((tag) => {
      setTags((prevState) => [...prevState, tag]);
      onChangeHandler([...selectedTags, tag]);
      setNewTag("");
    });
  };

  //! Chargement des tags en appelant l'action créée dans lib/actions/tags.actions.ts
  useEffect(() => {
    const getTags = async () => {
      const tagsList = await getAllTags();
      tagsList && setTags(tagsList as ITags[]); // On vérifie si la liste des tags est définie avant de la mettre à jour dans le state
    };

    getTags();
  }, [setTags]);

  const handleTagSelect = (tag: ITags) => {
    if (!selectedTags.some((t) => t.id === tag.id)) {
      onChangeHandler([...selectedTags, tag]);
    }
  };

  const handleTagRemove = (tagId: string) => {
    const updatedTags = selectedTags.filter((tag) => tag.id !== tagId);

    onChangeHandler(updatedTags); // Met à jour le parent

    console.log("UPDATED TAGS", updatedTags);
  };

  console.log("SELECTED TAGS DROPDOWN", selectedTags);

  return (
    <div>
      <div className="flex flex-col lg:flex-row lg:items-center gap-2">
        <Select
          onValueChange={(value) =>
            handleTagSelect(tags.find((tag) => tag.id === value)!)
          }
        >
          <SelectTrigger className="lg:w-1/4 text-dark bg-white">
            <SelectValue placeholder="Sélectionner des tags" />
          </SelectTrigger>
          <SelectContent>
            {tags.map((tag) => (
              <SelectItem
                key={tag.id}
                value={tag.id}
                className="select-item p-regular-14 bg-dark"
              >
                {tag.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex gap-2 flex-wrap">
          {selectedTags.map((tag) => (
            <div
              key={tag.id}
              className="flex items-center gap-2 border-2 px-2 py-1 rounded-md"
            >
              <span className="text-white ">{tag.name}</span>
              <button onClick={() => handleTagRemove(tag.id)}>x</button>
            </div>
          ))}
        </div>
      </div>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button className="mt-4">Ajouter un nouveau tag</button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ajouter un nouveau tag</AlertDialogTitle>
            <AlertDialogDescription>
              Entrez le nom du nouveau tag ci-dessous.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Nom du tag"
          />
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleAddTag}>
              Ajouter
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DropdownTags;
