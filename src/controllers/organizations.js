import { getAllOrganizations } from "../models/organizations.js";

/**
 * Controller function to handle the organizations page request.
 * Fetches all organizations from the database and renders the organizations view.
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 */
export const organizationsPage = async (req, res) => {
  const organizations = await getAllOrganizations();
  const title = "Our Partner Organizations";

  res.render("organizations", { title, organizations });
};
