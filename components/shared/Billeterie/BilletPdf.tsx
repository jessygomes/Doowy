/* eslint-disable jsx-a11y/alt-text */
"use client";
import { Reservation } from "@/types";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

// Définir les styles pour le PDF
const styles = StyleSheet.create({
  page: {
    padding: 20,
  },
  section: {
    marginBottom: 10,
    padding: 10,
    borderBottom: "1px solid #eaeaea",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
  },
  qrCode: {
    marginVertical: 15,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 200,
    height: "auto",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  rowTitle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

// Composant PDF qui affiche les informations de réservation
const BilletPDF: React.FC<{ reservation: Reservation }> = ({ reservation }) => (
  <Document>
    {reservation.qrCodes.map((qrCode, index) => (
      <Page key={index} size="A4" style={styles.page}>
        {/* Informations sur l'événement */}
        <View style={styles.section}>
          <View style={styles.rowTitle}>
            <Text style={styles.title}>{reservation.event.title}</Text>
            <Text style={styles.title}>doowy!</Text>
          </View>
          <Text style={styles.text}>
            Lieu : {reservation.event.location}, {reservation.event.ville},{" "}
            {reservation.event.departement}
          </Text>
          <Text style={styles.text}>
            Date : {new Date(reservation.event.startDateTime).toLocaleString()}
          </Text>
          <Text style={styles.text}>
            Description :{" "}
            {reservation.event.description || "Pas de description"}
          </Text>
        </View>

        {/* Image de l'événement (si disponible) */}
        <View style={[styles.section, styles.row]}>
          {reservation.event.imageUrl && (
            <View style={styles.qrCode}>
              <Image style={styles.image} src={reservation.event.imageUrl} />
            </View>
          )}

          {/* QR Code spécifique à cette page */}
          <View style={styles.qrCode}>
            <Image src={qrCode.code} style={{ width: 150, height: 150 }} />
          </View>
        </View>

        {/* Informations de l'utilisateur */}
        <View style={styles.section}>
          <Text style={styles.text}>Nom du propriétaire : {}</Text>
          <Text style={styles.text}>ID Réservation : {reservation.id}</Text>
          <Text style={styles.text}>
            ID de l&apos;événement : {reservation.event.id}
          </Text>
        </View>
      </Page>
    ))}
  </Document>
);

export default BilletPDF;
