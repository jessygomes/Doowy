import { SearchParamProps } from "@/types";
import { getAllUpcomingEvents } from "@/lib/actions/event.actions";
import { departements } from "@/constants";

import { CategoryFilter } from "@/components/shared/CategoryFilter";
import Collection from "@/components/shared/Collection";
import { DepartementFilter } from "@/components/shared/DepartementFilter";
import { Search } from "@/components/shared/Search";

export default async function Events({ searchParams }: SearchParamProps) {
  //! Paramètre pour la recherche et les filtres : ces variables sont ensuites utilisé pour la fonction "getAllEvents" juste en dessous
  const page = Number(searchParams?.page) || 1;
  const searchText = (searchParams?.query as string) || "";
  const category = (searchParams?.category as string) || "";
  const departement = (searchParams?.departement as string) || "";

  //! Récupérer tous les Events (trier ceux qu sont déja passé)
  const events = await getAllUpcomingEvents({
    query: searchText,
    category,
    departement,
    page,
    limit: 10,
    nbFav: 0,
  });

  return (
    <section id="events" className="wrapper my-8 flex flex-col gap-8 md:gap-12">
      {/* <h2 className="h2-bold">
    Trust by <br /> Thousands of Events
  </h2> */}
      <h2 className="h2-bold">Events</h2>

      <div className="flex w-full flex-col gap-5 md:flex-row">
        <Search />
        <CategoryFilter />
        <DepartementFilter departements={departements.departements} />
      </div>

      <Collection
        data={events.data}
        emptyTitle="Aucun Event Trouvé"
        emptyStateSubtext="Revenir plus tard"
        collectionType="All_Events"
        limit={6}
        page={page}
        totalPages={events?.totalPages}
      />
    </section>
  );
}
