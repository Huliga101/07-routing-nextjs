import axios from "axios";
import type { CreateNoteData, Note, NoteTag } from "@/types/note";

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

const API_URL = "https://notehub-public.goit.study/api/notes";

const noteApi = axios.create({
  baseURL: API_URL,
});

const getAuthHeaders = () => ({
  Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`,
});

interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
  tag?: NoteTag;
}

export async function fetchNotes({
  page = 1,
  perPage = 12,
  search = "",
  tag,
}: FetchNotesParams = {}): Promise<FetchNotesResponse> {
  const params: Record<string, string | number> = {
    page,
    perPage,
  };

  if (search.trim()) {
    params.search = search.trim();
  }

  if (tag) {
    params.tag = tag;
  }

  const response = await noteApi.get<FetchNotesResponse>("", {
    params,
    headers: getAuthHeaders(),
  });

  return response.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const response = await noteApi.get<Note>(`/${id}`, {
    headers: getAuthHeaders(),
  });

  return response.data;
}

export async function createNote(note: CreateNoteData): Promise<Note> {
  const response = await noteApi.post<Note>("", note, {
    headers: getAuthHeaders(),
  });

  return response.data;
}

export async function deleteNote(id: string): Promise<Note> {
  const response = await noteApi.delete<Note>(`/${id}`, {
    headers: getAuthHeaders(),
  });

  return response.data;
}