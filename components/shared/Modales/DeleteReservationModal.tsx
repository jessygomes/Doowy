"use client";
import { useState } from "react";

import { cancelReservation } from "@/lib/actions/reservation";

type DeleteReservationModalProps = { reservationId: string; userId: string };

export const DeleteReservationModal = ({
  reservationId,
  userId,
}: DeleteReservationModalProps) => {
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleConfirmCancel = async () => {
    if (!reservationId) return;

    setLoading(true);
    try {
      await cancelReservation(userId, reservationId);
    } catch (error) {
      console.error("Erreur lors de l'annulation de la réservation:", error);
    } finally {
      setLoading(false);
      handleCloseModal();
    }
  };

  return (
    <div className="">
      <button
        className="text-white py-2 px-4 rounded hover:text-red-500"
        onClick={() => handleOpenModal()}
      >
        Annuler la réservation
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-dark bg-opacity-50 backdrop-filter backdrop-blur-sm flex justify-center items-center z-10">
          <div className="bg-dark-500 p-8 rounded shadow-lg">
            <h2 className="text-xl font-bold mb-4">
              Êtes-vous sûr de vouloir annuler cette réservation ?
            </h2>
            <p className="mb-4">
              Voir pour remboursement une fois le système de paiement en place
            </p>
            <div className="flex justify-end gap-4">
              <button
                className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                onClick={handleCloseModal}
              >
                Annuler
              </button>
              <button
                className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
                onClick={handleConfirmCancel}
                disabled={loading}
              >
                {loading ? "Annulation en cours..." : "Confirmer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
