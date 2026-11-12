import { getAllCategories } from "../models/categories.js";

/**
 * Controller function to handle the categories page request.
 * Fetches all categories from the database and renders the categories view.
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 */
export const categoriesPage = async (req, res) => {
  const categories = await getAllCategories();
  const title = "Service Project Categories";
  res.render("categories", { title, categories });
};
