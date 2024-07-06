import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

//! Fonction pour envoyer un email de vérification
export const sendVerificationEmail = async (email: string, token: string) => {
  // Changer l'url pour la production
  const confirmLink = `http://localhost:3000/auth/new-verification?token=${token}`;

  // Envoyer l'email
  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "VIBEY! - Confirmer votre adresse email",
    html: `<p>VIBEY! : Cliquez sur le lien suivant pour confirmer votre adresse email: <a href="${confirmLink}">Cliquez ici</a></p>`,
  });
};

//! Fonction pour envoyer un email de réinitialisation du mot de passe
export const sendPasswordResetEmail = async (email: string, token: string) => {
  // Changer l'url pour la production
  const resetLink = `http://localhost:3000/auth/new-password?token=${token}`;

  // Envoyer l'email
  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "VIBEY! - Réinitialiser votre mot de passe",
    html: `<p>VIBEY! : Cliquez sur le lien suivant pour réinitialiser votre mot de passe: <a href="${resetLink}">Cliquez ici</a></p>`,
  });
};

//! Fonction pour envoyer un email : Authentification à deux facteurs
export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "VIBEY! - Code de vérification à deux facteurs",
    html: `<p>VIBEY! : Voici votre code de vérification à deux facteurs : ${token}</p>`,
  });
};
