import { Router } from "express";
import { db } from "@workspace/db";
import { tracksTable, albumsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";

const router = Router();

router.get("/", async (_req, res) => {
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
    .orderBy(desc(tracksTable.id))
    .limit(6);

  res.json(rows);
});

export default router;
