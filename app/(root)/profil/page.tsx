// import Collection from "@/components/shared/Collection";
// import { PersonnesFollowers } from "@/components/shared/PersonnesFollowers";
// import { PersonnesSuivies } from "@/components/shared/PersonnesSuivies";
// import { Button } from "@/components/ui/button";
// import { getEventsByUser } from "@/lib/actions/event.actions";
// import {
//   getFollowers,
//   getMyFollowingUsers,
//   getUserByIdForProfile,
//   getWishlist,
// } from "@/lib/actions/user.actions";
// import { SearchParamProps } from "@/types";
// import { auth } from "@clerk/nextjs/server";
// import Link from "next/link";

// export default async function ProfilPrivate({
//   searchParams,
// }: SearchParamProps) {
//   const { sessionClaims } = auth();
//   const userId = sessionClaims?.userId as string;

//   const currentUserProfile = await getUserByIdForProfile(
//     userId,
//     "firstName lastName photo username description instagram twitter tiktok"
//   );

//   //! Paramètre pour la recherche et les filtres : ces variables sont ensuites utilisé pour la fonction "getAllEvents" juste en dessous
//   const page = Number(searchParams?.page) || 1;

//   const favoriteEvent = await getWishlist({ userId, page });
//   const organizedEvents = await getEventsByUser({ userId, page });

//   return (
//     <>
//       <section className="wrapper">
//         <div className="wrapper flex flex-col gap-4 items-center justify-center sm:flex-row sm:gap-8 sm:justify-between">
//           <h3 className="h3-bold text-center sm:text-left">Mon Profil</h3>
//           <div className="flex gap-4 items-center sm:gap-8">
//             <div className="flex gap-4 sm:gap-8">
//               <PersonnesFollowers userId={userId} />
//             </div>
//             <PersonnesSuivies userId={userId} />
//             <Button asChild size="lg" className="button hidden sm:flex">
//               <Link href={`/profil/${userId}/update`}>Modifier</Link>
//               {/* <UserForm user={userProfile} userId={userId} /> */}
//             </Button>
//           </div>
//         </div>

//         <div className="wrapper flex flex-col justify-center">
//           <p className="font-bold">
//             {currentUserProfile.firstName} {currentUserProfile.lastName}
//           </p>
//           <p className="mt-4">
//             {currentUserProfile.description ||
//               "Cliquer sur Modifier pour ajouter une description"}
//           </p>
//           <div className="flex gap-8 mt-4">
//             {currentUserProfile.instagram && (
//               <Link href={currentUserProfile.instagram}>Instagram</Link>
//             )}
//             {currentUserProfile.twitter && (
//               <Link href={currentUserProfile.instagram}>X</Link>
//             )}
//             {currentUserProfile.tiktok && (
//               <Link href={currentUserProfile.instagram}>TikTok</Link>
//             )}
//           </div>
//           <Button asChild size="lg" className="button sm:hidden">
//             <Link href={`/profil/${userId}/update`}>Modifier</Link>
//             {/* <UserForm user={userProfile} userId={userId} /> */}
//           </Button>
//         </div>
//       </section>

//       {/* MES FAVORIS */}
//       <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
//         <div className="wrapper flex items-center justify-center sm:justify-between">
//           <h3 className="h3-bold text-center sm:text-left">Mes Favoris</h3>
//           <Button asChild size="lg" className="button hidden sm:flex">
//             <Link href="/#events">Découvrir d&apos;autres événements</Link>
//           </Button>
//         </div>
//       </section>

//       <section className="wrapper my-8">
//         <Collection
//           data={favoriteEvent}
//           emptyTitle="Aucun Event dans mes favoris"
//           emptyStateSubtext="Explorez les événements et ajoutez vos favoris"
//           collectionType="All_Events_Favorite"
//           limit={6}
//           page={page}
//           urlParamName="ordersPage"
//           totalPages={favoriteEvent?.totalPages}
//         />
//       </section>

//       {/* EVENTS ORGANIZED */}
//       <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
//         <div className="wrapper flex items-center justify-center sm:justify-between">
//           <h3 className="h3-bold text-center sm:text-left">Mes Events</h3>
//           <Button asChild size="lg" className="button hidden sm:flex">
//             <Link href="/events/create">Créer un nouvel événement</Link>
//           </Button>
//         </div>
//       </section>

//       <section className="wrapper my-8">
//         <Collection
//           data={organizedEvents?.data}
//           emptyTitle="Aucun Event créé"
//           emptyStateSubtext="Créez votre premier événement dès maintenant"
//           collectionType="Events_Organized"
//           limit={6}
//           page={page}
//           urlParamName="eventsPage"
//           totalPages={organizedEvents?.totalPages}
//         />
//       </section>
//     </>
//   );
// }
