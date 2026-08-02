import groq from "groq";
import type { Image } from "@sanity/types";
import type { SanityImageCrop } from "./generated-types";

type SanityImage = Omit<Image, "crop"> & { crop?: SanityImageCrop };

export type VideoDemo = {
  _id: string;
  title: string;
  url: string;
  poster?: SanityImage;
};

export type VideoDemoCategory = {
  _id: string;
  title: string;
  demos: VideoDemo[];
};

export const postQuery = groq`*[_type == "post" && slug.current == $slug][0]`;

export const postsQuery = groq`*[_type == "post" && defined(slug.current)] | order(_createdAt desc)`;

export const testimonialsQuery = groq`*[_type == "testimonial"] | order(orderRank)`;

export const tracksQuery = groq`*[_type == "track"] | order(orderRank)`;

export const audioTracksQuery = groq`*[_type == "audioTrack"] { ..., "url": audioFile.asset->url } | order(orderRank)`;

export const videoDemoCategoriesQuery = groq`
  *[_type == "videoDemoCategory" && enabled != false] | order(orderRank) {
    _id,
    title,
    "demos": *[_type == "videoDemo" && category._ref == ^._id] | order(orderRank) {
      _id,
      title,
      "url": videoFile.asset->url,
      poster
    }
  }
`;

export const sectionsQuery = groq`*[_type == "section"] | order(orderRank)`;
