import { SearchParamProps } from "@/types";
import { EventPresentation } from "@/components/shared/EventPresentation";

export default function EventDetail({
  params: { id },
  searchParams,
}: SearchParamProps) {
  return (
    <>
      <EventPresentation params={{ id }} searchParams={searchParams} />
    </>
  );
}
