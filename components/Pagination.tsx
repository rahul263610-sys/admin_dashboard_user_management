"use client";

import React from "react";
import "../styles/pagination.css"

interface PaginationProps {
  page: number;
  totalPages: number;
  limit: number;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  page,
  totalPages,
  limit,
  setPage,
  setLimit,
}) => {
  const getPageNumbers = (): number[] => {
    const maxVisible = 5;
    let start = Math.max(1, page - Math.floor(maxVisible / 2));
    let end = start + maxVisible - 1;

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - maxVisible + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  return (
    <div className="pagination">
      <button
        disabled={page <= 1}
        onClick={() => setPage(page - 1)}
      >
        Previous
      </button>

      <select
        value={limit}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
          setLimit(Number(e.target.value));
          setPage(1);
        }}
      >
        <option value={10}>10</option>
        <option value={25}>25</option>
        <option value={50}>50</option>
      </select>

      <span>
        Page {page} of {totalPages}
      </span>

      <div className="page-numbers">
        {getPageNumbers().map((p) => (
          <button
            key={p}
            className={page === p ? "active" : ""}
            onClick={() => setPage(p)}
          >
            {p}
          </button>
        ))}
      </div>

      <button
        disabled={page >= totalPages}
        onClick={() => setPage(page + 1)}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
