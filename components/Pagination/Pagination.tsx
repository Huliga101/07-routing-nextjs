"use client";

import ReactPaginate from "react-paginate";
import css from "./Pagination.module.css";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  page,
  totalPages,
  onPageChange,
}: PaginationProps) {
  return (
    <ReactPaginate
      pageCount={totalPages}
      forcePage={page - 1}
      onPageChange={({ selected }) => onPageChange(selected + 1)}
      previousLabel="←"
      nextLabel="→"
      breakLabel="..."
      containerClassName={css.pagination}
      pageLinkClassName={css.pageLink}
      previousLinkClassName={css.pageLink}
      nextLinkClassName={css.pageLink}
      activeClassName={css.active}
      disabledClassName={css.disabled}
    />
  );
}