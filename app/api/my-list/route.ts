import { and, desc, eq } from "drizzle-orm";
import { getDb } from "../../../db";
import { savedMovies } from "../../../db/schema";

const AUTH_USER_HEADER = "oai-authenticated-user-id";
const VIEWER_HEADER = "x-chill-viewer-id";

function ownerId(request: Request) {
  return (
    request.headers.get(AUTH_USER_HEADER) ??
    request.headers.get(VIEWER_HEADER)?.trim() ??
    ""
  );
}

function databaseError(error: unknown) {
  const message = error instanceof Error ? error.message : "Unexpected error";
  if (message.includes("no such table")) {
    return "Penyimpanan Daftar Saya belum siap. Silakan coba lagi setelah pembaruan selesai.";
  }
  return "Daftar Saya belum dapat diperbarui. Silakan coba lagi.";
}

export async function GET(request: Request) {
  const owner = ownerId(request);
  if (!owner) return Response.json({ error: "Identitas pengguna tidak tersedia." }, { status: 400 });

  try {
    const db = getDb();
    const movies = await db
      .select({
        id: savedMovies.movieId,
        title: savedMovies.title,
        image: savedMovies.image,
        badge: savedMovies.badge,
      })
      .from(savedMovies)
      .where(eq(savedMovies.ownerId, owner))
      .orderBy(desc(savedMovies.createdAt), desc(savedMovies.id));

    return Response.json({ movies });
  } catch (error) {
    return Response.json({ error: databaseError(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const owner = ownerId(request);
  if (!owner) return Response.json({ error: "Identitas pengguna tidak tersedia." }, { status: 400 });

  try {
    const payload = (await request.json()) as {
      id?: string;
      title?: string;
      image?: string;
      badge?: "new" | "top" | "premium";
    };
    const movieId = payload.id?.trim() ?? "";
    const title = payload.title?.trim() ?? "";
    const image = payload.image?.trim() ?? "";

    if (!movieId || !title || !image) {
      return Response.json({ error: "Data film tidak lengkap." }, { status: 400 });
    }

    const db = getDb();
    await db
      .insert(savedMovies)
      .values({ ownerId: owner, movieId, title, image, badge: payload.badge })
      .onConflictDoNothing({ target: [savedMovies.ownerId, savedMovies.movieId] });

    return Response.json({ saved: true }, { status: 201 });
  } catch (error) {
    return Response.json({ error: databaseError(error) }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const owner = ownerId(request);
  const movieId = new URL(request.url).searchParams.get("id")?.trim() ?? "";
  if (!owner || !movieId) {
    return Response.json({ error: "Film tidak ditemukan." }, { status: 400 });
  }

  try {
    const db = getDb();
    await db
      .delete(savedMovies)
      .where(and(eq(savedMovies.ownerId, owner), eq(savedMovies.movieId, movieId)));

    return Response.json({ saved: false });
  } catch (error) {
    return Response.json({ error: databaseError(error) }, { status: 500 });
  }
}
