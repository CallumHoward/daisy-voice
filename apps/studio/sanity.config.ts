import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { presentationTool } from "sanity/presentation";
import { orderableDocumentListDeskItem } from "@sanity/orderable-document-list";
import { FolderIcon } from "@sanity/icons";

import { schemaTypes } from "./schemas";

export const projectId = process.env.SANITY_STUDIO_PROJECT_ID!;
export const dataset = process.env.SANITY_STUDIO_DATASET!;

export default defineConfig({
  name: "project-name",
  title: "Project Name",
  projectId,
  dataset,
  plugins: [
    structureTool({
      structure: (S, context) =>
        S.list()
          .title("Content")
          .items([
            S.documentTypeListItem("post"),
            orderableDocumentListDeskItem({
              type: "testimonial",
              title: "Testimonial",
              icon: FolderIcon,
              S,
              context,
            }),
          ]),
    }),
    presentationTool({
      previewUrl: {
        origin:
          process.env.SANITY_STUDIO_PREVIEW_URL || "http://localhost:5173",
        previewMode: {
          enable: "/preview/enable",
          disable: "/preview/disable",
        },
      },
    }),
  ],
  schema: {
    types: schemaTypes,
  },
});
