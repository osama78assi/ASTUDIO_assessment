import { ReactNode } from "react";
import { LINKS_COUNT } from "../../util/constant";
import PageLink from "./PageLink";

type PaginationProps = {
  recordsCount: number;
  recordsPerPage: number;
  currentPage: number;
  isLoading: boolean; // When there is loading it might chagne the total pages depend on filter or records per page
  changePage: (page: number) => void;
};

function Pagination({
  recordsCount,
  recordsPerPage,
  currentPage,
  changePage,
  isLoading,
}: PaginationProps): JSX.Element | ReactNode {
  const pages = Math.ceil(recordsCount / recordsPerPage);

  // In case initial render or there is no users don't render anything
  if (recordsCount === 0) {
    return null;
  }

  function setPreviousPage() {
    if (currentPage === 1) return;

    changePage(currentPage - 1);
  }

  function setNextPage() {
    if (currentPage === pages) return;

    changePage(currentPage + 1);
  }

  return (
    <div className="p-3 w-fit mx-auto flex justify-between gap-5">
      <span
        className={`${
          currentPage === 1
            ? "text-gray-400 cursor-not-allowed"
            : "cursor-pointer"
        }`}
        onClick={setPreviousPage}
      >
        &larr;
      </span>

      <div className="flex gap-5">
        {currentPage > LINKS_COUNT && (
          <>
            <span
              className={`page-number ${isLoading ? "cursor-not-allowed" : ""}`}
              onClick={() => {
                // Don't navigate if it's the same page
                if (currentPage === 1) return;
                changePage(1);
              }}
            >
              1
            </span>
            <span>...</span>
          </>
        )}

        {/* Render N page links either from the start or N - 3 steps back from the current number */}
        {Array.from({ length: LINKS_COUNT }, (_, i) => (
          <PageLink
            key={`page-link-${i}`}
            index={i}
            linksCount={LINKS_COUNT}
            currentPage={currentPage}
            pages={pages}
            naviagteTo={changePage}
            beforeSize={currentPage <= LINKS_COUNT}
            isLoading={isLoading}
          />
        ))}

        {/* In our case adding if we added 2 to the current page we might hit the last page*/}
        {currentPage + 2 < pages && <span>...</span>}
        <span
          className={`page-number ${
            currentPage === pages ? "inline-flex -translate-y-2" : ""
          } ${isLoading ? "cursor-not-allowed" : ""}`}
          onClick={() => {
            if (currentPage === pages) return;
            changePage(pages);
          }}
        >
          {pages}
        </span>
      </div>

      <span
        onClick={setNextPage}
        className={`${
          currentPage === pages
            ? "text-gray-400 cursor-not-allowed"
            : "cursor-pointer"
        }`}
      >
        &rarr;
      </span>
    </div>
  );
}

export default Pagination;
