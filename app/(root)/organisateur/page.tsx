import Link from "next/link";

import { Button } from "@/components/ui/button";
import Ripple from "@/components/magicui/ripple";
import BlurIn from "@/components/magicui/blur-in";

export default function page() {
  return (
    <div className="flex justify-center items-center">
      <div className="relative flex h-screen w-screen flex-col items-end justify-end overflow-hidden bg-background shadowCj">
        <Ripple />
        <section className="sm:wrapper z-20">
          <div className="wrapper flex flex-col sm:justify-end sm:pt-5 lg:pt-2">
            <div className=" flex flex-col justify-end items-end lg:justify-center lg:items-center gap-4">
              <h1 className="h1-bold text-dark dark:text-white sm:text-center rubik uppercase">
                <BlurIn word=" Créez vos évenements et" className="" />
                <BlurIn
                  word="Partagez-les avec la communauté!"
                  className="bg-linear-text h1-bold"
                />
                {/* <span className="bg-linear-text">
                      aux événements de votre ville!
                    </span> */}
              </h1>
              <p className="p-regular-16 md:p-regular-18 rubik text-center">
                Vous êtes une association, un particulier ou un professionnel et
                vous souhaitez organiser des événements dans votre région ?{" "}
                <br />
                <Link
                  href="/contact"
                  className=" underline hover:text-grey-400"
                >
                  Contactez-nous pour plus d&apos;informations.
                </Link>
              </p>
              <Button
                size="sm"
                asChild
                className="button w-full sm:w-52 lg:w-fit"
              >
                <Link
                  href="/auth/inscription/org"
                  className="font-bold tracking-widest"
                >
                  S&apos;inscrire en tant qu&apos;organisateur
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
