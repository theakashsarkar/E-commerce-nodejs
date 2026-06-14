import { Category } from "../models/categoryModel.js";

export const CategoryService = {
  create: async (categoryDto) => {
    const existingCategory = await Category.findOne({ slug: categoryDto.slug });
    if (existingCategory) {
      throw new Error(
        `Category with slug '${categoryDto.slug}' already exists.`,
      );
    }
    const newCategory = await Category.create({
      name: categoryDto.name,
      slug: categoryDto.slug,
      parentId: categoryDto.parentId,
    });
    return newCategory;
  },
};
