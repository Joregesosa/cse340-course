import { getCategoriesByProjectId } from "../models/categories.js";
import {
  getProjectDetails,
  getUpcomingProjects,
} from "../models/projects.js";

const NUMBER_OF_UPCOMING_PROJECTS = 5;
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
