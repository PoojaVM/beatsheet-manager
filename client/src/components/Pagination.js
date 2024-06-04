import React from "react";

const Pagination = ({ currentPage, totalCount, onPageChange }) => {
  const perPage = 10;

  const onPrevClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onPageChange(currentPage - 1);
  };

  const onNextClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onPageChange(currentPage + 1);
  };

  const pageNumber = currentPage + 1;

  const startNumber = pageNumber * perPage - perPage + 1;
  const endNumber =
    pageNumber * perPage > totalCount ? totalCount : pageNumber * perPage;

  const prevDisabled = pageNumber === 1;
  const nextDisabled = pageNumber * perPage >= totalCount;

  return (
    <div class="flex w-full justify-between flex-row items-baseline mt-4">
      <span class="text-sm text-gray-400">
        Showing <span class="font-semibold text-white">{startNumber}</span> to{" "}
        <span class="font-semibold text-white">{endNumber}</span> of{" "}
        <span class="font-semibold text-white">{totalCount}</span> Entries
      </span>
      <div class="inline-flex mt-2 xs:mt-0">
        <button
          class={
            "flex items-center justify-center px-4 h-10 text-base font-medium rounded-s bg-yellow-500 hover:bg-yellow-700 text-white focus:outline-none focus:shadow-outline" +
            (prevDisabled
              ? " cursor-not-allowed bg-yellow-300 hover:bg-yellow-400"
              : "")
          }
          disabled={prevDisabled}
          onClick={onPrevClick}
        >
          Prev
        </button>
        <button
          class={
            "flex items-center justify-center px-4 h-10 text-base font-medium border-0 border-s rounded-e bg-yellow-500 hover:bg-yellow-700 text-white focus:outline-none focus:shadow-outline" +
            (nextDisabled
              ? " cursor-not-allowed bg-yellow-300 hover:bg-yellow-400"
              : "")
          }
          disabled={nextDisabled}
          onClick={onNextClick}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
