import { fetchNoteByIdServer } from "@/lib/api/serverApi";
import NoteDetailsClient from "./NoteDetails.client";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { Metadata } from "next";

interface NoteDetailsProps {
  params: Promise<{ id: string }>;
}

export const generateMetadata = async ({
  params,
}: NoteDetailsProps): Promise<Metadata> => {
  const { id } = await params;
  const note = await fetchNoteByIdServer(id);

  return {
    title: `Note: ${note.title}`,
    description: `${note.content}`,
    openGraph: {
      title: `Note: ${note.title}`,
      description: `${note.content}`,
      url: `https://09-auth-gules-five.vercel.app/notes/${note.id}`,
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
          alt: "NoteHub Note details",
        },
      ],
    },
  };
};

export default async function NoteDetail({ params }: NoteDetailsProps) {
  const { id } = await params;

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteByIdServer(id),
  });

  return (
    <>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <NoteDetailsClient />
      </HydrationBoundary>
    </>
  );
}
