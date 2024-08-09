import { RoleGate } from "@/components/auth/RoleGate";
import EventForm from "@/components/shared/EventForm";
import { currentRole, currentUser } from "@/lib/auth";
import { Role } from "@prisma/client";
import Ripple from "@/components/magicui/ripple2";

export default async function CreateEvent() {
  const user = await currentUser();
  const role = currentRole();

  return (
    <>
      <RoleGate allowedRole={Role.organizer}>
        <section className="">
          <div className="relative flex w-screen flex-col items-end justify-end overflow-hidden bg-background bg-dark shadowCj pt-20 sm:pt-20">
            <Ripple />
            <h3 className="wrapper h3-bold text-center sm:text-left">
              Créer un événement
            </h3>
          </div>
        </section>
        <div className="wrapper my-8">
          <EventForm userId={user?.id} type="Créer" />
        </div>
      </RoleGate>
    </>
  );
}
