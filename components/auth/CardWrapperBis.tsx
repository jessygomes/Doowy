// "use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { HeaderAuth } from "./HeaderAuth";
import { Social } from "./Social";
import { BackButton } from "./BackButton";

interface CardWrapperProps {
  children: React.ReactNode;
  headerLabel: string;
  backButtonLabel: string;
  backButtonHref: string;
  showSocial?: boolean;
}

export const CardWrapper = ({
  children,
  headerLabel,
  backButtonLabel,
  backButtonHref,
  showSocial,
}: CardWrapperProps) => {
  return (
    <Card className="w-[90%] lg:w-[500px] bg-transparent backdrop-blur-sm shadowCj border-none rounded-sm">
      <CardHeader className="text-white">
        <HeaderAuth label={headerLabel} />
      </CardHeader>
      <CardContent className="text-white rubik">{children}</CardContent>
      {showSocial && (
        <CardFooter>
          <Social />
        </CardFooter>
      )}
      <CardFooter className="text-white">
        <BackButton label={backButtonLabel} href={backButtonHref} />
      </CardFooter>
    </Card>
  );
};
