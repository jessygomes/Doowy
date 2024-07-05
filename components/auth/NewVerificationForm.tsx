"use client";
import { useSearchParams } from "next/navigation";
import { CardWrapper } from "./CardWrapper";
import { BeatLoader } from "react-spinners";
import { useCallback, useEffect, useState } from "react";
import { newVerification } from "@/lib/actions/auth.actions";
import { FormSuccess } from "../shared/FormSuccess";
import { FormError } from "../shared/FormError";

export const NewVerificationForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  //! Récupérer le token depuis l'URL
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const onSubmit = useCallback(() => {
    if (success || error) return;

    if (!token) {
      setError("Token introuvable.");
      return;
    }

    newVerification(token)
      .then((data) => {
        setError(data?.error);
        setSuccess(data?.success);
      })
      .catch((error) => {
        setError(
          "Une erreur est survenue lors de la vérification de votre email."
        );
      });
  }, [token, success, error]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <CardWrapper
      headerLabel="Confirmation de votre adresse mail"
      backButtonLabel="Retourner à la page de connexion"
      backButtonHref="/auth/connexion"
    >
      <div className="flex items-center w-full justify-center">
        {!success && !error && <BeatLoader color="purple" />}
        <FormSuccess message={success} />
        {!success && <FormError message={error} />}
      </div>
    </CardWrapper>
  );
};
