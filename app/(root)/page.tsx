import Link from "next/link";

import { getAllUpcomingEvents } from "@/lib/actions/event.actions";
import { SearchParamProps } from "@/types";
import { currentUser } from "@/lib/auth";
import { departements } from "@/constants";

import { CategoryFilter } from "@/components/shared/CategoryFilter";
import Collection from "@/components/shared/Collection";
import { DepartementFilter } from "@/components/shared/DepartementFilter";
import { EventSuscription } from "@/components/shared/EventSuscription";
import { Search } from "@/components/shared/Search";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default async function Home({
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
    limit: 6,
    nbFav: 0,
  });

  //! Récupérer l'ID de la personnne connecté pour afficher les events auxquels il est abonné
  const user = await currentUser();
  const userId = user?.id;

  return (
    <>
      <section className=" bg-dotted-pattern bg-contain py-5 md:py-20">
        <div className="flex gap-12">
          <div className="w-[65%] h-[23rem] ml-[-2rem] shadow-2xl">
            <Image
              src="/assets/images/accueilImg.jpg"
              alt="photo d'accueil"
              width={1000}
              height={1000}
              className="object-cover w-full h-full rounded-sm shadowCj"
            />
          </div>
          <div className="flex flex-col justify-center">
            <div className="wrapper ">
              <h1 className="h1-bold text-dark dark:text-white">
                Connectez-vous
                <br />
                <span className=" bg-linear-text">
                  aux événements de votre ville !
                </span>
              </h1>
            </div>
            <Button size="lg" asChild className="button w-full sm:w-fit">
              <Link href="#events">Explorer</Link>
            </Button>
          </div>
        </div>
        {/* <div className="wrapper">
          <p className="text-dark dark:text-white p-regular-20 md:p-regular-20">
            Créer et poste ton événement, rejoins notre communauté pour être au
            courant du moindre event de ta ville.
          </p>
        </div> */}
      </section>

      {userId && (
        <EventSuscription
          searchParams={{
            page,
            params: {
              id: "",
            },
            searchParams: {},
          }}
        />
      )}

      <section
        id="events"
        className="wrapper  my-8 flex flex-col gap-8 md:gap-12"
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
          <DepartementFilter
            departements={departements.departements}
            userDepartement={user?.departement}
          />
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

        <div className="flex justify-center">
          <Button asChild className="button w-full sm:w-fit">
            <Link href="/events" className="">
              Voir tous les événements
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
