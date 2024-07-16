// import { SearchParamProps } from "@/types";
import { EventPresentation } from "@/components/shared/EventPresentation";

type SearchParamProps = {
  page?(page: any): unknown;
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

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
