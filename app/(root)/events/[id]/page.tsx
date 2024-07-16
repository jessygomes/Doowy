// import { SearchParamProps } from "@/types";
import { EventPresentation } from "@/components/shared/EventPresentation";

export default function EventDetail({
  params: { id },
  searchParams,
}: {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <>
      <EventPresentation params={{ id }} searchParams={searchParams} />
    </>
  );
}
