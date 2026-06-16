import { z } from "zod";
import { generateSlug } from "../utils/slugify.js";

export const createProductSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, "Product name must be at least 3 characters")
      .max(150, "Product name cannot exceed 150 characters"),

    slug: z.string().trim().lowercase().optional(),
    description: z
      .string()
      .trim()
      .min(10, "Description must be at least 10 characters"),

    price: z.coerce
      .number({ coerce: true })
      .positive("Price must be a positive number"),
    compareAtPrice: z.number({ coerce: true }).positive().nullable().optional(),
    sku: z.string().trim().optional(),
    stock: z.coerce
      .number({ coerce: true })
      .int()
      .nonnegative("Stock cannot be negative"),
    category: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, "Invalid Category ID format")
      .optional(),

    images: z.object({
      // thumbnail: z.string().url("Thumbnail must be a valid asset URL"),
      thumbnail: z.string().min(1, "Thumbnail is required"),
      gallery: z
        .array(z.string().url("Gallery items must be valid asset URLs"))
        .default([]),
    }),

    // isFeatured: z.boolean().optional().default(false),
    // isActive: z.boolean().optional().default(true),
  })
  .transform((data) => {
    if (!data.slug || data.slug.trim() === "") {
      data.slug = generateSlug(data.name);
      return data;
    }

    data.slug = generateSlug(data.slug);
    return data;
  });

export class CreateProductDTO {
  constructor(validatedData) {
    this.name = validatedData.name;
    this.slug = validatedData.slug;
    this.description = validatedData.description;
    this.price = validatedData.price;
    this.compareAtPrice = validatedData.compareAtPrice || null;
    this.sku = validatedData.sku || null;
    this.stock = validatedData.stock;
    this.category = validatedData.category;
    this.images = {
      thumbnail: validatedData.images.thumbnail,
      gallery: validatedData.images.gallery,
    };
    this.isFeatured = validatedData.isFeatured;
    this.isActive = validatedData.isActive;
  }
}
