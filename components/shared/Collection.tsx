import { Event } from "@/types";
import Card from "./Card";
import { Pagination } from "./Pagination";

type CollectionProps = {
  data: any;
  emptyTitle: string;
  emptyStateSubtext: string;
  collectionType?:
    | "Events_Organized"
    | "My_tickets"
    | "All_Events"
    | "All_Events_Favorite";
  limit: number;
  page: number | string;
  totalPages?: number;
  urlParamName?: string;
};

const Collection = ({
  data,
  emptyTitle,
  emptyStateSubtext,
  collectionType,
  limit,
  page,
  totalPages = 0,
  urlParamName = "",
}: CollectionProps) => {
  return (
    <>
      {data.length > 0 ? (
        <div className="flex flex-col items-center gap-10">
          <ul className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:gap-10">
            {data.map((event: Event) => {
              const hasOrderLink = collectionType === "Events_Organized";
              const hidePrice = collectionType === "My_tickets";
              const removeFavorite = collectionType === "All_Events_Favorite";

              return (
                <li key={event.id} className="flex justify-center">
                  <Card
                    event={event}
                    hasOrderLink={hasOrderLink}
                    hidePrice={hidePrice}
                    removeFavorite={removeFavorite}
                  />
                </li>
              );
            })}
          </ul>

          {totalPages > 1 && (
            <Pagination
              urlParamName={urlParamName}
              page={page}
              totalPages={totalPages}
            />
          )}
        </div>
      ) : (
        <div className="flex-center wrapper min-h-[200px] w-2/3 flex-col gap-3 rounded-sm bg-primary dark:bg-dark py-28 text-center innerShadow">
          {" "}
          <h3 className="rubik p-bold-20 md:h5-bold ">{emptyTitle}</h3>
          <p className="rubik p-regular-14 ">{emptyStateSubtext}</p>
        </div>
      )}
    </>
  );
};

export default Collection;
