import { FetchNoteResponse, FetchNotesParams, Note } from "@/types/note";
import { axiosInstance } from "./api";
import { User } from "@/types/user";

export const fetchNotes = async (
  params?: FetchNotesParams,
): Promise<FetchNoteResponse> => {
  const queryParams = { ...params };
  if (queryParams.tag === "all" || !queryParams.tag) {
    delete queryParams.tag;
  }
  const { data } = await axiosInstance.get<FetchNoteResponse>("/notes", {
    params: queryParams,
  });
  return data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const { data } = await axiosInstance.get<Note>(`/notes/${id}`);
  return data;
};

export const createNote = async (noteData: {
  title: string;
  content: string;
  tag: string;
}) => {
  const { data } = await axiosInstance.post<Note>("/notes", noteData);
  return data;
};

export const deleteNote = async (id: string) => {
  const { data } = await axiosInstance.delete<Note>(`/notes/${id}`);
  return data;
};

export const register = async (credentials: {
  email: string;
  password: string;
}) => {
  const { data } = await axiosInstance.post<User>(
    "/auth/register",
    credentials,
  );
  return data;
};

export const login = async (credentials: {
  email: string;
  password: string;
}) => {
  const { data } = await axiosInstance.post<User>("/auth/login", credentials);
  return data;
};

export const logout = async () => {
  await axiosInstance.post("/auth/logout");
};

export const checkSession = async () => {
  const { data } = await axiosInstance.get<User>("/auth/session");
  return data;
};

export const getMe = async () => {
  const { data } = await axiosInstance.get<User>("/users/me");
  return data;
};

export const updateMe = async (userData: { username: string }) => {
  const { data } = await axiosInstance.patch<User>("/users/me", userData);
  return data;
};
