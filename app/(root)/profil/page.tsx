import Collection from "@/components/shared/Collection";
import UserForm from "@/components/shared/UserForm";
import { Button } from "@/components/ui/button";
import { getEventsByUser } from "@/lib/actions/event.actions";
import { getUserByIdForProfile, getWishlist } from "@/lib/actions/user.actions";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

export default async function Profil() {
  const { sessionClaims } = auth();
  const userId = sessionClaims?.userId as string;

  const userProfile = await getUserByIdForProfile(
    userId,
    "firstName lastName photo username description instagram twitter tiktok"
  );

  const favoriteEvent = await getWishlist({ userId, page: 1 });
  // console.log("WISHLIST ---- ", favoriteEvent);
  const organizedEvents = await getEventsByUser({ userId, page: 1 });

  return (
    <>
      <section className="wrapper">
        <div className="wrapper flex items-center justify-center sm:justify-between">
          <h3 className="h3-bold text-center sm:text-left">Mon Profil</h3>
          <Button asChild size="lg" className="button hidden sm:flex">
            <Link href={`/profil/${userId}/update`}>Modifier</Link>
            {/* <UserForm user={userProfile} userId={userId} /> */}
          </Button>
        </div>

        <div className="wrapper">
          <p>
            {userProfile.firstName} {userProfile.lastName}
          </p>
          <p className="mt-4">
            Description : {userProfile.description || "Ajouter une description"}
          </p>
          <div className="flex gap-8 mt-4">
            {userProfile.instagram && (
              <Link href={userProfile.instagram}>Instagram</Link>
            )}
            {userProfile.twitter && <Link href={userProfile.instagram}>X</Link>}
            {userProfile.tiktok && (
              <Link href={userProfile.instagram}>TikTok</Link>
            )}
          </div>
        </div>
      </section>

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
          data={favoriteEvent}
          emptyTitle="Aucun Event dans mes favoris"
          emptyStateSubtext="Explorez les événements et ajoutez vos favoris"
          collectionType="All_Events_Favorite"
          limit={6}
          page={1}
          urlParamName="ordersPage"
          totalPages={2}
        />
      </section>

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
          page={1}
          urlParamName="eventsPage"
          totalPages={2}
        />
      </section>
    </>
  );
}
