"use client";
import Link from "next/link";
import { startTransition, useState } from "react";

import { addFavoriteEvent } from "@/lib/actions/user.actions";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Event } from "@/types";

import { Button } from "../ui/button";
import { MdOutlineFavorite } from "react-icons/md";

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
      <Button asChild className="rounded-full">
        <Link href="/auth/connexion">
          <MdOutlineFavorite />
        </Link>
      </Button>
    );
  } else {
    return (
      <>
        {!isEventCreator ? (
          <div className="flex items-center rounded-sm">
            <Button
              onClick={handleAddFavorite}
              className="bg-transparent hover:bg-transparent rounded-sm"
            >
              {/* {isFav ? "Retirer des favoris" : "Ajouter aux favoris"} */}
              <MdOutlineFavorite
                size={30}
                className={
                  isFav
                    ? "text-second hover:text-third transition-all ease-in-out duration-300"
                    : "text-white hover:text-third transition-all ease-in-out duration-300"
                }
              />
            </Button>
            {/* <p className=" text-white rubik text-[0.8rem]">{nbFav ?? "0"}</p> */}
          </div>
        ) : (
          <div className="flex gap-2 items-center">
            <p>{nbFav}</p>
            <MdOutlineFavorite />
          </div>
        )}
      </>
    );
  }
};

export default BtnAddFavorite;
