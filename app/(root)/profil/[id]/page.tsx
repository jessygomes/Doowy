import Collection from "@/components/shared/Collection";
import { Button } from "@/components/ui/button";
import { getEventsByUser } from "@/lib/actions/event.actions";
import { getUserByIdForProfile } from "@/lib/actions/user.actions";
import Link from "next/link";

interface Props {
  params: {
    id: string;
  };
}

export default async function ProfilPublic({ params: { id } }: Props) {
  const userProfile = await getUserByIdForProfile(
    id,
    "firstName lastName photo username"
  );

  const eventsByUser = await getEventsByUser({
    userId: id,
    page: 1,
    limit: 6,
  });
  console.log("EVENTS BY USER ---- ", eventsByUser);

  return (
    <>
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <div className="wrapper flex items-center justify-center sm:justify-between">
          <h3 className="h3-bold text-center sm:text-left">
            {userProfile.firstName} {userProfile.lastName}
          </h3>
          <Button size="lg" className="button hidden sm:flex">
            S&apos;abonner
          </Button>
        </div>

        <div className="wrapper">
          <p>
            Description : Lorem ipsum dolor sit, amet consectetur adipisicing
            elit. Nulla, voluptatibus neque totam provident porro ea labore
            fuga, suscipit hic quae laudantium reprehenderit eaque similique
            maiores? Tenetur rerum illo quisquam vitae.
          </p>
          <div className="flex gap-8 mt-4">
            <Link href="https://www.instagram.com/">Instagram</Link>
            <Link href="https://www.instagram.com/">Twitter</Link>
            <Link href="https://www.instagram.com/">TikTok</Link>
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
