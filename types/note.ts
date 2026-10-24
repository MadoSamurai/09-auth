export type NoteTag = "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";
export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  tag: NoteTag;
}
export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
  tag?: string;
}
export interface FetchNoteResponse {
  notes: Note[];
  totalPages: number;
}
export interface CreateNotePayLoad {
  title: string;
  content: string;
  tag: NoteTag;
}
