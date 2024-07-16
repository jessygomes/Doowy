import Link from "next/link";
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
      <section className="wrapper">
        <div className="wrapper flex flex-col gap-4 items-center justify-center sm:flex-row sm:gap-8 sm:justify-between">
          <h3 className="h3-bold text-center sm:text-left">
            {user.role === "organizer" ? "Mon profil" : "Mon compte"}
          </h3>

          <div className="flex gap-4 items-center sm:gap-8">
            {/* Les followers sont uniquement disponible pour les organisateurs */}
            {currentUserProfile?.role === "organizer" && (
              <div className="flex gap-4 sm:gap-8">
                <PersonnesFollowers userId={user.id} />
              </div>
            )}
            <PersonnesSuivies userId={user.id} />
            <Button asChild size="lg" className="button hidden sm:flex">
              {user.role === "organizer" ? (
                <Link href={`/profil/${user.id}/update`} aria-label="Modifier">
                  <FaPen />
                </Link>
              ) : null}

              {/* <UserForm user={userProfile} userId={userId} /> */}
            </Button>
            <form
              action={async () => {
                "use server";
                await signOut();
              }}
            ></form>
          </div>
        </div>

        <div className="wrapper flex flex-col justify-center">
          <div className="flex gap-4 items-center">
            <Avatar className="h-10 w-10">
              <AvatarImage src={currentUserProfile?.photo || ""} />
              <AvatarFallback className="bg-primary ">
                <FaUser className="text-white" />
              </AvatarFallback>
            </Avatar>
            <p className="font-bold">{currentUserProfile?.name}</p>
            <FaCertificate className="text-primary-500" />
          </div>
          {/* La description et les réseaux sociaux sont disponible seulement pour les organisateurs */}
          {currentUserProfile?.role === "organizer" && (
            <>
              <p className="mt-4">
                {currentUserProfile?.description ||
                  "Cliquer sur Modifier pour ajouter une description"}
              </p>
              <div className="flex gap-8 mt-4">
                {currentUserProfile && currentUserProfile.instagram && (
                  <Link href={currentUserProfile.instagram}>Instagram</Link>
                )}
                {currentUserProfile && currentUserProfile.twitter && (
                  <Link href={currentUserProfile.twitter}>X</Link>
                )}
                {currentUserProfile && currentUserProfile.tiktok && (
                  <Link href={currentUserProfile.tiktok}>TikTok</Link>
                )}
              </div>
            </>
          )}
          <Button asChild size="lg" className="button sm:hidden">
            <Link href={`/profil/${user.id}/update`}>Modifier</Link>
            {/* <UserForm user={userProfile} userId={session?.user.id} /> */}
          </Button>
        </div>
      </section>

      {/* EVENTS ORGANIZED */}
      {currentUserProfile?.role === "organizer" && (
        <>
          <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
            <div className="wrapper flex items-center justify-center sm:justify-between">
              <h3 className="h3-bold text-center sm:text-left">Mes Events</h3>
              <Button asChild size="lg" className="button hidden sm:flex">
                <Link href="/events/create">Créer un nouvel événement</Link>
              </Button>
            </div>
          </section>

          <section className="wrapper my-8">
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
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <div className="wrapper flex items-center justify-center sm:justify-between">
          <h3 className="h3-bold text-center sm:text-left">Mes Favoris</h3>
          <Button asChild size="lg" className="button hidden sm:flex">
            <Link href="/#events">Découvrir d&apos;autres événements</Link>
          </Button>
        </div>
      </section>

      <section className="wrapper my-8">
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
