import {
  createOrganization,
  getAllOrganizations,
  getOrganizationDetails,
} from "../models/organizations.js";
import { getProjectsByOrganizationId } from "../models/projects.js";
import { body, validationResult } from "express-validator";

// Define validation and sanitization rules for organization form
// Define validation rules for organization form
export const organizationValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Organization name is required")
    .isLength({ min: 3, max: 150 })
    .withMessage("Organization name must be between 3 and 150 characters"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Organization description is required")
    .isLength({ max: 500 })
    .withMessage("Organization description cannot exceed 500 characters"),
  body("contactEmail")
    .normalizeEmail()
    .notEmpty()
    .withMessage("Contact email is required")
    .isEmail()
    .withMessage("Please provide a valid email address"),
];

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

/**
 * Controller function to handle the organization details page request.
 * Fetches the details of a specific organization and its associated projects from the database.
 * Renders the organization view with the fetched data.
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @param {Function} next - The Express next middleware function.
 */
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

/**
 * Controller function to handle the request for the new organization form.
 * Renders the new organization form view.
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 */
export const showNewOrganizationForm = async (req, res) => {
  const title = "Add New Organization";

  res.render("new-organization", { title });
};

/**
 * Controller function to process the new organization form.
 * Creates a new organization in the database.
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 */
export const processNewOrganizationForm = async (req, res) => {
  // Check for validation errors
  const results = validationResult(req);
  if (!results.isEmpty()) {
    // Validation failed - loop through errors
    results.array().forEach((error) => {
      req.flash("error", error.msg);
    });

    // Redirect back to the new organization form
    return res.redirect("/new-organization");
  }
  const { name, description, contactEmail } = req.body;
  const logoFilename = "placeholder-logo.png"; // Use the placeholder logo for all new organizations

  const organizationId = await createOrganization(
    name,
    description,
    contactEmail,
    logoFilename,
  );
  req.flash("success", "Organization added successfully!");

  res.redirect(`/organization/${organizationId}`);
};
