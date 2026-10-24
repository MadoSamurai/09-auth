import { axiosInstance } from "./api";
import { cookies } from "next/headers";
import { User } from "@/types/user";
import { FetchNotesParams, FetchNoteResponse, Note } from "@/types/note";

export const checkSessionServer = async (): Promise<User | null> => {
  try {
    const cookieStore = await cookies();
    const { data } = await axiosInstance.get<User>("/auth/session", {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });
    return data;
  } catch {
    return null;
  }
};

export const getMeServer = async (): Promise<User | null> => {
  try {
    const cookieStore = await cookies();
    const { data } = await axiosInstance.get<User>("/users/me", {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });
    return data;
  } catch {
    return null;
  }
};

export const fetchNotesServer = async (
  params?: FetchNotesParams,
): Promise<FetchNoteResponse> => {
  const cookieStore = await cookies();
  const queryParams = { ...params };
  if (queryParams.tag === "all" || !queryParams.tag) {
    delete queryParams.tag;
  }

  const { data } = await axiosInstance.get<FetchNoteResponse>("/notes", {
    params: queryParams,
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return data;
};

export const fetchNoteByIdServer = async (id: string): Promise<Note> => {
  const cookieStore = await cookies();
  const { data } = await axiosInstance.get<Note>(`/notes/${id}`, {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return data;
};
