import { useState, useEffect } from "react";

interface BasePaginationProps {
  total: number;
  page: number;
  onPageChange: (page: number) => void;
}

const BasePagination = ({
  total,
  page,
  onPageChange,
}: BasePaginationProps) => {
  const [currentPage, setCurrentPage] = useState(page);

  useEffect(() => {
    if (page >= 1 && page <= total) {
      setCurrentPage(page);
    }
  }, [page, total]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= total) {
      setCurrentPage(newPage);
      onPageChange(newPage);
    }
  };

  let startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(total, startPage + 4);
  const getPageRange = () => {
    if (endPage - startPage < 4 && startPage > 1) {
      startPage = Math.max(1, endPage - 4);
    }

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );
  };

  const pageRange = getPageRange();

  return (
    <div className="flex items-center mt-4 gap-2 justify-center text-sm">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-3 py-1 rounded-lg ${
          currentPage === 1
            ? "text-gray-400 cursor-not-allowed"
            : "hover:bg-gray-100"
        }`}
      >
        Prev
      </button>

      {startPage > 1 && (
        <>
          <button
            onClick={() => handlePageChange(1)}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100"
          >
            1
          </button>
          {startPage > 2 && <span className="px-2">...</span>}
        </>
      )}

      {pageRange.map((number) => (
        <button
          key={number}
          onClick={() => handlePageChange(number)}
          className={`w-8 h-8 flex items-center justify-center rounded-lg ${
            number === currentPage
              ? "bg-black text-white hover:bg-black/70"
              : "hover:bg-gray-100"
          }`}
        >
          {number}
        </button>
      ))}

      {endPage < total && (
        <>
          {endPage < total - 1 && <span className="px-2">...</span>}
          <button
            onClick={() => handlePageChange(total)}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100"
          >
            {total}
          </button>
        </>
      )}

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === total}
        className={`px-3 py-1 rounded-lg ${
          currentPage === total
            ? "text-gray-400 cursor-not-allowed"
            : "hover:bg-gray-100"
        }`}
      >
        Next
      </button>
    </div>
  );
};

export default BasePagination;
