import Image from "next/image";
import Link from "next/link";

import { currentUser } from "@/lib/auth";
import { formatDateTime } from "@/lib/utils";

import { Event } from "@/types";
import { DeleteConfirmation } from "./DeleteConfirmation";

import { FaEdit } from "react-icons/fa";

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

  //! Vérifier si le User est le créateur de l'event
  const isEventCreator = event.organizer ? userId === event.organizer : false;

  console.log("ID ORG", event.organizer);

  const isAdmin = user?.role === "admin";

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
        <div className="absolute right-2 top-2 flex gap-4 rounded-sm transition-all">
          <Link href={`/events/${event.id}/update`}>
            <FaEdit size={25} className="text-white hover:text-second" />
          </Link>

          <DeleteConfirmation eventId={event.id} />
        </div>
      )}

      {isAdmin && !hidePrice && (
        <div className="absolute right-2 top-2 flex flex-col gap-4 rounded-sm p-3 transition-all">
          <Link href={`/events/${event.id}/update`}>
            <FaEdit size={25} className="text-white hover:text-second" />
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
                  {event.departement === "100" ? "Online" : event.departement}
                </p>
              </div>
            )}
          </div>

          {/* ORGANISATEUR */}
          <div className="flex-between w-full">
            <Link
              href={`/profil/${event.organizer}`}
              className="p-medium-12 md:p-medium-12 hover:text-second transition-all ease-in-out duration-300"
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
