"use client";
import { useState, useTransition, useRef } from "react";

import emailjs from "@emailjs/browser";

import { Button } from "../ui/button";

const ContactForm = () => {
  const [confirmationMessage, setConfirmationMessage] = useState("");

  const [isPending, startTransition] = useTransition();

  const [form, setForm] = useState({
    name: "",
    type: "",
    object: "",
    mail: "",
    message: "",
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const sendEmail = (e: any) => {
    e.preventDefault();

    startTransition(() => {
      emailjs
        .sendForm("service_vqx40jh", "template_wor5iln", e.target, {
          publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
        })
        .then(
          (result) => {
            console.log(result.text);
            setForm({
              name: "",
              type: "",
              object: "",
              mail: "",
              message: "",
            });
            setConfirmationMessage("Email envoyé avec succès !");
            setTimeout(() => {
              setConfirmationMessage("");
            }, 10000);
            console.log("SUCCESS!");
          },
          (error: any) => {
            console.log("FAILED...", error.text);
          }
        );
    });
  };

  return (
    <form onSubmit={sendEmail} className="w-full sm:w-1/2 flex flex-col gap-4 ">
      {confirmationMessage && (
        <p className="text-white bg-emerald-400 p-4 rounded-sm rubik text-center">
          {confirmationMessage}
        </p>
      )}
      <div className="flex flex-col sm:flex-row gap-2 w-full">
        <div className="flex flex-col gap-2 w-full">
          <label className="text-white rubik">Nom & Prénom</label>
          <input
            type="text"
            name="name"
            placeholder="Denzel Curry"
            onChange={handleChange}
            value={form.name}
            required
            minLength={2}
            maxLength={30}
            className="input-field"
          />
        </div>

        <div className="flex flex-col gap-2 w-full">
          <label className="text-white rubik">Type d&apos;organisation</label>
          <input
            type="text"
            name="type"
            placeholder="Association, particulier, entreprise..."
            onChange={handleChange}
            value={form.type}
            required
            minLength={2}
            maxLength={30}
            className="input-field"
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 w-full">
        <div className="flex flex-col gap-2 w-full">
          <label className="text-white rubik">Email</label>
          <input
            type="text"
            name="mail"
            placeholder="vibey@vibey.fr"
            onChange={handleChange}
            value={form.mail}
            required
            minLength={2}
            maxLength={40}
            className="input-field"
          />
        </div>

        <div className="flex flex-col gap-2 w-full">
          <label className="text-white rubik">Objet</label>
          <input
            type="text"
            name="object"
            placeholder="Comment créer un événement ?"
            onChange={handleChange}
            value={form.object}
            required
            minLength={2}
            maxLength={30}
            className="input-field"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-white rubik">Message</label>
        <textarea
          name="message"
          placeholder="Ecrire votre message ici..."
          onChange={handleChange}
          value={form.message}
          required
          minLength={2}
          maxLength={350}
          className="rubik text-dark dark:text-dark bg-grey-50 flex flex-1 placeholder:text-grey-500 p-regular-16 px-5 py-3 border-none focus-visible:ring-transparent rounded-sm"
        />
      </div>

      <Button type="submit" size="lg" className="button col-span-2 w-full">
        {isPending ? "Envoie..." : "Envoyer"}
      </Button>
    </form>
  );
};

export default ContactForm;
