import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const albumsTable = pgTable("albums", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  coverUrl: text("cover_url").notNull(),
  releaseYear: integer("release_year").notNull(),
  genre: text("genre").notNull().default(""),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const tracksTable = pgTable("tracks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  albumId: integer("album_id").references(() => albumsTable.id),
  duration: integer("duration").notNull(),
  trackNumber: integer("track_number").notNull().default(1),
  audioUrl: text("audio_url").notNull(),
  genre: text("genre").notNull().default(""),
  releaseYear: integer("release_year").notNull().default(2024),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const artistTable = pgTable("artist", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  bio: text("bio").notNull(),
  avatarUrl: text("avatar_url").notNull(),
  genre: text("genre").notNull().default(""),
  location: text("location").notNull().default(""),
  instagram: text("instagram"),
  twitter: text("twitter"),
  youtube: text("youtube"),
});

export const insertAlbumSchema = createInsertSchema(albumsTable).omit({ id: true, createdAt: true });
export const insertTrackSchema = createInsertSchema(tracksTable).omit({ id: true, createdAt: true });
export const insertArtistSchema = createInsertSchema(artistTable).omit({ id: true });

export type InsertAlbum = z.infer<typeof insertAlbumSchema>;
export type Album = typeof albumsTable.$inferSelect;
export type InsertTrack = z.infer<typeof insertTrackSchema>;
export type Track = typeof tracksTable.$inferSelect;
export type InsertArtist = z.infer<typeof insertArtistSchema>;
export type Artist = typeof artistTable.$inferSelect;
