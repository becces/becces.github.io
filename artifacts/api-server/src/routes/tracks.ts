import { Router } from "express";
import { db } from "@workspace/db";
import { tracksTable, albumsTable } from "@workspace/db";
import { eq, ilike, or } from "drizzle-orm";
import { ListTracksQueryParams, GetTrackParams } from "@workspace/api-zod";

const router = Router();

router.get("/", async (req, res) => {
  const parsed = ListTracksQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid query params" });
    return;
  }
  const { albumId, search } = parsed.data;

  let query = db
    .select({
      id: tracksTable.id,
      title: tracksTable.title,
      albumId: tracksTable.albumId,
      albumTitle: albumsTable.title,
      albumCoverUrl: albumsTable.coverUrl,
      duration: tracksTable.duration,
      trackNumber: tracksTable.trackNumber,
      audioUrl: tracksTable.audioUrl,
      genre: tracksTable.genre,
      releaseYear: tracksTable.releaseYear,
    })
    .from(tracksTable)
    .leftJoin(albumsTable, eq(tracksTable.albumId, albumsTable.id));

  if (albumId !== undefined) {
    const rows = await db
      .select({
        id: tracksTable.id,
        title: tracksTable.title,
        albumId: tracksTable.albumId,
        albumTitle: albumsTable.title,
        albumCoverUrl: albumsTable.coverUrl,
        duration: tracksTable.duration,
        trackNumber: tracksTable.trackNumber,
        audioUrl: tracksTable.audioUrl,
        genre: tracksTable.genre,
        releaseYear: tracksTable.releaseYear,
      })
      .from(tracksTable)
      .leftJoin(albumsTable, eq(tracksTable.albumId, albumsTable.id))
      .where(eq(tracksTable.albumId, albumId));
    res.json(rows);
    return;
  }

  if (search) {
    const rows = await db
      .select({
        id: tracksTable.id,
        title: tracksTable.title,
        albumId: tracksTable.albumId,
        albumTitle: albumsTable.title,
        albumCoverUrl: albumsTable.coverUrl,
        duration: tracksTable.duration,
        trackNumber: tracksTable.trackNumber,
        audioUrl: tracksTable.audioUrl,
        genre: tracksTable.genre,
        releaseYear: tracksTable.releaseYear,
      })
      .from(tracksTable)
      .leftJoin(albumsTable, eq(tracksTable.albumId, albumsTable.id))
      .where(ilike(tracksTable.title, `%${search}%`));
    res.json(rows);
    return;
  }

  const rows = await query;
  res.json(rows);
});

router.get("/:id", async (req, res) => {
  const parsed = GetTrackParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const rows = await db
    .select({
      id: tracksTable.id,
      title: tracksTable.title,
      albumId: tracksTable.albumId,
      albumTitle: albumsTable.title,
      albumCoverUrl: albumsTable.coverUrl,
      duration: tracksTable.duration,
      trackNumber: tracksTable.trackNumber,
      audioUrl: tracksTable.audioUrl,
      genre: tracksTable.genre,
      releaseYear: tracksTable.releaseYear,
    })
    .from(tracksTable)
    .leftJoin(albumsTable, eq(tracksTable.albumId, albumsTable.id))
    .where(eq(tracksTable.id, parsed.data.id))
    .limit(1);

  if (rows.length === 0) {
    res.status(404).json({ error: "Track not found" });
    return;
  }
  res.json(rows[0]);
});

export default router;
