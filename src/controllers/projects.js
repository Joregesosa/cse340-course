import { getCategoriesByProjectId } from "../models/categories.js";
import { getAllOrganizations } from "../models/organizations.js";
import { body, validationResult } from "express-validator";
import {
  createProject,
  getProjectDetails,
  getUpcomingProjects,
  updateProject,
} from "../models/projects.js";

const NUMBER_OF_UPCOMING_PROJECTS = 5;
export const projectValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3, max: 200 })
    .withMessage("Title must be between 3 and 200 characters"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ max: 1000 })
    .withMessage("Description must be less than 1000 characters"),
  body("location")
    .trim()
    .notEmpty()
    .withMessage("Location is required")
    .isLength({ max: 200 })
    .withMessage("Location must be less than 200 characters"),
  body("date")
    .notEmpty()
    .withMessage("Date is required")
    .isISO8601()
    .withMessage("Date must be a valid date format"),
  body("organizationId")
    .notEmpty()
    .withMessage("Organization is required")
    .isInt()
    .withMessage("Organization must be a valid integer"),
];

/**
 * Controller function to handle the projects page request.
 * Fetches all projects from the database and renders the projects view.
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 */
export const projectsPage = async (req, res) => {
  const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
  const title = "Upcoming Service Projects";
  res.render("projects", { title, projects });
};

/**
 * Controller function to handle the project details page request.
 * Fetches project details from the database based on the provided project ID
 * and renders the project details view.
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The next middleware function in the Express stack.
 */
export const projectDetailsPage = async (req, res, next) => {
  const projectId = req.params.id;
  const project = await getProjectDetails(projectId);

  if (!project) {
    const err = new Error("Project not found");
    err.status = 404;
    return next(err);
  }

  const categories = await getCategoriesByProjectId(projectId);
  const title = project.title;
  res.render("project", { title, project, categories });
};

/**
 * Controller function to handle the new project form page request.
 * Fetches all organizations from the database and renders the new project form view.
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 */
export const showNewProjectForm = async (req, res) => {
  const organizations = await getAllOrganizations();
  const title = "Add New Service Project";

  res.render("new-project", { title, organizations });
};

/**
 * Controller function to process the new project form submission.
 * Extracts form data from the request body and creates a new project in the database.
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 */
export const processNewProjectForm = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    errors.array().forEach((error) => {
      req.flash("error", error.msg);
    });
    return res.redirect("/new-project");
  }
  const { title, description, location, date, organizationId } = req.body;

  try {
    const newProjectId = await createProject(
      title,
      description,
      location,
      date,
      organizationId,
    );

    req.flash("success", "New service project created successfully!");
    res.redirect(`/project/${newProjectId}`);
  } catch (error) {
    console.error("Error creating new project:", error);
    req.flash("error", "There was an error creating the service project.");
    res.redirect("/new-project");
  }
};

/**
 * Controller function to display the Edit Service Project form.
 * Fetches the project details and all organizations from the database and renders the edit project form view.
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The next middleware function in the Express stack.
 */
export const showEditProjectForm = async (req, res) => {
  const projectId = req.params.id;
  const project = await getProjectDetails(projectId);
  const organizations = await getAllOrganizations();

  if (!project) {
    const err = new Error("Project not found");
    err.status = 404;
    return next(err);
  }

  const title = "Edit Service Project";
  res.render("edit-project", { title, project, organizations });
};

export const processEditProjectForm = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    errors.array().forEach((error) => {
      req.flash("error", error.msg);
    });
    return res.redirect(`/edit-project/${req.params.id}`);
  }

  const { title, description, location, date, organizationId } = req.body;
  const projectId = req.params.id;

  try {
    const updatedProjectId = await updateProject(
      projectId,
      title,
      description,
      location,
      date,
      organizationId,
    );

    req.flash("success", "Service project updated successfully!");
    res.redirect(`/project/${updatedProjectId}`);
  } catch (error) {
    console.error("Error updating project:", error);
    req.flash("error", "There was an error updating the service project.");
    res.redirect(`/edit-project/${req.params.id}`);
  }
};
