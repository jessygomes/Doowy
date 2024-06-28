import { CategoryFilter } from "@/components/shared/CategoryFilter";
import Collection from "@/components/shared/Collection";
import { DepartementFilter } from "@/components/shared/DepartementFilter";
import { EventSuscription } from "@/components/shared/EventSuscription";
import { Search } from "@/components/shared/Search";
import { Button } from "@/components/ui/button";
import { departements } from "@/constants";
import { getAllUpcomingEvents } from "@/lib/actions/event.actions";
import { SearchParamProps } from "@/types";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

export default async function Home({ searchParams }: SearchParamProps) {
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
    limit: 6,
    nbFav: 0,
  });

  //! Récupérer l'ID de la personnne connecté pour afficher les events auxquels il est abonné
  const { sessionClaims } = auth();
  const userId = sessionClaims?.userId as string;

  return (
    <>
      <section className="bg-primary-50 bg-dotted-pattern bg-contain py-5 md:py-10">
        <div className="wrapper grid grid-cols-1 gap-5 md:grid-cols-2 2xl:gap-0">
          <div className="flex flex-col justify-center gap-8">
            <h1 className="h1-bold">
              Vos Evénements, Notre plateforme{" "}
              <span className=" text-gray-600">
                Connectez-vous au event de votre ville !
              </span>
            </h1>
            <p className="p-regular-20 md:p-regular-24">
              Créer et poste ton événement, rejoins notre communauté pour être
              au courant du moindre event de ta ville.
            </p>
            <Button size="lg" asChild className="button w-full sm:w-fit">
              <Link href="#events">Explorer</Link>
            </Button>
          </div>
        </div>
      </section>

      {userId && (
        <EventSuscription
          userId={userId}
          searchParams={{
            page: function (page: any): unknown {
              throw new Error("Function not implemented.");
            },
            params: {
              id: "",
            },
            searchParams: {},
          }}
        />
      )}

      <section
        id="events"
        className="wrapper my-8 flex flex-col gap-8 md:gap-12"
      >
        {/* <h2 className="h2-bold">
          Trust by <br /> Thousands of Events
        </h2> */}
        <h2 className="h2-bold">
          Découvrez les événements proche de chez vous !
        </h2>

        <div className="flex w-full flex-col gap-5 md:flex-row">
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

      <Link href="/events" className="bg-black">
        <Button asChild className="button w-full">
          Voir tous les événements
        </Button>
      </Link>
    </>
  );
}
