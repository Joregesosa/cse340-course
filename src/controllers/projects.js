import {
  getAllProjects,
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


export const projectDetailsPage = async (req, res, next) => {
  const projectId = req.params.id;
  const project = await getProjectDetails(projectId);
  const title = project.title;
  res.render("project", { title, project });
};
