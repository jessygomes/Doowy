"use client";
import { IEvent } from "@/lib/mongoDb/database/models/Event";
import { Button } from "../ui/button";
import { SignedIn, SignedOut, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { addFavoriteEvent } from "@/lib/actions/user.actions";
import { useState } from "react";

const BtnAddFavorite = ({
  event,
  isFavorite,
}: {
  event: IEvent;
  isFavorite: any;
}) => {
  const { user } = useUser();
  const userId = user?.publicMetadata.userId as string;
  // const hasEventFinished = new Date(event.endDateTime) < new Date();

  const [isFav, setIsFav] = useState(isFavorite);

  //! Vérifier si l'ID du User actuelle correspond au userId d'un event --> pour afficher l'event différemment
  // const isEventCreator = userId === event.organizer._id.toString();
  const isEventCreator =
    event.organizer && event.organizer._id
      ? userId === event.organizer._id.toString()
      : false;

  const [isLiked, setIsLiked] = useState(false);

  const handleAddFavorite = async () => {
    try {
      await addFavoriteEvent({ userId, eventId: event._id });

      setIsFav(!isFav);
    } catch (error) {
      console.error("Erreur lors de l'ajout aux favoris", error);
    }
  };

  return (
    <>
      <SignedOut>
        <Button asChild className=" rounded-full">
          <Link href="/sign-in">Ajouter aux favoris</Link>
        </Button>
      </SignedOut>

      <SignedIn>
        {!isEventCreator ? (
          <Button onClick={handleAddFavorite} className="rounded-full">
            {isFav ? "Retirer des favoris" : "Ajouter aux favoris"}
          </Button>
        ) : (
          <Button disabled className="rounded-full">
            {event.nbFav} favoris
          </Button>
        )}
      </SignedIn>
    </>
  );
};

export default BtnAddFavorite;
