import { CreateProductDTO, createProductSchema } from "../dtos/ProductDTO.js";
import { Product } from "../models/productModel.js";
import { MediaService } from "../services/mediaService.js";

export const createProduct = async (req, res) => {
  try {
    const hostUrl = `${req.protocol}://${req.get("host")}`;
    const extractedImages = MediaService.processProductImages(
      req.files || {},
      hostUrl,
    );
    const rawPayload = {
      ...req.body,
      images: extractedImages,
    };
    const validation = createProductSchema.safeParse(rawPayload);
    if (!validation.success) {
      const errorMessage = validation.error.issues
        .map((err) => {
          const fieldName = err.path.join(".");
          return `${fieldName ? fieldName + ": " : ""}${err.message}`;
        })
        .join(", ");
      return res.status(400).json({
        success: false,
        message: errorMessage,
      });
    }
    // console.log(validation);
    const cleanProductData = new CreateProductDTO(validation.data);
    const newProduct = await Product.create(cleanProductData);
    return res.status(201).json({
      success: true,
      message: "Product created successfully!",
      data: newProduct,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
