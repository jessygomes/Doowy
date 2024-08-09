import { RegisterForm } from "@/components/auth/RegisterForm";
import { Suspense } from "react";
import Ripple from "@/components/magicui/ripple";

export default function RegisterPage() {
  return (
    <section className="relative overflow-hidden h-screen w-screen bg-auth flex-center">
      <Ripple />
      <Suspense>
        <RegisterForm type="organizer" label="Créer un compte - Organisateur" />
      </Suspense>
    </section>
  );
}
