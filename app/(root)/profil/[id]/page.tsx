import Link from "next/link";

import { currentUser } from "@/lib/auth";
import { getEventsByUser } from "@/lib/actions/event.actions";
import {
  getUserById,
  getUserByIdForProfile,
  getWishlistProfil,
} from "@/lib/actions/user.actions";
import { GetUserParams, SearchParamProps } from "@/types";

import BtnFollow from "@/components/shared/BtnFollow";
import Collection from "@/components/shared/Collection";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PersonnesFollowers } from "@/components/shared/PersonnesFollowers";
import { PersonnesSuivies } from "@/components/shared/PersonnesSuivies";
import { FaUser } from "react-icons/fa";

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

  let eventsByOrganizer = null;
  if (userProfile && userProfile.role === "organizer") {
    eventsByOrganizer = await getEventsByUser({
      userId: id,
      page,
      limit: 6,
    });
  }

  let eventsUserFav = null;
  if (userProfile && userProfile.role !== "organizer") {
    eventsUserFav = await getWishlistProfil({
      userId: id,
      page,
      limit: 6,
    });
  }

  //! Vérifier si l'utilisateur connecté suit le profil
  let isFollowing = false;

  if (currentUserId && userProfile && userProfile.followersList) {
    isFollowing = userProfile.followersList.some((follower: any) => {
      // console.log("Comparing:", follower.followerId, "with", currentUserId);
      // Debugging: Afficher la comparaison
      return follower.followerId === currentUserId;
    });
  }

  if (userProfile?.role !== "organizer") {
    return (
      <>
        <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
          <div className="wrapper flex flex-col gap-8 items-center justify-center sm:justify-between">
            <Avatar className="h-10 w-10">
              <AvatarImage src={userProfile?.photo || ""} />
              <AvatarFallback className="bg-primary ">
                <FaUser className="text-white" />
              </AvatarFallback>
            </Avatar>
            <h3 className="h3-bold text-center sm:text-left">
              {userProfile?.name}
            </h3>

            <div className="flex gap-4">
              <PersonnesFollowers userId={userProfile?.id} />
              <PersonnesSuivies userId={userProfile?.id} />
            </div>

            {currentUserId === id ? (
              <div></div>
            ) : (
              <BtnFollow userToFollowId={id} isFollowing={isFollowing} />
            )}
          </div>
        </section>

        <div className="wrapper flex items-center justify-center sm:justify-between">
          <h3 className="h3-bold text-center sm:text-left">Favoris</h3>
        </div>

        <section className="wrapper my-8">
          <Collection
            data={eventsUserFav?.data}
            emptyTitle="Aucun Event créé"
            emptyStateSubtext="Explorez les événements et ajoutez vos favoris"
            collectionType="All_Events"
            limit={6}
            page={page}
            // urlParamName="ordersPage"
            totalPages={eventsUserFav?.totalPages}
          />
        </section>
      </>
    );
  }

  return (
    <>
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <div className="wrapper flex items-center justify-center sm:justify-between">
          <div className="flex gap-4 items-center justify-center">
            <Avatar className="h-10 w-10">
              <AvatarImage src={userProfile?.photo || ""} />
              <AvatarFallback className="bg-primary ">
                <FaUser className="text-white" />
              </AvatarFallback>
            </Avatar>
            <h3 className="h3-bold text-center sm:text-left">
              {userProfile?.name}
            </h3>
          </div>

          <div className="flex gap-6 items-center">
            <PersonnesFollowers userId={userProfile?.id} />
            {currentUserId === id ? (
              <Button asChild size="lg" className="button hidden sm:flex">
                <Link href="/profil">Modifier mon profil</Link>
              </Button>
            ) : (
              <BtnFollow userToFollowId={id} isFollowing={isFollowing} />
            )}
          </div>
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

      <section className="bg-cover bg-center py-5 md:py-5">
        <div className="wrapper flex items-center justify-center sm:justify-between">
          <h3 className="h3-bold text-center sm:text-left">
            Les Events à venir
          </h3>
        </div>
      </section>

      <section className="wrapper my-8">
        <Collection
          data={eventsByOrganizer?.data.upcomingEvents}
          emptyTitle="Aucun Event créé"
          emptyStateSubtext="Explorez les événements et ajoutez vos favoris"
          collectionType="All_Events"
          limit={6}
          page={page}
          // urlParamName="ordersPage"
          totalPages={eventsByOrganizer?.totalPages}
        />
      </section>

      <section className="bg-cover bg-center py-5 md:py-5">
        <div className="wrapper flex items-center justify-center sm:justify-between">
          <h3 className="h3-bold text-center sm:text-left">
            Les Events passés
          </h3>
        </div>
      </section>

      <section className="wrapper my-8">
        <Collection
          data={eventsByOrganizer?.data.pastEvents}
          emptyTitle="Aucun Event créé"
          emptyStateSubtext="Explorez les événements et ajoutez vos favoris"
          collectionType="All_Events"
          limit={6}
          page={page}
          // urlParamName="ordersPage"
          totalPages={eventsByOrganizer?.totalPages}
        />
      </section>
    </>
  );
}
