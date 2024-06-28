import { CategoryFilter } from "@/components/shared/CategoryFilter";
import Collection from "@/components/shared/Collection";
import { DepartementFilter } from "@/components/shared/DepartementFilter";
import { Search } from "@/components/shared/Search";
import { SearchParamProps } from "@/types";
import { departements } from "@/constants";
import { getAllEvents } from "@/lib/actions/event.actions";

export default async function Events({ searchParams }: SearchParamProps) {
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
    limit: 10,
    nbFav: 0,
  });

  const currentDateTime = new Date();

  const upcomingEvents = events?.data.filter((event: any) => {
    const endDateTime = new Date(event.endDateTime);
    return currentDateTime <= endDateTime;
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
        data={upcomingEvents}
        emptyTitle="Aucun Event Trouvé"
        emptyStateSubtext="Revenir plus tard"
        collectionType="All_Events"
        limit={6}
        page={page}
        totalPages={upcomingEvents?.totalPages}
      />
    </section>
  );
}
