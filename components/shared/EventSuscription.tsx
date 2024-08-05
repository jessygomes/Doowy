import { SearchParamProps } from "@/types";
import Collection from "./Collection";
import { getEventSubscriptions } from "@/lib/actions/user.actions";
import { currentUser } from "@/lib/auth";

interface EventSuscriptionsProps {
  // userId: string;
  searchParams: SearchParamProps;
}

export const EventSuscription = async ({
  // userId,
  searchParams,
}: EventSuscriptionsProps) => {
  const page = Number(searchParams?.page) || 1;

  const user = await currentUser();
  const userId = user?.id;

  let eventsAbonnements;

  if (userId) {
    eventsAbonnements = await getEventSubscriptions({
      userId,
      page,
      limit: 6,
    });
  }

  return (
    <section
      id="events"
      className="wrapper my-8 flex flex-col gap-8 md:gap-12 z-20"
    >
      <h2 className="h3-bold sm:h3-bold rubik">Mes abonnements</h2>

      <Collection
        data={eventsAbonnements?.data}
        emptyTitle="Aucun Event Trouvé"
        emptyStateSubtext="Revenir plus tard"
        collectionType="All_Events"
        limit={6}
        page={page}
        totalPages={eventsAbonnements?.totalPages}
      />
    </section>
  );
};
