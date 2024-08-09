import { LoginForm } from "@/components/auth/LoginForm";
import { Suspense } from "react";
import Ripple from "@/components/magicui/ripple";

export default function page() {
  return (
    <>
      <section className="relative overflow-hidden h-screen w-screen bg-auth flex-center">
        <Ripple />
        <Suspense>
          <LoginForm />
        </Suspense>
      </section>
    </>
  );
}
