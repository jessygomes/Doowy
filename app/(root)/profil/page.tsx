import Link from "next/link";
import { signOut } from "@/auth";
import { currentUser } from "@/lib/auth";
import { SearchParamProps } from "@/types";

import { getUserByIdForProfile } from "@/lib/actions/user.actions";
import { getEventsByUser } from "@/lib/actions/event.actions";
// import {
//   getFollowers,
//   getMyFollowingUsers,
//   getUserByIdForProfile,
//   getWishlist,
// } from "@/lib/actions/user.actions";

import { Button } from "@/components/ui/button";
import Collection from "@/components/shared/Collection";
import { PersonnesFollowers } from "@/components/shared/PersonnesFollowers";
import { PersonnesSuivies } from "@/components/shared/PersonnesSuivies";

export default async function ProfilPrivate({
  searchParams,
}: SearchParamProps) {
  const user = await currentUser();
  const userId = user?.id;

  if (!user) {
    return null;
  }

  const currentUserProfile = await getUserByIdForProfile(user.id || "");

  //! Paramètre pour la recherche et les filtres : ces variables sont ensuites utilisé pour la fonction "getAllEvents" juste en dessous
  const page = Number(searchParams?.page) || 1;

  // const favoriteEvent = await getWishlist({ userId, page });
  const organizedEvents = await getEventsByUser({ userId, page });
  console.log("ORGANIZED EVENTS ---- ", organizedEvents);

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
              <Link href={`/profil/${user.id}/update`}>Modifier</Link>
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
          <p className="font-bold">{currentUserProfile?.name}</p>
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

      {/* MES FAVORIS */}
      {/* <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <div className="wrapper flex items-center justify-center sm:justify-between">
          <h3 className="h3-bold text-center sm:text-left">Mes Favoris</h3>
          <Button asChild size="lg" className="button hidden sm:flex">
            <Link href="/#events">Découvrir d&apos;autres événements</Link>
          </Button>
        </div>
      </section>

      <section className="wrapper my-8">
        <Collection
          data={favoriteEvent}
          emptyTitle="Aucun Event dans mes favoris"
          emptyStateSubtext="Explorez les événements et ajoutez vos favoris"
          collectionType="All_Events_Favorite"
          limit={6}
          page={page}
          urlParamName="ordersPage"
          totalPages={favoriteEvent?.totalPages}
        />
      </section> */}

      {/* EVENTS ORGANIZED */}
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
  );
}
