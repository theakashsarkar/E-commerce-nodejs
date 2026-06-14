import { z } from "zod";
import { generateSlug } from "../utils/slugify.js";
export const createCategorySchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Category name must be at least 2 characters")
      .max(50, "Category name cannot exceed 50 characters"),
    slug: z
      .string()
      .trim()
      .lowercase()
      .min(2, "Slug must be at least 2 characters")
      .optional(),
    parentId: z.string().nullable().optional(),
  })
  .transform((data) => {
    if (!data.slug || data.slug.trim() === "") {
      data.slug = generateSlug(data.name);
      return data;
    }

    data.slug = generateSlug(data.slug);
    return data;
  });

export class CreateCategoryDTO {
  constructor(validated) {
    this.name = validated.name;
    this.slug = validated.slug;
    this.parentId = validated.parentId || null;
  }
}
