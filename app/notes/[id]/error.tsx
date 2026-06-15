"use client";

type NoteDetailsErrorProps = {
  error: Error;
};

export default function NoteDetailsError({ error }: NoteDetailsErrorProps) {
  return <p>Could not fetch note details. {error.message}</p>;
}