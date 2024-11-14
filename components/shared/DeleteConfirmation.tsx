"use client";

import { useTransition } from "react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { deleteEvent } from "@/lib/actions/event.actions";

import { MdDelete } from "react-icons/md";

export const DeleteConfirmation = ({ eventId }: { eventId: string }) => {
  const pathname = usePathname();
  let [isPending, startTransition] = useTransition();
  const router = useRouter();

  console.log(pathname);

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <MdDelete size={25} className="text-white hover:text-red-600" />
      </AlertDialogTrigger>

      <AlertDialogContent className="bg-dark rounded-sm border-second">
        <AlertDialogHeader>
          <AlertDialogTitle className="rubik text-white">
            Etes-vous sûr de vouloir supprimer cet évenement ?
          </AlertDialogTitle>
          <AlertDialogDescription className="rubik text-second">
            La suppression de cet évenement est irréversible.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel className="text-white rubik">
            Annuler
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={() =>
              startTransition(async () => {
                await deleteEvent({ eventId, path: "/events" });
                router.push("/events");
              })
            }
            className="text-white rubik bg-second hover:bg-third"
          >
            {isPending ? "Suppression..." : "Supprimer"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
