import { Router } from "express";
import { db } from "@workspace/db";
import { tracksTable, albumsTable } from "@workspace/db";
import { eq, count, sum } from "drizzle-orm";
import { GetAlbumParams } from "@workspace/api-zod";

const router = Router();

router.get("/", async (_req, res) => {
  const albums = await db.select().from(albumsTable);

  const result = await Promise.all(
    albums.map(async (album) => {
      const stats = await db
        .select({ trackCount: count(), totalDuration: sum(tracksTable.duration) })
        .from(tracksTable)
        .where(eq(tracksTable.albumId, album.id));

      return {
        id: album.id,
        title: album.title,
        coverUrl: album.coverUrl,
        releaseYear: album.releaseYear,
        genre: album.genre,
        trackCount: Number(stats[0]?.trackCount ?? 0),
        totalDuration: Number(stats[0]?.totalDuration ?? 0),
      };
    })
  );

  res.json(result);
});

router.get("/:id", async (req, res) => {
  const parsed = GetAlbumParams.safeParse({ id: Number(req.params.id) });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const albums = await db
    .select()
    .from(albumsTable)
    .where(eq(albumsTable.id, parsed.data.id))
    .limit(1);

  if (albums.length === 0) {
    res.status(404).json({ error: "Album not found" });
    return;
  }

  const album = albums[0];

  const tracks = await db
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
    .where(eq(tracksTable.albumId, album.id))
    .orderBy(tracksTable.trackNumber);

  res.json({
    id: album.id,
    title: album.title,
    coverUrl: album.coverUrl,
    releaseYear: album.releaseYear,
    genre: album.genre,
    tracks,
  });
});

export default router;
