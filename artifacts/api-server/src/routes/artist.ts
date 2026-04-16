import { Router } from "express";
import { db } from "@workspace/db";
import { artistTable, tracksTable, albumsTable } from "@workspace/db";
import { count } from "drizzle-orm";

const router = Router();

router.get("/", async (_req, res) => {
  const artists = await db.select().from(artistTable).limit(1);

  if (artists.length === 0) {
    res.status(404).json({ error: "Artist not found" });
    return;
  }

  const a = artists[0];
  res.json({
    name: a.name,
    bio: a.bio,
    avatarUrl: a.avatarUrl,
    genre: a.genre,
    location: a.location,
    socialLinks: {
      instagram: a.instagram ?? undefined,
      twitter: a.twitter ?? undefined,
      youtube: a.youtube ?? undefined,
    },
  });
});

export default router;
