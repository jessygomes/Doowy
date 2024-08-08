import { formatDateTime } from "@/lib/utils";

import Image from "next/image";
import Link from "next/link";
import { DeleteConfirmation } from "./DeleteConfirmation";
import BtnAddFavorite from "./BtnAddFavorite";
import { Event } from "@/types";
import { getWishlist } from "@/lib/actions/user.actions";

import { currentUser } from "@/lib/auth";

type CardProps = {
  event: Event;
  hasOrderLink: boolean;
  hidePrice: boolean;
  removeFavorite: boolean;
};

const Card = async ({
  event,
  hasOrderLink,
  hidePrice,
  removeFavorite,
}: CardProps) => {
  //! Vérifier si l'ID du User actuelle correspond au userId d'un event --> pour afficher l'event différemment
  const user = await currentUser();
  const userId = user?.id;

  let isFavorite = false;

  //! Réupération du tableau des favoris de l'utilisateur
  if (userId !== null || userId !== undefined) {
    const favoriteEvent = await getWishlist({ userId: userId || "", page: 1 });

    //! Vérifie si l'event est dans les favoris de l'utilisateur : renvoie TRUE ou FALSE
    if (favoriteEvent && favoriteEvent.length > 0) {
      isFavorite = favoriteEvent.some(
        (favorite: any) => favorite.eventId === event.id
      );
    }
  }

  //! Vérifier si le User est le créateur de l'event
  const isEventCreator = event.organizer ? userId === event.organizer : false;

  //! Vérifier si l'event est passé ou pas :
  const currentDateTime = new Date();
  const startDateTime = new Date(event.startDateTime);
  const endDateTime = new Date(event.endDateTime);
  const isPastEvent = currentDateTime > endDateTime;
  const isEnCours =
    currentDateTime >= startDateTime && currentDateTime <= endDateTime;

  return (
    <div
      className="group relative flex min-h-[320px] w-full max-w-[400px] flex-col gap-1 overflow-hidden rounded-sm transition-all md:min-h-[350px] backdrop-blur-sm"
      // style={{
      //   backgroundImage: `url(${event.imageUrl})`,
      //   // backgroundPosition: "center",
      // }}
    >
      <div className="relative h-full w-full overflow-hidden ">
        <Link
          href={`/events/${event.id}`}
          style={{ backgroundImage: `url(${event.imageUrl})` }}
          className="flex-center h-full w-full bg-grey-50 bg-cover bg-center transition-transform duration-300 ease-in-out transform hover:scale-110 shadow-xl"
        />
      </div>

      {/* IS EVENT CREATOR */}
      {isEventCreator && !hidePrice && (
        <div className="absolute right-2 top-2 flex flex-col gap-4 rounded-sm bg-white p-3 transition-all">
          <Link href={`/events/${event.id}/update`}>
            <Image
              src="/assets/icons/edit.svg"
              alt="edit"
              width={20}
              height={20}
              className="rounded-sm"
            />
          </Link>

          <DeleteConfirmation eventId={event.id} />
        </div>
      )}

      {/* DIV INFOS EVENT */}
      <div className="flex flex-row justify-between rounded-b-sm px-2 py-1 backdrop-blur-lg shadow-xl">
        <div className="flex flex-col gap-2">
          {/* TITRE */}
          <Link href={`/events/${event.id}`}>
            <p className="p-medium-16 md:p-medium-20 line-clamp-2 flex-1 text-black">
              {event.title}
            </p>
          </Link>

          {/* DATE ET LIEU */}
          <div className="flex justify-between gap-4">
            {isPastEvent ? (
              <p className="p-medium-12 text-red-400">
                Terminé le{" "}
                {new Date(event.endDateTime).toLocaleDateString("fr-FR")}
              </p>
            ) : isEnCours ? (
              <>
                <p className="p-medium-12 text-primary">En cours</p>
                <p className="p-medium-12 p-medium-18 text-grey-500">
                  {event.location}
                </p>
              </>
            ) : (
              <div className="w-full flex justify-between gap-2">
                <Image
                  src="/assets/icons/calendar.svg"
                  width={15}
                  height={15}
                  alt="calendrier icon"
                />
                <p className="p-medium-14 p-medium-18 text-grey-500">
                  {formatDateTime(event.startDateTime).dateTime}
                </p>
                <Image
                  src="/assets/icons/location-grey.svg"
                  width={15}
                  height={15}
                  alt="location icon"
                />
                <p className="p-medium-14 p-medium-18 text-grey-500">
                  {event.departement}
                </p>
              </div>
            )}
          </div>

          {/* ORGANISATEUR */}
          <div className="flex-between w-full">
            <Link
              href={`/profil/${event.Organizer?.id}`}
              className="p-medium-12 md:p-medium-12 hover:text-grey-500 dark:hover:text-grey-500"
            >
              {event.Organizer?.organizationName}
            </Link>
            {/* {hasOrderLink && (
            <Link href={`/orders?eventId=${event._id}`} className="flex gap-2">
              <p className=" text-primary-500">Order Details</p>
              <Image
                src="/assets/icons/arrow.svg"
                alt="search"
                width={10}
                height={10}
              />
            </Link>
          )} */}
          </div>
        </div>

        {/* PRIX ET CATEGORIE */}
        <div className="flex flex-col gap-3 md:gap-4">
          {!hidePrice && (
            <div className="h-full flex flex-col justify-center gap-2">
              <p className="p-semibold-14 w-full rounded-sm bg-primary-500 text-white dark:bg-dark-500 dark:text-white px-4 py-1 line-clamp-1 text-center">
                {event.isFree ? "Gratuit" : `${event.price}€`}
              </p>
              <p className="p-semibold-14 w-full rounded-sm bg-grey-500/10 px-4 py-1 text-grey-500 line-clamp-1">
                {event.Category?.name}
              </p>
            </div>
          )}
        </div>
        {/* <BtnAddFavorite isFavorite={isFavorite} event={event} /> */}
      </div>
    </div>
  );
};

export default Card;
