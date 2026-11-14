import { getAllCategories, getCategoryById, getProjectsByCategoryId } from "../models/categories.js";

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

/**
 * Controller function to handle the category details page request.
 * Fetches category details and its associated projects from the database
 * and renders the category details view.
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 */
export const categoryDetailsPage = async (req, res, next) => {
  const categoryId = req.params.id;
  const category = await getCategoryById(categoryId);

  if (!category) {
    const err = new Error("Category not found");
    err.status = 404;
    return next(err);
  }

  const projects = await getProjectsByCategoryId(categoryId);
  const title = `Category: ${category.name}`;
  res.render("category", { title, category, projects });
};

