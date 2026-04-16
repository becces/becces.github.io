import { Router } from "express";
import { db } from "@workspace/db";
import { tracksTable, albumsTable } from "@workspace/db";
import { count } from "drizzle-orm";

const router = Router();

router.get("/", async (_req, res) => {
  const trackCount = await db.select({ count: count() }).from(tracksTable);
  const albumCount = await db.select({ count: count() }).from(albumsTable);

  res.json({
    totalTracks: Number(trackCount[0]?.count ?? 0),
    totalAlbums: Number(albumCount[0]?.count ?? 0),
    totalListens: 4872,
  });
});

export default router;
