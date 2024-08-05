import Link from "next/link";
import Image from "next/image";
import { signOut } from "@/auth";
import { SearchParamProps } from "@/types";

import {
  getUserByIdForProfile,
  getWishlist,
  getWishlistProfil,
} from "@/lib/actions/user.actions";
import {
  getEventsByUser,
  getEventsByUserForPrivateProfl,
} from "@/lib/actions/event.actions";
import { currentUser } from "@/lib/auth";

import { Button } from "@/components/ui/button";
import Collection from "@/components/shared/Collection";
import { PersonnesFollowers } from "@/components/shared/PersonnesFollowers";
import { PersonnesSuivies } from "@/components/shared/PersonnesSuivies";
import { FaUser, FaCertificate, FaPen } from "react-icons/fa";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Boxes } from "@/components/ui/background-boxes";

import { CiInstagram } from "react-icons/ci";
import { FaXTwitter } from "react-icons/fa6";
import { FaTiktok } from "react-icons/fa";

export default async function ProfilPrivate({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  //! Récupérer l'utilisateur connecté et son ID (mettre une chaine de caractère vide si l'utilisateur n'est pas trouvé pour éviter les erreurs)
  const user = await currentUser();
  if (!user) {
    throw new Error("User not found");
  }

  const userId = user.id ?? "";

  const currentUserProfile = await getUserByIdForProfile(userId || "");

  //! Paramètre pour la recherche et les filtres : ces variables sont ensuites utilisé pour la fonction "getAllEvents" juste en dessous
  const page = Number(searchParams?.page) || 1;

  const organizedEvents = await getEventsByUserForPrivateProfl({
    userId,
    page,
  });

  const favoriteEvent = await getWishlistProfil({ userId, limit: 6, page });

  return (
    <>
      <section className="">
        {/* {" bg-gradient-to-t from-primary-500 dark:from-dark-500 to-transparent"} */}
        <div className="">
          <div className="h-full relative w-screen overflow-hidden flex flex-col items-end justify-end rounded-sm">
            <div className="absolute inset-0 w-full h-full bg-primary dark:bg-dark z-20 [mask-image:radial-gradient(transparent,black)] pointer-events-none" />
            <Boxes />
            {/* PHOTO NOM ABONNEMENT ET BTNMODIF */}
            <div className="wrapper flex flex-col gap-6 items-center justify-center pt-8 sm:flex-row sm:gap-8 sm:justify-between sm:mt-40 w-full z-20">
              <div className="flex flex-col justify-center gap-8 lg:wrapper">
                <div className="flex gap-4 items-center">
                  <div className=" w-20 h-20 sm:w-32 sm:h-32">
                    {currentUserProfile?.photo ? (
                      <Image
                        src={currentUserProfile.photo}
                        width={1000}
                        height={1000}
                        alt="photo d'accueil"
                        className="object-cover w-full h-full rounded-full"
                      />
                    ) : (
                      <Image
                        src="/assets/images/accueilImg.jpg"
                        alt="photo d'accueil"
                        width={1000}
                        height={1000}
                        className="object-cover w-full h-full rounded-full"
                      />
                    )}
                  </div>
                  <div className="flex">
                    <p className="h3-bold rubik">{currentUserProfile?.name}</p>
                    <FaCertificate className="text-dark dark:text-primary" />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 items-center sm:gap-8 ">
                {/* Les followers sont uniquement disponible pour les organisateurs */}
                {currentUserProfile?.role === "organizer" && (
                  <div className="flex gap-4 sm:gap-8">
                    <PersonnesFollowers userId={user.id} />
                  </div>
                )}
                <PersonnesSuivies userId={user.id} />
                <Button asChild size="lg" className="button hidden sm:flex">
                  {user.role === "organizer" ? (
                    <Link
                      href={`/profil/${user.id}/update`}
                      aria-label="Modifier"
                    >
                      <FaPen />
                    </Link>
                  ) : null}

                  {/* <UserForm user={userProfile} userId={userId} /> */}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* La description et les réseaux sociaux sont disponible seulement pour les organisateurs */}
        {currentUserProfile?.role === "organizer" && (
          <>
            <p className="wrapper rubik mt-4 sm:mt-8 text-dark dark:text-white">
              {currentUserProfile?.description ||
                "Cliquer sur Modifier pour ajouter une description"}
            </p>
            <div className="max-w-7xl lg:mx-auto px-5 md:px-10 xl:px-0 flex gap-8">
              {currentUserProfile && currentUserProfile.instagram && (
                <Link href={currentUserProfile.instagram}>
                  <CiInstagram
                    size={30}
                    className="text-dark dark:text-white"
                  />
                </Link>
              )}
              {currentUserProfile && currentUserProfile.twitter && (
                <Link href={currentUserProfile.twitter}>
                  <FaXTwitter size={40} className="text-dark dark:text-white" />
                </Link>
              )}
              {currentUserProfile && currentUserProfile.tiktok && (
                <Link href={currentUserProfile.tiktok}>
                  <FaTiktok size={40} className="text-dark dark:text-white" />
                </Link>
              )}
            </div>
          </>
        )}
      </section>

      {/* EVENTS ORGANIZED */}
      {currentUserProfile?.role === "organizer" && (
        <>
          <section className="wrapper bg-primary dark:bg-dark bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
            <div className="flex justify-center items-center gap-8 py-5">
              <p className="font-bold text-dark dark:text-white text-sm kronaOne">
                Events!
              </p>
              <div className="w-full h-[1px] rounded-sm bg-dark dark:bg-white"></div>
              <p className="hidden sm:block font-bold text-sm text-dark dark:text-white kronaOne">
                Events!
              </p>
            </div>

            {/* <div className="wrapper flex items-center justify-center sm:justify-between">
              <h3 className="h3-bold text-center sm:text-left">Mes Events</h3>
              <Button asChild size="lg" className="button hidden sm:flex">
                <Link href="/events/create">Créer un nouvel événement</Link>
              </Button>
            </div> */}
          </section>

          <section className="wrapper">
            <Collection
              data={organizedEvents?.data}
              emptyTitle="Aucun Event créé"
              emptyStateSubtext="Créez votre premier événement dès maintenant"
              collectionType="Events_Organized"
              limit={6}
              page={page}
              urlParamName="eventsPage"
              totalPages={organizedEvents?.totalPages}
            />
          </section>
        </>
      )}

      {/* MES FAVORIS */}
      <section className="bg-primary dark:bg-dark bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <div className="wrapper flex justify-center items-center gap-8 py-5">
          <p className="font-bold text-dark dark:text-primary text-sm kronaOne">
            Favoris!
          </p>
          <div className="w-full h-[1px] rounded-sm bg-dark dark:bg-primary"></div>
          <p className="hidden sm:block font-bold text-sm text-dark dark:text-primary kronaOne">
            Favoris!
          </p>
        </div>

        {/* <div className="wrapper flex items-center justify-center sm:justify-between">
          <h3 className="h3-bold text-center sm:text-left">Mes Favoris</h3>
          <Button asChild size="lg" className="button hidden sm:flex">
            <Link href="/#events">Découvrir d&apos;autres événements</Link>
          </Button>
        </div> */}
      </section>

      <section className="wrapper mb-12">
        <Collection
          data={favoriteEvent?.data}
          emptyTitle="Aucun Event dans mes favoris"
          emptyStateSubtext="Explorez les événements et ajoutez vos favoris"
          collectionType="All_Events_Favorite"
          limit={6}
          page={page}
          urlParamName="ordersPage"
          totalPages={favoriteEvent?.totalPages}
        />
      </section>
    </>
  );
}
