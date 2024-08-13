import Link from "next/link";
import { Button } from "@/components/ui/button";
import Ripple from "@/components/magicui/ripple";
import ContactForm from "@/components/shared/ContactForm";

export default function ContactPage() {
  return (
    <div className="flex justify-center items-center">
      <div className="relative flex h-screen w-screen flex-col items-end justify-center overflow-hidden bg-background shadowCj">
        <Ripple />
        <section className="sm:wrapper z-20">
          <div className="wrapper flex flex-col sm:justify-end sm:pt-5 lg:pt-2">
            <div className="flex flex-col justify-center items-center pt-8 sm:pt-0 lg:justify-center lg:items-center gap-4">
              <h1 className="h1-bold rubik">Contactez-nous</h1>
              <p className="p-regular-14 rubik">
                N&apos;hésitez pas à nous contacter pour plus
                d&apos;informations sur nos services ou pour toute autre
                demande.
              </p>
              <ContactForm />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
