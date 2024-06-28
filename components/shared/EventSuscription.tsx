import { SearchParamProps } from "@/types";
import React from "react";
import Collection from "./Collection";
import { getEventSubscriptions } from "@/lib/actions/user.actions";

interface EventSuscriptionsProps {
  userId: string;
  searchParams: SearchParamProps;
}

export const EventSuscription = async ({
  userId,
  searchParams,
}: EventSuscriptionsProps) => {
  const page = Number(searchParams?.page) || 1;

  let eventsAbonnements;

  if (userId) {
    eventsAbonnements = await getEventSubscriptions({
      userId,
      page,
      limit: 6,
    });
  }

  return (
    <section id="events" className="wrapper my-8 flex flex-col gap-8 md:gap-12">
      <h2 className="h2-bold">
        <span className="text-grey-400">A VENIR | </span> Mes abonnements
      </h2>

      <Collection
        data={eventsAbonnements?.data}
        emptyTitle="Aucun Event Trouvé"
        emptyStateSubtext="Revenir plus tard"
        collectionType="All_Events"
        limit={6}
        page={page}
        totalPages={eventsAbonnements?.totalPages}
      />
    </section>
  );
};
