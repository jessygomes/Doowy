"use server";
import { db } from "../db";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import { getUserById } from "./user.actions";
import { currentRole } from "../auth";
import { Role } from "@prisma/client";
import { handleError } from "../utils";
import { generateQRCode } from "@/hooks/generatino-qrcode";

//! Créer une réservation pour un événement
export const createReservation = async (
  userId: string,
  eventId: string,
  numberOfTickets: number
) => {
  try {
    const event = await db.event.findUnique({
      where: { id: eventId },
      include: { reservations: true },
    });

    if (!event) {
      throw new Error("Event introuvable.");
    }

    if (event.reservations.length >= event.maxPlaces) {
      throw new Error(
        "Il n'y a plus de places disponibles pour cet événement."
      );
    }

    // Créer la réservation d'abord
    const reservation = await db.reservation.create({
      data: {
        user: { connect: { id: userId } },
        event: { connect: { id: eventId } },
      },
    });

    const qrCodes = [];
    for (let i = 0; i < numberOfTickets; i++) {
      const qrCodeData = `${eventId}-${userId}-${new Date().toISOString()}-${i}`;
      const qrCodeUrl = await generateQRCode(qrCodeData);

      const qrCode = await db.qRCode.create({
        data: {
          code: qrCodeUrl,
          event: { connect: { id: eventId } },
          reservation: { connect: { id: reservation.id } }, // Connecter le QR code à la réservation créée
        },
      });

      qrCodes.push(qrCode);
    }

    // Mettre à jour la réservation avec les QR codes créés
    await db.reservation.update({
      where: { id: reservation.id },
      data: {
        qrCodes: {
          connect: qrCodes.map((qrCode) => ({ id: qrCode.id })),
        },
      },
    });

    // Mettre à jour le champ maxPlaces de l'événement
    await db.event.update({
      where: { id: eventId },
      data: {
        stock: event.maxPlaces - numberOfTickets,
      },
    });

    return reservation;
  } catch (error) {
    handleError(error);
    throw new Error("Erreur lors de la création de la réservation.");
  }
};

//! Voir toutes les réservations par event
export const getReservationsByEvent = async (
  userId: string,
  eventId: string
) => {
  try {
    const role = await currentRole();
    if (role !== Role.organizer) {
      return new NextResponse(null, { status: 403 });
    }
    if (!userId) {
      return new NextResponse(null, { status: 401 });
    }

    const reservations = await db.reservation.findMany({
      where: { eventId },
      include: {
        user: true,
        qrCodes: true, // Inclure les QR codes dans la requête
      },
    });

    const reservationsWithQrCodeCount = reservations.map((reservation) => ({
      ...reservation,
      qrCodeCount: reservation.qrCodes.length,
    }));

    return reservationsWithQrCodeCount;
  } catch (error) {
    handleError(error);
    throw new Error("Erreur lors de la récupération des réservations.");
  }
};

//! Voir les réservations d'un utilisateur
export const getReservationsByUser = async (userId: string) => {
  try {
    if (!userId) {
      return new NextResponse(null, { status: 401 });
    }

    const reservations = await db.reservation.findMany({
      where: { userId },
      include: { event: true, qrCodes: true },
    });

    return reservations;
  } catch (error) {
    handleError(error);
    throw new Error("Erreur lors de la récupération des réservations.");
  }
};

//! Annuler une réservation
export const cancelReservation = async (
  userId: string,
  reservationId: string
) => {
  try {
    if (!userId) {
      return new NextResponse(null, { status: 401 });
    }

    const reservation = await db.reservation.findUnique({
      where: { id: reservationId },
      include: { qrCodes: true, event: true }, // Inclure les QR codes et l'événement
    });

    if (!reservation) {
      throw new Error("Réservation introuvable.");
    }

    const numberOfTickets = reservation.qrCodes.length;

    await db.reservation.delete({ where: { id: reservationId } });

    // Mettre à jour le stock de l'événement
    await db.event.update({
      where: { id: reservation.eventId },
      data: {
        stock: {
          increment: numberOfTickets, // Incrémenter le stock par le nombre de billets annulés
        },
      },
    });

    revalidatePath(`/profil/reservations`);

    return true;
  } catch (error) {
    handleError(error);
    throw new Error("Erreur lors de l'annulation de la réservation.");
  }
};
