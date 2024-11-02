"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import { createReservation } from "@/lib/actions/reservation";

interface BilleterieBtnProps {
  userId: string;
  eventId: string;
  eventPrice?: string;
  eventMaxPlaces?: number;
  isOurBilleterie?: boolean;
  eventUrl: string;
}

export const BilleterieBtn: React.FC<BilleterieBtnProps> = ({
  eventId,
  eventPrice,
  userId,
  isOurBilleterie,
  eventUrl,
}) => {
  const router = useRouter();
  //! Gestion de la modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toggleModal = () => setIsModalOpen(!isModalOpen);

  //! Gestion du formulaire
  interface FormData {
    numberOfTickets: number;
  }

  const { register, handleSubmit, watch } = useForm<FormData>();
  const pricePerTicket = eventPrice ? parseFloat(eventPrice.toString()) : 0;
  const numberOfTickets = watch("numberOfTickets", 1);
  const totalPrice = numberOfTickets * pricePerTicket;

  const onSubmit = async (data: { numberOfTickets: number }) => {
    try {
      await createReservation(userId, eventId, data.numberOfTickets);
      toggleModal();
      router.push("/profil/reservations");
    } catch (error) {
      console.error("Erreur lors de la création de la réservation:", error);
    }
  };

  return (
    <>
      {isOurBilleterie ? (
        <button className="button rounded-sm uppercase rubik w-full">
          <Link href={eventUrl} target="_blank">
            Prendre mon billet
          </Link>
        </button>
      ) : (
        <button
          className="button rounded-sm uppercase rubik w-full"
          onClick={toggleModal}
        >
          Prendre mon billet
        </button>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-filter backdrop-blur-sm flex justify-center items-center z-10 ">
          <div className="flex flex-col gap-4 bg-dark/90 p-8 rounded-sm w-full shadow-2xl">
            <div className="flex flex-row-reverse justify-between items-center border-b-2 border-white">
              <span
                className="close cursor-pointer text-center text-2xl text-white hover:text-red-500"
                onClick={toggleModal}
              >
                &times;
              </span>
              <h2 className="h3-bold text-center rubik uppercase">
                Réserver des billets
              </h2>
            </div>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              <div>
                <label htmlFor="numberOfTickets" className="text-white">
                  Nombre de billets
                </label>
                <input
                  type="number"
                  id="numberOfTickets"
                  {...register("numberOfTickets", {
                    valueAsNumber: true,
                    min: 1,
                  })}
                  defaultValue={1}
                  className="input-field w-full p-2 rounded-sm"
                />
              </div>
              <div className="text-center flex items-center justify-between gap-4">
                <label className="text-white uppercase rubik">Prix total</label>
                <p className="text-white text-xl">{totalPrice} €</p>
              </div>
              <button
                type="submit"
                className="button w-full p-2 rounded-sm bg-blue-500 text-white"
              >
                Valider
              </button>
              <button
                type="button"
                className="w-full p-2 rounded-sm bg-grey-500 hover:bg-grey-600 text-white"
                onClick={toggleModal}
              >
                Annuler
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
