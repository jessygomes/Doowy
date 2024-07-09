import Link from "next/link";

import { currentUser } from "@/lib/auth";
import { getEventsByUser } from "@/lib/actions/event.actions";
import { getUserById, getUserByIdForProfile } from "@/lib/actions/user.actions";
import { GetUserParams, SearchParamProps } from "@/types";

import BtnFollow from "@/components/shared/BtnFollow";
import Collection from "@/components/shared/Collection";
import { Button } from "@/components/ui/button";

interface Props {
  params: {
    id: string;
  };
  searchParams: SearchParamProps;
}

export default async function ProfilPublic({
  params: { id },
  searchParams,
}: Props) {
  //! Data du currentUSER
  const user = await currentUser();
  const currentUserId = user?.id;

  //! Récupération des infos du profil visité
  const userProfile = await getUserByIdForProfile(id);

  //! Récupération des événements de l'utilisateur
  const page = Number(searchParams?.page) || 1;
  const eventsByUser = await getEventsByUser({
    userId: id,
    page,
    limit: 6,
  });

  //! Vérifier si l'utilisateur connecté suit le profil
  let isFollowing = false;

  if (currentUserId && userProfile && userProfile.followersList) {
    isFollowing = userProfile.followersList.some((follower: any) => {
      // console.log("Comparing:", follower.followerId, "with", currentUserId);
      // Debugging: Afficher la comparaison
      return follower.followerId === currentUserId;
    });
  }

  // TODO : Si le user n'est pas organisateur, un autre user ne peut pas accéder à la page de son profil.

  return (
    <>
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <div className="wrapper flex items-center justify-center sm:justify-between">
          <h3 className="h3-bold text-center sm:text-left">
            {userProfile?.name}
          </h3>
          {currentUserId === id ? (
            <Button asChild size="lg" className="button hidden sm:flex">
              <Link href="/profil">Modifier mon profil</Link>
            </Button>
          ) : (
            <BtnFollow userToFollowId={id} isFollowing={isFollowing} />
          )}
        </div>

        <div className="wrapper">
          <p>{userProfile?.description}</p>
          <div className="flex gap-8 mt-4">
            {userProfile && userProfile.instagram && (
              <Link href={userProfile.instagram} target="_blank">
                Instagram
              </Link>
            )}
            {userProfile && userProfile.twitter && (
              <Link href={userProfile.twitter} target="_blank">
                X
              </Link>
            )}
            {userProfile && userProfile.tiktok && (
              <Link href={userProfile.tiktok} target="_blank">
                TikTok
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className="wrapper my-8">
        <Collection
          data={eventsByUser?.data}
          emptyTitle="Aucun Event créé"
          emptyStateSubtext="Explorez les événements et ajoutez vos favoris"
          collectionType="All_Events"
          limit={6}
          page={page}
          // urlParamName="ordersPage"
          totalPages={eventsByUser?.totalPages}
        />
      </section>
    </>
  );
}
