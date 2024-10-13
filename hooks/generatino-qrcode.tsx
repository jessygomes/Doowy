import QRCode from "qrcode";

export const generateQRCode = async (qrCodeData: string): Promise<string> => {
  try {
    const qrCodeUrl = await QRCode.toDataURL(qrCodeData);
    return qrCodeUrl;
  } catch (err) {
    throw new Error("Erreur lors de la génération du QR Code.");
  }
};
