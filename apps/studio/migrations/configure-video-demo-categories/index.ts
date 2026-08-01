import {
  at,
  createIfNotExists,
  defineMigration,
  patch,
  set,
} from "sanity/migrate";

const categories = [
  {
    legacyValue: "audiobooks",
    _id: "video-demo-category-audiobooks",
    title: "Audiobooks",
    orderRank: "0|100008:",
  },
  {
    legacyValue: "game",
    _id: "video-demo-category-game",
    title: "Game",
    orderRank: "0|10000o:",
  },
  {
    legacyValue: "animation",
    _id: "video-demo-category-animation",
    title: "Animation",
    orderRank: "0|100014:",
  },
  {
    legacyValue: "ivr",
    _id: "video-demo-category-ivr",
    title: "IVR",
    orderRank: "0|10001k:",
  },
] as const;

export default defineMigration({
  title: "Configure video demo categories",
  documentTypes: ["videoDemo"],
  filter: `category in [${categories
    .map(({ legacyValue }) => `"${legacyValue}"`)
    .join(", ")}]`,
  async *migrate(documents) {
    yield categories.map(({ legacyValue: _, ...category }) =>
      createIfNotExists({
        ...category,
        _type: "videoDemoCategory",
        enabled: true,
      }),
    );

    for await (const document of documents()) {
      const category = categories.find(
        ({ legacyValue }) => legacyValue === document.category,
      );

      if (category && document._id) {
        yield patch(
          document._id,
          at("category", set({ _type: "reference", _ref: category._id })),
        );
      }
    }
  },
});
