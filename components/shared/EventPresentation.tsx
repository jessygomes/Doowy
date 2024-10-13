import { SearchParamProps } from "@/types";
import Image from "next/image";
import Link from "next/link";

import Ripple from "@/components/magicui/ripple2";

import {
  getEventById,
  getRelatedEventsByCategory,
} from "@/lib/actions/event.actions";
import { getWishlist } from "@/lib/actions/user.actions";
import { currentUser } from "@/lib/auth";
import { formatDateTime } from "@/lib/utils";

import BtnAddFavorite from "@/components/shared/BtnAddFavorite";
import Collection from "@/components/shared/Collection";
import { Button } from "@/components/ui/button";
import { DeleteConfirmation } from "./DeleteConfirmation";

import { FaEdit } from "react-icons/fa";
import { BilleterieBtn } from "./BilleterieBtn";
import { getReservationsByEvent } from "@/lib/actions/reservation";
import { DetailEventOrgBtn } from "./DetailEventOrgBtn";

export const EventPresentation = async ({
  params: { id },
  searchParams,
}: SearchParamProps) => {
  //! Paramètre pour la recherche et les filtres : ces variables sont ensuites utilisé pour la fonction "getAllEvents" juste en dessous
  const page = Number(searchParams?.page) || 1;

  const event = await getEventById(id);
  if (!event) {
    throw new Error("Event not found");
  }

  //! Récupérer les events liés à la catégorie de l'event actuel ou département
  const relaledEvents = await getRelatedEventsByCategory({
    departementId: event?.departement || "",
    eventId: event?.id || "",
    page: searchParams.page as string,
  });

  //! Récupérer l'ID de la personnne connecté pour afficher si l'event est dans ses favoris et les afficher
  const user = await currentUser();
  const userId = user?.id;
  const role = user?.role;

  let isFavorite = false;

  //! Réupération du tableau des favoris de l'utilisateur
  if (userId !== null || userId !== undefined) {
    const favoriteEvent = await getWishlist({ userId: userId || "", page: 1 });

    //! Vérifie si l'event est dans les favoris de l'utilisateur : renvoie TRUE ou FALSE
    if (favoriteEvent && favoriteEvent.length > 0) {
      isFavorite = favoriteEvent.some(
        (favorite: any) => favorite.eventId === event?.id
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

  //! Les réservations
  const reservationsResponse = await getReservationsByEvent(
    userId || "",
    event.id
  );
  const reservations = Array.isArray(reservationsResponse)
    ? reservationsResponse
    : [];

  console.log(reservations);

  return (
    <>
      <div className="relative flex  w-screen flex-col items-end justify-end overflow-hidden bg-background shadowCj">
        <Ripple />

        <section className="wrapper flex justify-center z-20 my-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 2xl:max-w-7xl rounded-sm sm:py-10">
            <Image
              src={event.imageUrl ? event.imageUrl : ""} // Configurer le fichier next.config.js pour les images venant du serveur UploadThing
              alt={event.title ? event.title : "Event Image"}
              width={1000}
              height={1000}
              className="h-full min-g-[300px] object-cover object-center rounded-sm p-5 sm:p-0"
            />

            <div className="flex w-full flex-col gap-8 p-5 md:p-10 bg-transparent backdrop-blur-[4px] shadow-2xl rounded-sm">
              <div className="flex flex-col gap-6">
                <div className="flex justify-between items-center">
                  <h2 className="h3-bold sm:h2-bold rubik">{event.title}</h2>
                  {isEventCreator ? (
                    <div className="absolute right-4 top-7 flex gap-4">
                      <Link href={`/events/${event.id}/update`}>
                        <FaEdit
                          size={25}
                          className="text-white hover:text-second"
                        />
                      </Link>
                      <DeleteConfirmation eventId={event.id} />
                    </div>
                  ) : (
                    <BtnAddFavorite isFavorite={isFavorite} event={event} />
                  )}
                </div>

                <div className="flex flex-col sm:justify-between items-center gap-3 sm:flex-row sm:items-center">
                  <div className="flex gap-3">
                    <p className="p-bold-16 rubik rounded-sm bg-primary-500 text-white dark:bg-dark-500 dark:text-white px-5 py-2">
                      {event.isFree ? "Gratuit" : `${event.price} €`}
                    </p>
                    <p className="p-medium-16 rubik rounded-sm bg-grey-500/30 px-4 py-2.5 text-grey-500">
                      {event.Category?.name}
                    </p>
                  </div>

                  <p className="p-medium-14 rubik ml-2 mt-2 sm:mt-0">
                    par{" "}
                    <Link
                      href={`/profil/${event?.organizer}`}
                      className="text-primary-500 hover:text-second transition-all ease-in-out duration-300"
                    >
                      {event?.Organizer.organizationName}
                    </Link>
                  </p>
                </div>
              </div>
              {/* Checkout Button */}
              <div className="flex flex-col gap-5">
                <div className="flex items-center gap-2 md:gap-3">
                  <Image
                    src="/assets/icons/calendar.svg"
                    alt="Calendar Icon"
                    width={32}
                    height={32}
                  />
                  {isPastEvent && event ? (
                    <p className="p-medium-16 rubik text-red-400 flex flex-wrap items-center">
                      Cette événement s&apos;est terminé le{" "}
                      {new Date(event.endDateTime).toLocaleDateString("fr-FR")}
                    </p>
                  ) : isEnCours ? (
                    <div className="p-regular-16 flex flex-wrap items-center gap-1">
                      <p className="p-medium-14 text-white rubik">En cours</p>
                      <p>
                        {formatDateTime(event.endDateTime).dateOnly} -{" "}
                        {formatDateTime(event.endDateTime).timeOnly}
                      </p>
                    </div>
                  ) : (
                    <div className="rubik p-regular-16 flex flex-wrap items-center gap-1">
                      <p>
                        {formatDateTime(event.startDateTime).dateOnly ?? ""} -{" "}
                        {formatDateTime(event.startDateTime).timeOnly} |{" "}
                      </p>
                      <p>
                        {formatDateTime(event.endDateTime).dateOnly} -{" "}
                        {formatDateTime(event.endDateTime).timeOnly}
                      </p>
                    </div>
                  )}
                </div>

                <div className="rubik p-regular-20 flex items-center gap-3">
                  <Image
                    src="/assets/icons/location.svg"
                    alt="Location"
                    width={32}
                    height={32}
                  />
                  <p className="p-regular-16">
                    {event?.location}, {event?.ville}, {event.departement}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2 rubik">
                <p className="p-bold-20 text-grey-600">
                  Ce qu&apos;il faut savoir :{" "}
                </p>
                <p className="p-regular-16 lg:p-regular-16">
                  {event?.description}
                </p>

                {/* <p className="p-medium-16 lg:p-regular-18 truncate text-primary-500 underline">
            {event.url}
            </p> */}
              </div>
              <div className="flex justify-center items-center gap-8">
                {role === "organizer" ? (
                  <>
                    <DetailEventOrgBtn
                      eventId={event.id}
                      reservations={reservations}
                    />
                    <p className="text-white">
                      Nombre de place restantes : {event.stock} sur{" "}
                      {event.maxPlaces}
                    </p>
                  </>
                ) : (
                  <BilleterieBtn
                    eventId={event.id}
                    eventPrice={event.price || ""}
                    userId={userId || ""}
                  />
                )}
                {/* <Link href={event?.url ? event.url : ""} className="w-full">
                  <Button className="button rounded-sm uppercase rubik w-full">
                    Prendre mon billet
                  </Button>
                </Link> */}
              </div>
            </div>
            <div>
              <h2 className="text-white h3-bold">DETAILS DE L&apos;EVENT</h2>
              <div></div>
            </div>
          </div>
        </section>
      </div>

      {/* EVENT FROM THE SAME ORGANIZER */}
      {role !== "organizer" && (
        <section className="mt-8 shadowCj pb-8">
          <div className="wrapper flex flex-col gap-8 md:gap-12">
            <h2 className="h3-bold rubik">D&apos;autres événements</h2>

            <Collection
              data={relaledEvents?.data || []}
              emptyTitle="Aucun Event Trouvé"
              emptyStateSubtext="Revenir plus tard"
              collectionType="All_Events"
              limit={3}
              page={page}
              totalPages={relaledEvents?.totalPages}
            />
          </div>
        </section>
      )}
    </>
  );
};
