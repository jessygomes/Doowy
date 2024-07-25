import { RegisterForm } from "@/components/auth/RegisterForm";
import { Suspense } from "react";

export default function RegisterPage() {
  return (
    <section className="h-screen w-screen bg-auth flex-center">
      <Suspense>
        <RegisterForm type="organizer" label="Créer un compte - Organisateur" />
      </Suspense>
    </section>
  );
}
