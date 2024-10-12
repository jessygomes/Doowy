import Link from "next/link";
import Image from "next/image";

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

import Ripple from "@/components/magicui/ripple";
import BlurIn from "@/components/magicui/blur-in";

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
  console.log(user);

  if (user?.role === "admin") {
    return (
      <div className="flex justify-center items-center">
        <div className="relative flex h-screen w-screen flex-col items-end justify-end overflow-hidden bg-background shadowCj">
          <Ripple />
          <section className="sm:wrapper z-20">
            <div className="wrapper flex flex-col sm:justify-end sm:pt-5 lg:pt-2">
              <div className=" flex flex-col justify-end items-end lg:justify-center lg:items-center gap-4">
                <h1 className="h1-bold text-dark dark:text-white sm:text-center rubik uppercase">
                  <BlurIn word="Administration" className="" />
                  <BlurIn
                    word="vibey! - Gestion des événements"
                    className="bg-linear-text h1-bold"
                  />
                </h1>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-center items-center">
        {userId === undefined && (
          <div className="relative flex h-screen w-screen flex-col items-end justify-end overflow-hidden bg-background shadowCj">
            <div className="bg-white">
              <Ripple />
            </div>
            <section className="sm:wrapper z-20">
              <div className="wrapper flex flex-col sm:justify-end sm:pt-5 lg:pt-2">
                <div className=" flex flex-col justify-end items-end lg:justify-center lg:items-center gap-4">
                  <h1 className="h1-bold text-dark dark:text-white sm:text-center rubik uppercase">
                    <BlurIn word="Connectez-vous" className="" />
                    <BlurIn
                      word="aux événements de votre ville!"
                      className="bg-linear-text h1-bold"
                    />
                  </h1>
                  <Button
                    size="sm"
                    asChild
                    className="button w-full sm:w-52 lg:w-fit"
                  >
                    <Link href="#events" className="font-bold tracking-widest">
                      EXPLORER
                    </Link>
                  </Button>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* SECTION SUBSCRIPTION */}
        {userId && (
          <>
            <div className="relative flex  w-screen flex-col items-start justify-start overflow-hidden bg-background shadowCj pt-16 sm:pt-20">
              <Ripple />
              <section className="wrapper z-20">
                <EventSuscription
                  searchParams={{
                    page,
                    params: {
                      id: "",
                    },
                    searchParams: {},
                  }}
                />
              </section>
            </div>
          </>
        )}
      </div>

      {/* SECTION TREND */}
      <div className="bg-gradient-to-t from-[#9000ff73]  to-[#ff4000c0] shadowCj">
        <section
          id="events"
          className="wrapper py-10 lg:py-20 flex flex-col gap-8 md:gap-12"
        >
          <div className="flex justify-start items-center gap-8 pt-5 kronaOne">
            <p className="h4-bold sm:h3-bold text-white uppercase">
              TREND! - évenements populaires
            </p>
          </div>

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
            <Button asChild className="button w-full sm:w-fit uppercase">
              <Link href="/events" className="">
                Voir tous les événements
              </Link>
            </Button>
          </div>
        </section>
      </div>

      {/* SECTION ORGANISATEUR */}
      {userId === undefined && (
        <section
          id="organisateur"
          className="mt-10 flex flex-col bg-dark shadowCj pb-8"
        >
          <div className="wrapper flex justify-start items-center gap-8  kronaOne">
            <p className="h4-bold sm:h4-bold text-white uppercase">
              Organisateur! - Organiser son évenement
            </p>
          </div>

          <section className="sm:wrapper">
            <div className="wrapper flex flex-col sm:justify-end sm:pt-5 lg:pt-2 z-20">
              <div className="flex flex-col justify-start items-start gap-4">
                <h1 className="h1-bold text-dark dark:text-white sm:text-left rubik uppercase">
                  Créez vos évenements et <br />
                  <span className="bg-linear-text">
                    Partagez-les avec la communauté!
                  </span>
                </h1>
                <p className="p-regular-16 md:p-regular-18 rbik">
                  Vous êtes une association, un particulier ou un professionnel
                  et vous souhaitez organiser des événements dans votre région ?
                </p>
                <Button size="sm" asChild className="button w-full lg:w-fit">
                  <Link
                    href="/organisateur"
                    className="font-bold tracking-widest uppercase"
                  >
                    S&apos;inscrire en tant qu&apos;organisateur
                  </Link>
                </Button>
              </div>
            </div>
          </section>
        </section>
      )}
    </>
  );
}
