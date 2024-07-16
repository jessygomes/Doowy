"use client";
import Link from "next/link";
import { startTransition, useState } from "react";

import { addFavoriteEvent } from "@/lib/actions/user.actions";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Event } from "@/types";

import { Button } from "../ui/button";
import { FaRegBookmark } from "react-icons/fa";

const BtnAddFavorite = ({
  event,
  isFavorite,
}: {
  event: Event;
  isFavorite: any;
}) => {
  const user = useCurrentUser();
  const userId = user?.id;

  const [isFav, setIsFav] = useState(isFavorite);

  //! Vérifier si l'ID du User actuelle correspond au userId d'un event --> pour afficher l'event différemment
  const isEventCreator =
    event.Organizer && event.Organizer.id
      ? userId === event.Organizer.id.toString()
      : false;

  //! Etat pour stocker le nombre de favoris et l'afficher dynamquement
  const [nbFav, setNbFav] = useState(event.nbFav);

  //! Fonction pour ajouter un event aux favoris
  const handleAddFavorite = async () => {
    try {
      if (userId === null || userId === undefined) {
        return;
      }

      startTransition(async () => {
        const nbFavResponse = await addFavoriteEvent({
          userId,
          eventId: event.id,
        });
        setIsFav(!isFav);
        if (nbFavResponse.nbFav !== undefined) {
          setNbFav(nbFavResponse.nbFav);
        }
      });
    } catch (error) {
      console.error("Erreur lors de l'ajout aux favoris", error);
    }
  };

  //! Si l'utilisateur n'est pas connecté, afficher un bouton pour le rediriger vers la page de connexion sinon le bouton ajoute aux favoris
  if (userId === null || userId === undefined) {
    return (
      <Button asChild className=" rounded-full">
        <Link href="/auth/connexion">
          <FaRegBookmark />
        </Link>
      </Button>
    );
  } else {
    return (
      <>
        {!isEventCreator ? (
          <div className="flex items-center gap-2">
            <Button onClick={handleAddFavorite} className="rounded-full">
              {/* {isFav ? "Retirer des favoris" : "Ajouter aux favoris"} */}
              <FaRegBookmark className={isFav ? "text-black bg-white" : ""} />
            </Button>
            <p className="bg-grey-400 p-2 rounded-full text-white text-[0.8rem]">
              {nbFav ?? "0"}
            </p>
          </div>
        ) : (
          <div className="flex gap-2 items-center">
            <p>{nbFav}</p>
            <FaRegBookmark />
          </div>
        )}
      </>
    );
  }
};

export default BtnAddFavorite;
