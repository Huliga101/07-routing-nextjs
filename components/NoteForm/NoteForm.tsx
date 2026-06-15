"use client";

import { ErrorMessage, Field, Form, Formik, type FormikHelpers } from "formik";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as Yup from "yup";
import { createNote } from "@/lib/api";
import type { CreateNoteData, NoteTag } from "@/types/note";
import css from "./NoteForm.module.css";

interface NoteFormProps {
  onClose: () => void;
}

interface NoteFormValues {
  title: string;
  content: string;
  tag: NoteTag;
}

const tags: NoteTag[] = ["Todo", "Work", "Personal", "Meeting", "Shopping"];

const initialValues: NoteFormValues = {
  title: "",
  content: "",
  tag: "Todo",
};

const validationSchema = Yup.object({
  title: Yup.string()
    .min(3, "Title must be at least 3 characters")
    .max(50, "Title must be at most 50 characters")
    .required("Title is required"),
  content: Yup.string().max(500, "Content must be at most 500 characters"),
  tag: Yup.mixed<NoteTag>()
    .oneOf(tags, "Choose a valid tag")
    .required("Tag is required"),
});

export default function NoteForm({ onClose }: NoteFormProps) {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      onClose();
    },
  });

  const handleSubmit = (
    values: NoteFormValues,
    actions: FormikHelpers<NoteFormValues>,
  ) => {
    const newNote: CreateNoteData = {
      title: values.title.trim(),
      tag: values.tag,
    };

    const trimmedContent = values.content.trim();

    if (trimmedContent) {
      newNote.content = trimmedContent;
    }

    createMutation.mutate(newNote, {
      onSettled: () => {
        actions.setSubmitting(false);
      },
    });
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className={css.form}>
          <h2 className={css.title}>Create note</h2>

          <label className={css.label}>
            Title
            <Field className={css.input} name="title" type="text" />
            <ErrorMessage
              className={css.error}
              name="title"
              component="span"
            />
          </label>

          <label className={css.label}>
            Content
            <Field
              className={css.textarea}
              name="content"
              as="textarea"
            />
            <ErrorMessage
              className={css.error}
              name="content"
              component="span"
            />
          </label>

          <label className={css.label}>
            Tag
            <Field className={css.input} name="tag" as="select">
              {tags.map((tagName) => (
                <option key={tagName} value={tagName}>
                  {tagName}
                </option>
              ))}
            </Field>
            <ErrorMessage className={css.error} name="tag" component="span" />
          </label>

          <div className={css.actions}>
            <button type="button" onClick={onClose}>
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting || createMutation.isPending}
            >
              {createMutation.isPending ? "Creating..." : "Create"}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}