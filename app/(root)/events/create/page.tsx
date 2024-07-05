import EventForm from "@/components/shared/EventForm";
import { auth } from "@clerk/nextjs/server";
import React from "react";

export default function CreateEvent() {
  // const { sessionClaims } = auth();

  // const userId = sessionClaims?.userId as string; // Pour récupérer l'id de l'utilisateur connecté, on modifie la session Clerk (depuis le site : customize session token) et ajouter { "userId": "{{user.public_metadata.userId}}"}

  // const userRole = sessionClaims?.role as string;
  // console.log("userID", userId);

  return (
    <>
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10 ">
        <h3 className="wrapper h3-bold text-center sm:text-left">
          Créer un événement
        </h3>
      </section>
      <div className="wrapper my-8">
        {/* <EventForm userId={userId} type="Créer" /> */}
      </div>
    </>
  );
}
