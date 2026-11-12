import { getAllProjects } from "../models/projects.js";

/**
 * Controller function to handle the projects page request.
 * Fetches all projects from the database and renders the projects view.
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 */
export const projectsPage = async (req, res) => {
  const projects = await getAllProjects();
  const title = "Service Projects";
  res.render("projects", { title, projects });
};
