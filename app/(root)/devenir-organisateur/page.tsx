import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

export default function page() {
  return (
    <>
      <section className="bg-primary-50 bg-dotted-pattern bg-contain py-5 md:py-10">
        <div className="wrapper">
          <div className="flex flex-col justify-center gap-8">
            <h1 className="h1-bold">
              Créez vos évenements et{" "}
              <span className=" text-gray-600">
                Partagez les avec la communauté
              </span>
            </h1>
            <p className="p-regular-20 md:p-regular-24">
              Vous êtes une association, un particulier ou un professionnel et
              vous souhaitez organiser des événements dans votre région ?
            </p>
            <Button size="lg" asChild className="button w-full sm:w-fit">
              <Link href="/auth/inscription/org">
                S&apos;inscrire en tant qu&apos;organisateur
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
