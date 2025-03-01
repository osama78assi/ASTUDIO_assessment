import { ReactNode } from "react";

type PageLinkProps = {
  index: number;
  linksCount: number;
  currentPage: number;
  pages: number;
  beforeSize: boolean;
  isLoading: boolean;
  naviagteTo: (page: number) => void;
};

function PageLink({
  index,
  linksCount,
  currentPage,
  pages,
  naviagteTo,
  beforeSize = true,
  isLoading,
}: PageLinkProps): JSX.Element | ReactNode {
  // To start count from
  // Either direct if we are still before size like we allow 5 links and we are in page 3
  // Or we are in page 7 and we have 5 pages
  const page = beforeSize ? index + 1 : currentPage - linksCount + index + 3;
  if (page < pages) {
    return (
      <span
        onClick={() => {
          // Don't navigate if it's the same page
          if (currentPage === page) return;
          naviagteTo(page);
        }}
        className={`page-number ${
          page === currentPage ? "inline-flex -translate-y-2" : ""
        } ${isLoading ? "cursor-not-allowed" : ""}`}
      >
        {page}
      </span>
    );
  }
  return null;
}

export default PageLink;
