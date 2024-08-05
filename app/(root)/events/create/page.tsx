import { RoleGate } from "@/components/auth/RoleGate";
import EventForm from "@/components/shared/EventForm";
import { currentRole, currentUser } from "@/lib/auth";
import { Role } from "@prisma/client";
import React from "react";

export default async function CreateEvent() {
  const user = await currentUser();
  const role = currentRole();

  return (
    <>
      <RoleGate allowedRole={Role.organizer}>
        <section className="bg-primary dark:bg-dark bg-dotted-pattern bg-cover bg-center py-5 md:py-10 ">
          <h3 className="wrapper h3-bold text-center sm:text-left sm:mt-20 rubik">
            Créer un événement
          </h3>
        </section>
        <div className="wrapper my-8">
          <EventForm userId={user?.id} type="Créer" />
        </div>
      </RoleGate>
    </>
  );
}
