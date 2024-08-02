import React, { useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  loadMoreData: () => void; // Add this prop
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  setCurrentPage,
  loadMoreData, // Destructure the new prop
}) => {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const startPages = [1, 2];
    const endPages = [totalPages - 2, totalPages - 1, totalPages];

    if (currentPage > 3) {
      pages.push(...startPages, "...");
    } else {
      for (let i = 1; i <= Math.min(currentPage + 1, 3); i++) {
        pages.push(i);
      }
    }

    if (currentPage > 3 && currentPage < totalPages - 2) {
      pages.push(currentPage);
    }

    if (currentPage >= totalPages - 2) {
      for (let i = totalPages - 2; i <= totalPages; i++) {
        pages.push(i);
      }
    } else if (currentPage < totalPages - 2) {
      pages.push(...endPages);
    }

    return Array.from(new Set(pages));
  };

  const pageNumbers = getPageNumbers();

  useEffect(() => {
    // Load more data when the user reaches the last page
    if (currentPage === totalPages) {
      loadMoreData();
    }
  }, [currentPage, totalPages, loadMoreData]);

  return (
    <nav className="border-t border-gray-200 px-4 flex items-center justify-between sm:px-0">
      <div className="-mt-px w-0 flex-1 flex">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className="border-t-2 border-transparent pt-4 pr-1 inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
          disabled={currentPage === 1}
        >
          <FaChevronLeft className="mr-3 h-5 w-5 text-gray-400" aria-hidden="true" />
          Previous
        </button>
      </div>
      <div className="hidden md:-mt-px md:flex">
        {pageNumbers.map((page, index) =>
          typeof page === "number" ? (
            <button
              key={index}
              onClick={() => setCurrentPage(page)}
              className={`border-t-2 pt-4 px-4 inline-flex items-center text-sm font-medium ${
                currentPage === page
                  ? "border-indigo-500 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              aria-current={currentPage === page ? "page" : undefined}
            >
              {page}
            </button>
          ) : (
            <span
              key={index}
              className="border-transparent text-gray-500 border-t-2 pt-4 px-4 inline-flex items-center text-sm font-medium"
            >
              ...
            </span>
          )
        )}
      </div>
      <div className="-mt-px w-0 flex-1 flex justify-end">
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          className="border-t-2 border-transparent pt-4 pl-1 inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
          disabled={currentPage === totalPages}
        >
          Next
          <FaChevronRight className="ml-3 h-5 w-5 text-gray-400" aria-hidden="true" />
        </button>
      </div>
    </nav>
  );
};

export default Pagination;
