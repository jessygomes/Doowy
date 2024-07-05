import { v4 as uuidv4 } from "uuid";
import { getVerificationTokenByEmail } from "./actions/verification-token";
import { db } from "./db";
import { getPasswordResetTokenByEmail } from "./actions/password-reset";

//! GENERATION DU TOKEN POUR VERIFICATION DE L'EMAIL
export const generateVerificationToken = async (email: string) => {
  // Générer un token unique avec uuidv4
  const token = uuidv4();
  // Le token va expirer 1 heure après sa génération
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  // Vérifier si un token existe déjà pour cet email, si oui, le supprimer
  const existingToken = await getVerificationTokenByEmail(email);
  if (existingToken) {
    await db.verificationToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  // Nouveau token de vérification
  const verificationToken = await db.verificationToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return verificationToken;
};

//! GENERATION DU TOKEN POUR RESET DU PASSWORD
export const generatePasswordResetToken = async (email: string) => {
  // Générer un token unique avec uuidv4
  const token = uuidv4();
  // Le token va expirer 1 heure après sa génération
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  // Vérifier si un token existe déjà pour cet email, si oui, le supprimer
  const existingToken = await getPasswordResetTokenByEmail(email);
  if (existingToken) {
    await db.passwordResetToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  // Nouveau token de reset du password
  const passwordResetToken = await db.passwordResetToken.create({
    data: {
      email,
      token,
      expires,
    },
  });

  return passwordResetToken;
};
