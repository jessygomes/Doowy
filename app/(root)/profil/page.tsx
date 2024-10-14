import Link from "next/link";
import Image from "next/image";

import {
  getUserByIdForProfile,
  getWishlistProfil,
} from "@/lib/actions/user.actions";
import { getEventsByUserForPrivateProfl } from "@/lib/actions/event.actions";
import { currentUser } from "@/lib/auth";

import { Button } from "@/components/ui/button";
import Collection from "@/components/shared/Collection";
import { PersonnesFollowers } from "@/components/shared/Abonnements/PersonnesFollowers";
import { PersonnesSuivies } from "@/components/shared/Abonnements/PersonnesSuivies";
import { FaCertificate, FaPen } from "react-icons/fa";
import Ripple from "@/components/magicui/ripple";

import { CiInstagram } from "react-icons/ci";
import { FaXTwitter } from "react-icons/fa6";
import { FaTiktok } from "react-icons/fa";
import { FollowersProvider } from "@/components/shared/Abonnements/FollowersContext";

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
      <section className="bg-gradient-to-t from-dark to-[#ff63be8e]">
        {/* {" bg-gradient-to-t from-primary-500 dark:from-dark-500 to-transparent"} */}
        <div className="relative flex w-screen flex-col items-end justify-end overflow-hidden bg-background bg-dark shadowCj pt-20 sm:pt-0">
          <Ripple />
          {/* PHOTO NOM ABONNEMENT ET BTNMODIF */}
          <div className="wrapper flex flex-col gap-6 items-center justify-center pt-8 sm:flex-row sm:gap-8 sm:justify-between sm:mt-40 w-full z-20">
            <div className="flex flex-col justify-center gap-8 lg:wrapper">
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className=" w-20 h-20 sm:w-32 sm:h-32">
                  {currentUserProfile?.image ? (
                    <Image
                      src={currentUserProfile.image}
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
                <div className="flex gap-2">
                  <p className="h3-bold rubik">
                    {currentUserProfile?.role === "organizer"
                      ? currentUserProfile?.organizationName
                      : currentUserProfile?.name}
                  </p>
                  <FaCertificate className="text-white" />
                </div>
              </div>
            </div>

            <div className="flex gap-4 items-center sm:gap-8 ">
              {/* Les followers sont uniquement disponible pour les organisateurs */}
              {currentUserProfile?.role === "organizer" && (
                <div className="flex gap-4 sm:gap-8">
                  <FollowersProvider>
                    <PersonnesFollowers userId={user.id} />
                  </FollowersProvider>
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
            <Button asChild size="lg" className="button sm:hidden">
              {user.role === "organizer" ? (
                <Link href={`/profil/${user.id}/update`} aria-label="Modifier">
                  <FaPen />
                </Link>
              ) : null}

              {/* <UserForm user={userProfile} userId={userId} /> */}
            </Button>
            <Link
              href="/profil/reservations"
              aria-label="Voir les réservations"
            >
              <button className="button uppercase whitespace-nowrap px-2">
                Mes billets
              </button>
            </Link>
          </div>
        </div>

        {/* La description et les réseaux sociaux sont disponible seulement pour les organisateurs */}
        {currentUserProfile?.role === "organizer" && (
          <>
            <p className="wrapper rubik mt-4 sm:mt-8 text-white">
              {currentUserProfile?.description ||
                "Cliquer sur Modifier pour ajouter une description"}
            </p>
            <div className="max-w-6xl lg:mx-auto px-5 md:px-10 xl:px-0 flex gap-8">
              {currentUserProfile && currentUserProfile.instagram && (
                <Link href={currentUserProfile.instagram}>
                  <CiInstagram size={30} className="text-white" />
                </Link>
              )}
              {currentUserProfile && currentUserProfile.twitter && (
                <Link href={currentUserProfile.twitter}>
                  <FaXTwitter size={30} className="text-white" />
                </Link>
              )}
              {currentUserProfile && currentUserProfile.tiktok && (
                <Link href={currentUserProfile.tiktok}>
                  <FaTiktok size={30} className="text-white" />
                </Link>
              )}
            </div>
          </>
        )}
      </section>

      {/* EVENTS ORGANIZED */}
      {currentUserProfile?.role === "organizer" && (
        <>
          <section className="my-8 pb-8 py-5 md:py-10 shadowCj">
            <div className="wrapper flex flex-col gap-8">
              <p className="h4-bold kronaOne text-white text-xl uppercase">
                Mes events!
              </p>

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
            </div>
          </section>
        </>
      )}

      {/* MES FAVORIS */}
      <section className="mt-8 pb-8 py-5 md:py-10 shadowCj">
        <div className="wrapper flex flex-col gap-8">
          <p className="h4-bold kronaOne text-white text-xl uppercase">
            Mes favoris!
          </p>

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
        </div>
      </section>
    </>
  );
}
