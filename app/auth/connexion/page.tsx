import { LoginForm } from "@/components/auth/LoginForm";
import { Suspense } from "react";

export default function page() {
  return (
    <>
      <section className="h-screen w-screen bg-auth flex-center">
        <Suspense>
          <LoginForm />
        </Suspense>
      </section>
    </>
  );
}
