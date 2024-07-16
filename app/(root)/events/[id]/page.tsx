import { SearchParamProps } from "../../../../types/index";
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
