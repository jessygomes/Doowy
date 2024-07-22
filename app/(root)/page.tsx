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
        className="wrapper my-20 flex flex-col gap-8 md:gap-12"
      >
        {/* <h2 className="h2-bold">
          Trust by <br /> Thousands of Events
        </h2> */}
        <div className="flex justify-center items-center gap-8">
          <p className="font-bold text-dark dark:text-primary text-xl">
            trend!
          </p>
          <div className="w-full h-[1px] rounded-sm bg-dark dark:bg-primary"></div>
          <p className="font-bold text-xl text-dark dark:text-primary">
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

      <section className="my-20 flex flex-col gap-8 md:gap-12">
        <div className="wrapper flex justify-center items-center gap-8">
          <p className="font-bold text-dark dark:text-primary text-xl">
            Organisateur!
          </p>
          <div className="w-full h-[1px] rounded-sm bg-dark dark:bg-primary"></div>
          <p className="font-bold text-xl text-dark dark:text-primary">
            Organisateur!
          </p>
        </div>

        <div className="flex gap-12">
          <div className="w-[65%] h-[23rem] ml-[-2rem] shadow-2xl">
            <Image
              src="/assets/images/organisateur.jpg"
              alt="photo d'accueil"
              width={1000}
              height={1000}
              className="object-cover w-full h-full rounded-sm shadowCj"
            />
          </div>
          <div className="flex flex-col gap-4 justify-center">
            <div className="">
              <h1 className="h2-bold text-dark dark:text-white mr-16">
                Créez vos événements et
                <br />
                <span className=" bg-linear-text">
                  Partagez-les avec notre communauté !
                </span>
              </h1>
            </div>
            <p className="text-dark dark:text-white p-regular-20 md:p-regular-20">
              Inscris toi en tant qu&apos;organisateur pour créer tes propres
              événements et faire bouger ta ville comme tu l&apos;entends !
            </p>
            <Button size="lg" asChild className="button w-full sm:w-fit">
              <Link href="/auth/inscription/org">
                S&apos;inscrire en tant qu&apos;organisateur
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
