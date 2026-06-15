"use client";

import { useEffect, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";
import NoteList from "@/components/NoteList/NoteList";
import css from "./NotesPage.module.css";

const PER_PAGE = 12;

export default function NotesClient() {
  const [page, setPage] = useState(1);
  const [inputValue, setInputValue] = useState("");
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      setSearch(inputValue);
      setPage(1);
    }, 500);

    return () => window.clearTimeout(timerId);
  }, [inputValue]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["notes", search, page],
    queryFn: () =>
      fetchNotes({
        page,
        perPage: PER_PAGE,
        search,
      }),
    placeholderData: keepPreviousData,
  });

  if (isLoading) {
    return <p>Loading, please wait...</p>;
  }

  if (isError) {
    throw error;
  }

  const notes = data?.notes ?? [];
  const totalPages = data?.totalPages ?? 0;

  return (
    <>
      <div className={css.toolbar}>
        <SearchBox value={inputValue} onChange={setInputValue} />

        {totalPages > 1 && (
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}

        <button
          type="button"
          className={css.button}
          onClick={() => setIsModalOpen(true)}
        >
          Create note +
        </button>
      </div>

      <NoteList notes={notes} />

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm onClose={() => setIsModalOpen(false)} />
        </Modal>
      )}
    </>
  );
}