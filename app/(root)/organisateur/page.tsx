import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Boxes } from "@/components/ui/background-boxes";

export default function page() {
  return (
    <>
      <div className="h-screen relative w-screen overflow-hidden flex flex-col items-end justify-end rounded-sm">
        <div className="absolute inset-0 w-full h-full bg-primary dark:bg-dark z-20 [mask-image:radial-gradient(transparent,black)] pointer-events-none" />
        <Boxes />

        <section className="wrapper bg-dotted-pattern bg-contain z-20">
          <div className="wrapper flex flex-col sm:justify-end sm:pt-5 lg:pt-2 z-20">
            <div className="flex flex-col justify-start items-start gap-4">
              <h1 className="h1-bold text-dark dark:text-white sm:text-left rubik uppercase">
                Créez vos évenements et <br />
                <span className="bg-linear-text">
                  Partagez les avec la communauté!
                </span>
              </h1>
              <p className="p-regular-16 md:p-regular-18 rbik">
                Vous êtes une association, un particulier ou un professionnel et
                vous souhaitez organiser des événements dans votre région ?
              </p>
              <Button
                size="sm"
                asChild
                className="button w-full sm:w-52 lg:w-full"
              >
                <Link
                  href="/inscription/org"
                  className="font-bold tracking-widest"
                >
                  S&apos;inscrire en tant qu&apos;organisateur
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* <div className="w-full h-[20rem] sm:w-full sm:h-[10rem] lg:h-[10rem] z-20">
            <Image
            src="/assets/images/accueilImg.jpg"
            alt="photo d'accueil"
            width={2000}
            height={2000}
            className="object-cover w-full h-full"
            />
            </div> */}
      </div>
    </>
  );
}
