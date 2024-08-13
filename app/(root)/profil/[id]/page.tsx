import Link from "next/link";
import Image from "next/image";

import { currentUser } from "@/lib/auth";
import { getEventsByUser } from "@/lib/actions/event.actions";
import {
  getUserByIdForProfile,
  getWishlistProfil,
} from "@/lib/actions/user.actions";
import { SearchParamProps } from "@/types";

import BtnFollow from "@/components/shared/BtnFollow";
import Collection from "@/components/shared/Collection";
import { Button } from "@/components/ui/button";

import { PersonnesFollowers } from "@/components/shared/PersonnesFollowers";
import { PersonnesSuivies } from "@/components/shared/PersonnesSuivies";

import { CiInstagram } from "react-icons/ci";
import { FaXTwitter } from "react-icons/fa6";
import { FaTiktok } from "react-icons/fa";
import { FaCertificate } from "react-icons/fa";
import Ripple from "@/components/magicui/ripple";

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
        <section className="bg-gradient-to-t from-dark to-[#ff63be8e]">
          <div className="relative flex h-screen w-screen flex-col items-end justify-end overflow-hidden bg-dark shadowCj">
            <Ripple />

            <div className="wrapper flex flex-col gap-6 items-center justify-center pt-8 sm:flex-row sm:gap-8 sm:justify-between sm:mt-40 w-full z-20">
              <div className="flex gap-4 items-center">
                <div className="w-20 h-20 sm:w-32 sm:h-32">
                  {userProfile?.image ? (
                    <Image
                      src={userProfile.image}
                      width={1000}
                      height={1000}
                      alt="Photo de profil"
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

                <h3 className="h3-bold text-center sm:text-left">
                  {userProfile?.name}
                </h3>
              </div>

              <div className="flex gap-6">
                <PersonnesFollowers userId={userProfile?.id} />
                <PersonnesSuivies userId={userProfile?.id} />

                {currentUserId === id ? (
                  <div></div>
                ) : (
                  <BtnFollow userToFollowId={id} isFollowing={isFollowing} />
                )}
              </div>
            </div>
          </div>
        </section>

        {userProfile?.isHidenWishlist ? (
          <div></div>
        ) : (
          <>
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
        )}
      </>
    );
  }

  return (
    <>
      <section className="bg-gradient-to-t from-dark to-[#ff63be8e]">
        <div className="relative flex w-screen flex-col items-end justify-end overflow-hidden bg-dark shadowCj">
          <Ripple />

          <div className="wrapper flex flex-col gap-6 items-center justify-center pt-8 sm:flex-row sm:gap-8 sm:justify-between sm:mt-40 w-full z-20">
            <div className="flex gap-4 items-center justify-center">
              <div className=" w-20 h-20 sm:w-32 sm:h-32">
                {userProfile?.image ? (
                  <Image
                    src={userProfile.image}
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
                <h3 className="h3-bold rubik">
                  {userProfile?.organizationName}
                </h3>
                <FaCertificate className="text-white" />
              </div>
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
        </div>

        <div className="wrapper rubik mt-4 sm:mt-8 text-white">
          <p>{userProfile?.description}</p>
          <div className="flex gap-8 mt-4">
            {userProfile && userProfile.instagram && (
              <Link href={userProfile.instagram} target="_blank">
                <CiInstagram size={30} className="text-white" />
              </Link>
            )}
            {userProfile && userProfile.twitter && (
              <Link href={userProfile.twitter} target="_blank">
                <FaXTwitter size={40} className="text-white" />
              </Link>
            )}
            {userProfile && userProfile.tiktok && (
              <Link href={userProfile.tiktok} target="_blank">
                <FaTiktok size={40} className="text-white" />
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className="mt-8 shadowCj pb-8">
        <div className="wrapper flex flex-col gap-8">
          <p className="h4-bold kronaOne text-white text-xl uppercase">
            prochainement!
          </p>
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
        </div>
      </section>

      <section className="mt-8 shadowCj pb-8">
        <div className="wrapper flex flex-col gap-8">
          <p className="h4-bold kronaOne text-white text-xl uppercase">
            événements passés!
          </p>
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
        </div>
      </section>
    </>
  );
}
