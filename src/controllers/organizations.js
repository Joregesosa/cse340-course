import { getAllOrganizations, getOrganizationDetails } from "../models/organizations.js";
import { getProjectsByOrganizationId } from "../models/projects.js";

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


export const organizationDetailsPage = async (req, res, next) => {
  const organizationId = req.params.id;
  const organizationDetails = await getOrganizationDetails(organizationId);

  if (!organizationDetails) {
    const err = new Error("Organization not found");
    err.status = 404;
    return next(err);
  }

  const projects = await getProjectsByOrganizationId(organizationId);
  const title = "Organization Details";

  res.render("organization", { title, organizationDetails, projects });
};