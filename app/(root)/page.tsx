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

  console.log("user", userId);

  return (
    <>
      {userId === undefined && (
        <section className="wrapper bg-dotted-pattern bg-contain">
          <div className="flex flex-col sm:justify-center sm:pt-5 lg:pt-2">
            <div className="flex flex-col justify-center items-center gap-4">
              <div className="w-full h-[20rem] sm:w-full sm:h-[10rem] lg:w-2/3 lg:h-[20rem]">
                <Image
                  src="/assets/images/accueilImg.jpg"
                  alt="photo d'accueil"
                  width={2000}
                  height={2000}
                  className="object-cover w-full h-full rounded-sm"
                />
              </div>
              <h1 className="h1-bold text-dark dark:text-white sm:text-center">
                Connectez-vous <br />
                <span className=" bg-linear-text">
                  aux événements de votre ville!
                </span>
              </h1>
              <Button size="lg" asChild className="button w-full sm:w-fit">
                <Link href="#events" className="font-bold tracking-widest">
                  EXPLORER
                </Link>
              </Button>
              {/* <div className="text-center"></div> */}
            </div>
          </div>
          {/* <div className="wrapper">
          <p className="text-dark dark:text-white p-regular-20 md:p-regular-20">
            Créer et poste ton événement, rejoins notre communauté pour être au
            courant du moindre event de ta ville.
          </p>
        </div> */}
        </section>
      )}

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
        className="wrapper my-10 lg:my-20 flex flex-col gap-8 md:gap-12"
      >
        {/* <h2 className="h2-bold">
          Trust by <br /> Thousands of Events
        </h2> */}
        <div className="flex justify-center items-center gap-8 py-5">
          <p className="font-bold text-dark dark:text-primary text-xl">
            trend!
          </p>
          <div className="w-full h-[1px] rounded-sm bg-dark dark:bg-primary"></div>
          <p className="hidden sm:block font-bold text-xl text-dark dark:text-primary">
            trend!
          </p>
        </div>
        {/* <h2 className="h2-bold">
          Découvrez les événements proche de chez vous !
        </h2> */}

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

      {userId === undefined && (
        <section className="my-10 sm:my-20 flex flex-col">
          <div className="wrapper flex justify-center items-center gap-8 lg:mb-2">
            <p className="font-bold text-dark dark:text-primary text-xl">
              Organisateur!
            </p>
            <div className="w-full h-[1px] rounded-sm bg-dark dark:bg-primary"></div>
            <p className="hidden sm:block font-bold text-xl text-dark dark:text-primary">
              Organisateur!
            </p>
          </div>

          <div className="wrapper flex flex-col justify-center items-center gap-4">
            <div className="w-full h-[20rem] sm:w-full sm:h-[10rem] lg:w-2/3 lg:h-[20rem]">
              <Image
                src="/assets/images/organisateur.jpg"
                alt="photo d'accueil"
                width={1000}
                height={1000}
                className="object-cover w-full h-full rounded-sm"
              />
            </div>
            <h1 className="h2-bold text-dark dark:text-white sm:text-center lg:text-left lg:w-2/3">
              Créez vos événements et
              <br />
              <span className="bg-linear-text">
                Partagez-les avec notre communauté!
              </span>
            </h1>
            <div className="flex flex-col items-center gap-4 lg:w-2/3">
              <p className="text-dark dark:text-white p-regular-10 md:p-regular-16">
                Inscris toi en tant qu&apos;organisateur pour créer tes propres
                événements et faire bouger ta ville comme tu l&apos;entends !
              </p>
            </div>
          </div>
          <div className="wrapper flex-center">
            <Button size="lg" asChild className="button w-full sm:w-fit">
              <Link href="/auth/inscription/org">
                S&apos;inscrire en tant qu&apos;organisateur
              </Link>
            </Button>
          </div>
        </section>
      )}
    </>
  );
}
