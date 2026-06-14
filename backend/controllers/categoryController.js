import {
  CreateCategoryDTO,
  createCategorySchema,
} from "../dtos/CategoryDTO.js";
import { CategoryService } from "../services/categoryService.js";

export const createCategory = async (req, res, next) => {
  const validatedData = createCategorySchema.safeParse(req.body);
  if (!validatedData.success) {
    const errorMessage = validatedData.error.issues
      .map((err) => err.message)
      .join(", ");
    return res.status(400).json({
      success: false,
      message: errorMessage,
    });
  }
  try {
    const cleanCategoryData = new CreateCategoryDTO(validatedData.data);
    const newCategory = await CategoryService.create(cleanCategoryData);
    return res.status(201).json({
      success: true,
      message: newCategory,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
