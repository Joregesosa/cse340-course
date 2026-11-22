import {
  createCategory,
  getAllCategories,
  getCategoriesByProjectId,
  getCategoryById,
  getProjectsByCategoryId,
  updateCategory,
  updateCategoryAssignments,
} from "../models/categories.js";
import { getProjectDetails } from "../models/projects.js";
import { validationResult, body } from "express-validator";

export const categoryValidation = [
  body("name")
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("Category name must be between 3 and 100 characters.")
    .matches(/^[a-zA-Z0-9\s]+$/)
    .withMessage("Category name can only contain letters, numbers, and spaces."),
];

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

/**
 * Controller function to show the form for creating a new category.
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 */
export const showNewCategoryForm = async (req, res) => {
  const title = "Add New Category";
  res.render("new-category", { title });
};

/**
 * Controller function to process the form for creating a new category.
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 */
export const processNewCategoryForm = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    errors.array().forEach((error) => {
      req.flash("error", error.msg);
    });
    return res.redirect("/new-category");
  }

  const { name } = req.body;
  await createCategory(name);
  req.flash("success", "Category created successfully.");
  res.redirect("/new-category");
};

/**
 * Controller function to show the form for editing a category.
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The next middleware function in the Express stack.
 */
export const showEditCategoryForm = async (req, res, next) => {
  const categoryId = req.params.id;
  const category = await getCategoryById(categoryId);
  if (!category) {
    const err = new Error("Category not found");
    err.status = 404;
    return next(err);
  }
  const title = `Edit Category: ${category.name}`;
  res.render("edit-category", { title, category });
};

/**
 * Controller function to process the form for editing a category.
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 */
export const processEditCategoryForm = async (req, res) => {
  const errors = validationResult(req);
  const categoryId = req.params.id;
  const { name } = req.body;

  if (!errors.isEmpty()) {
    errors.array().forEach((error) => {
      req.flash("error", error.msg);
    });
    return res.redirect(`/edit-category/${categoryId}`);
  }

  await updateCategory(categoryId, name);
  req.flash("success", "Category updated successfully.");
  res.redirect(`/category/${categoryId}`);
};
