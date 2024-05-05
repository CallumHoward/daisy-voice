import imageUrlBuilder from "@sanity/image-url";
import type { Image } from "@sanity/types";
import { client } from "./client";
import type { SanityImageCrop } from "./generated-types";

const builder = imageUrlBuilder(client);

export function urlFor(
  // HACK: Type workaround for mismatched types
  source: Omit<Image, "crop"> & { crop?: SanityImageCrop },
) {
  return builder.image(source);
}
