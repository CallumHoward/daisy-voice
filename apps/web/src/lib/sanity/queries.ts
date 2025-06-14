import groq from "groq";

export const postQuery = groq`*[_type == "post" && slug.current == $slug][0]`;

export const postsQuery = groq`*[_type == "post" && defined(slug.current)] | order(_createdAt desc)`;

export const testimonialsQuery = groq`*[_type == "testimonial"] | order(orderRank)`;

export const tracksQuery = groq`*[_type == "track"] | order(orderRank)`;

export const audioTracksQuery = groq`*[_type == "audioTrack"] { ..., "url": audioFile.asset->url } | order(orderRank)`;

export const sectionsQuery = groq`*[_type == "section"] | order(orderRank)`;
