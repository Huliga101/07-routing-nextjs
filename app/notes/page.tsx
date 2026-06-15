import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api/notes";
import NotesClient from "./Notes.client";
import css from "./NotesPage.module.css";

const INITIAL_PAGE = 1;
const PER_PAGE = 12;

export default async function NotesPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", "", INITIAL_PAGE],
    queryFn: () =>
      fetchNotes({
        page: INITIAL_PAGE,
        perPage: PER_PAGE,
        search: "",
      }),
  });

  return (
    <main className={css.container}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <NotesClient />
     </HydrationBoundary>
    </main>
  );
}