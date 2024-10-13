"use client";
import { useState } from "react";

interface DetailEventOrgBtnProps {
  userId: string;
  eventId: string;
  reservations: Array<{
    id: string;
    user: { name: string };
    qrCodeCount: number;
    createdAt: string;
  }>;
}

export const DetailEventOrgBtn: React.FC<DetailEventOrgBtnProps> = ({
  userId,
  eventId,
  reservations,
}) => {
  //! Gestion de la modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toggleModal = () => setIsModalOpen(!isModalOpen);

  return (
    <>
      <button
        className="button rounded-sm uppercase rubik w-full"
        onClick={toggleModal}
      >
        Voir Détails
      </button>

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
                Détails | {reservations.length}
              </h2>
            </div>
            <div className="flex flex-col gap-4">
              {reservations.map((reservation) => (
                <div
                  key={reservation.id}
                  className="flex justify-between items-center py-2"
                >
                  <p className="text-white">{reservation.user.name}</p>
                  <p className="text-white">
                    Places réservées: {reservation.qrCodeCount}
                  </p>
                  <p className="text-white">
                    {new Date(reservation.createdAt).toLocaleDateString(
                      "fr-FR"
                    )}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
