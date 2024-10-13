import { GenerateBilletPdf } from "@/components/shared/Billeterie/GeneratePdfBillet";
import { getReservationsByUser } from "@/lib/actions/reservation";
import { currentUser } from "@/lib/auth";
import Image from "next/image";
import React from "react";

export default async function ProfilReservationsPage() {
  const user = await currentUser();
  const currentUserId = user?.id;

  //! Les réservations
  const reservationsResponse = await getReservationsByUser(currentUserId || "");
  const reservations = Array.isArray(reservationsResponse)
    ? reservationsResponse
    : [];

  console.log(reservations);

  return (
    <div className="wrapper flex flex-col gap-6  pt-8 mt-20 sm:mt-40 w-full z-20">
      <h2 className="h3-bold uppercase">Mes billets</h2>
      <div>
        {reservations.map((reservation) => (
          <div
            key={reservation.id}
            className="flex flex-col gap-4 text-white p-4"
          >
            <div className="flex items-center gap-4 border border-white p-4 rounded-sm">
              <Image
                src={reservation.event.imageUrl}
                width={150}
                height={500}
                alt="Affiche de l'événement"
              />
              <div>
                <p className="font-bold uppercase">{reservation.event.title}</p>
                <p>
                  {reservation.event.location}, {reservation.event.departement}{" "}
                  {reservation.event.ville}
                </p>
                <p></p>
                <p>
                  Début de l&apos;event :{" "}
                  {reservation.event.startDateTime.toLocaleString()}
                </p>
                <p>
                  Fin de l&apos;event :{" "}
                  {reservation.event.endDateTime.toLocaleString()}
                </p>
                {/* RAJOUTER LE NOMBRE DE BILLET ACHETE ET LE PRIX TOTAL */}
                <GenerateBilletPdf reservation={reservation} />
              </div>
            </div>
            {/* <div className="flex flex-col gap-2 mt-4">
              <h3 className="text-lg font-bold">QR Codes</h3>
              <div className="flex flex-wrap gap-2">
                {reservation.qrCodes.map((qrCode, index) => (
                  <div key={index} className="bg-white p-2 rounded">
                    <Image
                      src={qrCode.code}
                      width={100}
                      height={100}
                      alt={`QR Code ${index + 1}`}
                    />
                  </div>
                ))}
              </div>
            </div> */}
          </div>
        ))}
      </div>
    </div>
  );
}
