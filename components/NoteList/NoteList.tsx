"use client";

import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteNote } from "@/lib/api";
import type { Note } from "@/types/note";
import css from "./NoteList.module.css";

interface NoteListProps {
  notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });

  if (notes.length === 0) {
    return <p>No notes found.</p>;
  }

  return (
    <ul className={css.list}>
      {notes.map((note) => (
        <li className={css.item} key={note.id}>
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.content}>{note.content}</p>

          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>

            <Link className={css.link} href={`/notes/${note.id}`}>
              View details
            </Link>

            <button
              type="button"
              className={css.button}
              onClick={() => deleteMutation.mutate(note.id)}
              disabled={deleteMutation.variables === note.id}
            >
              {deleteMutation.variables === note.id ? "Deleting..." : "Delete"}
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}