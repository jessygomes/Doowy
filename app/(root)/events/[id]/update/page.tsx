import { auth } from "@/auth";
import { RoleGate } from "@/components/auth/RoleGate";
import EventForm from "@/components/shared/EventForm";
import { getEventById } from "@/lib/actions/event.actions";
import { currentRole, currentUser } from "@/lib/auth";
import { UpdateEventParams } from "@/types";
import { Role } from "@prisma/client";

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
  console.log(event);

  return (
    <>
      <RoleGate allowedRole={Role.organizer}>
        <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10 ">
          <h3 className="wrapper h3-bold text-center sm:text-left">
            Modifier mon événement
          </h3>
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
