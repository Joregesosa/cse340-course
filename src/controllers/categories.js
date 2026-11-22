import {
  getAllCategories,
  getCategoriesByProjectId,
  getCategoryById,
  getProjectsByCategoryId,
  updateCategoryAssignments,
} from "../models/categories.js";
import { getProjectDetails } from "../models/projects.js";

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

/**
 * Controller function to show the form for assigning categories to a project.
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 */
export const showAssignCategoriesForm = async (req, res) => {
  const projectId = req.params.projectId;

  const projectDetails = await getProjectDetails(projectId);
  const categories = await getAllCategories();
  const assignedCategories = await getCategoriesByProjectId(projectId);

  const title = "Assign Categories to Project";

  res.render("assign-categories", {
    title,
    projectId,
    projectDetails,
    categories,
    assignedCategories,
  });
};

/**
 * Controller function to process the form for assigning categories to a project.
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 */
export const processAssignCategoriesForm = async (req, res) => {
  const projectId = req.params.projectId;
  const selectedCategoryIds = req.body.categoryIds || [];

  // Ensure selectedCategoryIds is an array
  const categoryIdsArray = Array.isArray(selectedCategoryIds)
    ? selectedCategoryIds
    : [selectedCategoryIds];
  await updateCategoryAssignments(projectId, categoryIdsArray);
  req.flash("success", "Categories updated successfully.");
  res.redirect(`/project/${projectId}`);
};
