import type { PortableTextBlock } from "@portabletext/types";
import type { ImageAsset, Slug } from "@sanity/types";
import groq from "groq";

export const postQuery = groq`*[_type == "post" && slug.current == $slug][0]`;

export const postsQuery = groq`*[_type == "post" && defined(slug.current)] | order(_createdAt desc)`;

export interface Post {
  _type: "post";
  _createdAt: string;
  title?: string;
  slug: Slug;
  excerpt?: string;
  mainImage?: ImageAsset;
  body: PortableTextBlock[];
}

export const testimonialsQuery = groq`*[_type == "testimonial"] | order(_createdAt desc)`;

export interface Testimonial {
  _type: "testimonial";
  _createdAt: string;
  name: string;
  from: string;
  content: PortableTextBlock[];
  avatarSrc?: ImageAsset;
  rating?: number;
}
