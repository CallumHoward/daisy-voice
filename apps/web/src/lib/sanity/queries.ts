import groq from "groq";
import type { Image } from "@sanity/types";
import type { SanityImageCrop } from "./generated-types";

type SanityImage = Omit<Image, "crop"> & { crop?: SanityImageCrop };

export type VideoDemo = {
  _id: string;
  title: string;
  category: "audiobooks" | "game" | "animation" | "ivr";
  description: string;
  url: string;
  poster?: SanityImage;
};

export const postQuery = groq`*[_type == "post" && slug.current == $slug][0]`;

export const postsQuery = groq`*[_type == "post" && defined(slug.current)] | order(_createdAt desc)`;

export const testimonialsQuery = groq`*[_type == "testimonial"] | order(orderRank)`;

export const tracksQuery = groq`*[_type == "track"] | order(orderRank)`;

export const audioTracksQuery = groq`*[_type == "audioTrack"] { ..., "url": audioFile.asset->url } | order(orderRank)`;

export const videoDemosQuery = groq`*[_type == "videoDemo"] { ..., "url": videoFile.asset->url } | order(orderRank)`;

export const sectionsQuery = groq`*[_type == "section"] | order(orderRank)`;
