// import { SearchParamProps } from "@/types";
import { getAllUpcomingEvents } from "@/lib/actions/event.actions";
import { departements } from "@/constants";

import { CategoryFilter } from "@/components/shared/CategoryFilter";
import Collection from "@/components/shared/Collection";
import { DepartementFilter } from "@/components/shared/DepartementFilter";
import { Search } from "@/components/shared/Search";
import Ripple from "@/components/magicui/ripple";

export default async function Events({
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
  const events = await getAllUpcomingEvents({
    query: searchText,
    category,
    departement,
    page,
    limit: 10,
    nbFav: 0,
  });

  return (
    <div className="relative flex h-screen w-screen flex-col items-end justify-end overflow-hidden bg-background shadowCj">
      <Ripple />
      <section
        id="events"
        className="wrapper my-30 flex flex-col gap-8 md:gap-12"
      >
        {/* <h2 className="h2-bold">
    Trust by <br /> Thousands of Events
  </h2> */}
        <div className="flex justify-start items-center gap-8 mt-10 kronaOne">
          <p className="h3-bold text-dark dark:text-white text-xl uppercase">
            tous les évenements
          </p>
        </div>

        <div className="flex w-full flex-col gap-5 md:flex-row z-20">
          <Search />
          <CategoryFilter />
          <DepartementFilter departements={departements.departements} />
        </div>

        <Collection
          data={events?.data}
          emptyTitle="Aucun Event Trouvé"
          emptyStateSubtext="Revenir plus tard"
          collectionType="All_Events"
          limit={6}
          page={page}
          totalPages={events?.totalPages}
        />
      </section>
    </div>
  );
}
