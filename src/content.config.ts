import { defineCollection } from "astro:content";
import { z } from "zod";

const blog = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.preprocess((val) => {
      if (typeof val === "string") {
        // normalize date-only strings (YYYY-MM-DD) to ISO datetimes at UTC
        if (/^\d{4}-\d{2}-\d{2}$/.test(val)) return val + "T00:00:00Z";
        return val;
      }
      return val;
    }, z.coerce.date()),
    category: z.string(),
    draft: z.boolean().default(false),
  }),
});

export const collections = {
  blog,
};
