"use client";
import { PDFDownloadLink } from "@react-pdf/renderer"; // Importe le composant BilletPDF créé précédemment
import BilletPDF from "./BilletPdf";
import { Reservation } from "@/types";

interface GenerateBilletPdfProps {
  reservation: Reservation;
}

export const GenerateBilletPdf: React.FC<GenerateBilletPdfProps> = ({
  reservation,
}) => {
  return (
    <div>
      <PDFDownloadLink
        document={<BilletPDF reservation={reservation} />}
        fileName={`billet-${reservation.event.title}.pdf`}
      >
        <button className="button uppercase text-white py-2 px-4 rounded">
          Afficher mon billet
        </button>
      </PDFDownloadLink>
    </div>
  );
};
