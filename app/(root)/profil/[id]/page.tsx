import BtnFollow from "@/components/shared/BtnFollow";
import Collection from "@/components/shared/Collection";
import { Button } from "@/components/ui/button";
import { getEventsByUser } from "@/lib/actions/event.actions";
import {
  getFollowers,
  getUserById,
  getUserByIdForProfile,
} from "@/lib/actions/user.actions";
import { GetUserParams } from "@/types";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

interface Props {
  params: {
    id: string;
  };
}

export default async function ProfilPublic({ params: { id } }: Props) {
  const userProfile = await getUserByIdForProfile(
    id,
    "firstName lastName username description instagram twitter tiktok followers"
  );

  const eventsByUser = await getEventsByUser({
    userId: id,
    page: 1,
    limit: 6,
  });

  const { sessionClaims } = auth();
  const currentUserId = sessionClaims?.userId as string;

  let isFollowing = false;

  if (currentUserId) {
    const currentUser = await getUserById(currentUserId);

    isFollowing = currentUser.following
      ? currentUser.following.some(
          (follower: any) => follower.id === userProfile.id
        )
      : false;
  }

  return (
    <>
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <div className="wrapper flex items-center justify-center sm:justify-between">
          <h3 className="h3-bold text-center sm:text-left">
            {userProfile.firstName} {userProfile.lastName}
          </h3>
          {currentUserId === id ? (
            <Button asChild size="lg" className="button hidden sm:flex">
              <Link href="/profil">Modifier mon profil</Link>
            </Button>
          ) : (
            <BtnFollow userToFollowId={id} isFollowing={isFollowing} />
          )}
          <p>Followers : {userProfile.followers.length}</p>
        </div>

        <div className="wrapper">
          <p>{userProfile.description}</p>
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

      <section className="wrapper my-8">
        <Collection
          data={eventsByUser?.data}
          emptyTitle="Aucun Event créé"
          emptyStateSubtext="Explorez les événements et ajoutez vos favoris"
          collectionType="All_Events"
          limit={6}
          page={1}
          urlParamName="ordersPage"
          totalPages={2}
        />
      </section>
    </>
  );
}
