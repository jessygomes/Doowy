import React from "react";

import { getAllEvents } from "@/lib/actions/event.actions";
import { departements } from "@/constants";

import Collection from "@/components/shared/Collection";
import { CategoryFilter } from "@/components/shared/CategoryFilter";
import { DepartementFilter } from "@/components/shared/DepartementFilter";
import { Search } from "@/components/shared/Search";
import Ripple from "@/components/magicui/ripple";
import { Event } from "@/types";

export default async function EventAdminPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  //! Paramètre pour la recherche et les filtres : ces variables sont ensuites utilisé pour la fonction "getAllEvents" juste en dessous
  const page = Number(searchParams?.page) || 1;
  const searchText = (searchParams?.query as string) || "";
  const category = (searchParams?.category as string) || "";
  const departement = (searchParams?.departement as string) || "";

  //! Récupérer tous les Events (trier ceux qu sont déja passé)
  const events = await getAllEvents({
    query: searchText,
    category,
    departement,
    page,
    limit: 6,
    nbFav: 0,
  });

  const currentDate = new Date();

  const ongoingEvents: Event[] = [];
  const upcomingEvents: Event[] = [];
  const pastEvents: Event[] = [];

  if (events && Array.isArray(events.data)) {
    events.data.forEach((event: any) => {
      const eventStartDate = new Date(event.startDateTime);
      const eventEndDate = new Date(event.endDateTime);

      if (eventStartDate <= currentDate && eventEndDate >= currentDate) {
        ongoingEvents.push(event);
      } else if (eventStartDate > currentDate) {
        upcomingEvents.push(event);
      } else if (eventEndDate < currentDate) {
        pastEvents.push(event);
      }
    });
  }
  const limit = 6;

  const ongoingEventsTotalPages = Math.ceil(ongoingEvents.length / limit);
  const upcomingEventsTotalPages = Math.ceil(upcomingEvents.length / limit);
  const pastEventsTotalPages = Math.ceil(pastEvents.length / limit);

  return (
    <>
      <div className="relative flex h-min-screen w-screen flex-col items-end justify-end overflow-hidden bg-background pb-8 shadowCj">
        <Ripple />
        <section
          id="events"
          className="wrapper my-30 flex flex-col gap-8 md:gap-12"
        >
          <div className="flex justify-start items-center gap-8 mt-20 kronaOne">
            <p className="h4-bold text-white text-xl uppercase z-10">
              tous les évenements | En cours
            </p>
          </div>

          <div className="flex w-full flex-col gap-5 md:flex-row z-20">
            <Search />
            <CategoryFilter />
            <DepartementFilter departements={departements.departements} />
          </div>

          <Collection
            data={ongoingEvents}
            emptyTitle="Aucun Event Trouvé"
            emptyStateSubtext="Revenir plus tard"
            collectionType="All_Events"
            limit={6}
            page={page}
            totalPages={ongoingEventsTotalPages}
          />
        </section>

        <section
          id="events"
          className="wrapper my-30 flex flex-col gap-8 md:gap-12"
        >
          <div className="flex justify-start items-center gap-8 mt-20 kronaOne">
            <p className="h4-bold text-white text-xl uppercase z-10">
              tous les évenements | à venir
            </p>
          </div>

          <div className="flex w-full flex-col gap-5 md:flex-row z-20">
            <Search />
            <CategoryFilter />
            <DepartementFilter departements={departements.departements} />
          </div>

          <Collection
            data={upcomingEvents}
            emptyTitle="Aucun Event Trouvé"
            emptyStateSubtext="Revenir plus tard"
            collectionType="All_Events"
            limit={6}
            page={page}
            totalPages={upcomingEventsTotalPages}
          />
        </section>
      </div>

      <section
        id="events"
        className="wrapper my-30 flex flex-col gap-8 md:gap-12"
      >
        <div className="flex justify-start items-center gap-8 mt-10 kronaOne">
          <p className="h4-bold text-white text-xl uppercase z-10">
            tous les évenements | passés
          </p>
        </div>

        <div className="flex w-full flex-col gap-5 md:flex-row z-20">
          <Search />
          <CategoryFilter />
          <DepartementFilter departements={departements.departements} />
        </div>

        <Collection
          data={pastEvents}
          emptyTitle="Aucun Event Trouvé"
          emptyStateSubtext="Revenir plus tard"
          collectionType="All_Events"
          limit={6}
          page={page}
          totalPages={pastEventsTotalPages}
        />
      </section>
    </>
  );
}
