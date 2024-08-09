import { currentUser } from "@/lib/auth";
import { getEventById } from "@/lib/actions/event.actions";
import { Role } from "@prisma/client";

import { RoleGate } from "@/components/auth/RoleGate";
import EventForm from "@/components/shared/EventForm";

import Ripple from "@/components/magicui/ripple2";

type UpdateEventProps = {
  params: {
    id: string;
  };
};

export default async function UpdateEvent({
  params: { id },
}: UpdateEventProps) {
  const user = await currentUser();
  const userId = user?.id;

  const event = await getEventById(id);

  return (
    <>
      <RoleGate allowedRole={Role.organizer}>
        <section className="">
          <div className="relative flex w-screen flex-col items-end justify-end overflow-hidden bg-background bg-dark shadowCj pt-20 sm:pt-20">
            <Ripple />
            <h3 className="wrapper h3-bold text-center sm:text-left">
              Modifier mon événement
            </h3>
          </div>
        </section>
        <div className="wrapper my-8">
          {event && (
            <EventForm type="Modifier" eventId={event.id} userId={userId} />
          )}
        </div>
      </RoleGate>
    </>
  );
}
