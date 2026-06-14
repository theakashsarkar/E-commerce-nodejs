import slugify from "slugify";

export const generateSlug = (text) => {
  if (!text) return "";
  return slugify(text, {
    lower: true,
    strict: true,
    trim: true,
    remove: /[*+~.()'"!:@]/g,
  });
};
