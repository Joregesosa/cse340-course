import express from "express";

import { homePage } from "./controllers/index.js";
import {
  organizationsPage,
  organizationDetailsPage,
  showNewOrganizationForm,
  processNewOrganizationForm,
  organizationValidation,
  showEditOrganizationForm,
  processEditOrganizationForm,
} from "./controllers/organizations.js";
import {
  processEditProjectForm,
  processNewProjectForm,
  projectDetailsPage,
  projectsPage,
  projectValidation,
  showEditProjectForm,
  showNewProjectForm,
} from "./controllers/projects.js";
import {
  categoriesPage,
  categoryDetailsPage,
  categoryValidation,
  processAssignCategoriesForm,
  processEditCategoryForm,
  processNewCategoryForm,
  showAssignCategoriesForm,
  showEditCategoryForm,
  showNewCategoryForm,
} from "./controllers/categories.js";
import { testErrorPage } from "./controllers/errors.js";

const router = express.Router();

router.get("/", homePage);

router.get("/organizations", organizationsPage);
router.get("/organization/:id", organizationDetailsPage);
router.get("/new-organization", showNewOrganizationForm);
router.post(
  "/new-organization",
  organizationValidation,
  processNewOrganizationForm,
);
router.get("/edit-organization/:id", showEditOrganizationForm);
router.post("/edit-organization/:id", organizationValidation, processEditOrganizationForm);

router.get("/projects", projectsPage);
router.get("/project/:id", projectDetailsPage);
router.get("/new-project", showNewProjectForm);
router.post("/new-project", projectValidation, processNewProjectForm);
router.get("/edit-project/:id", showEditProjectForm);
router.post("/edit-project/:id", projectValidation, processEditProjectForm);

router.get("/categories", categoriesPage);
router.get("/category/:id", categoryDetailsPage);
router.get("/assign-categories/:projectId", showAssignCategoriesForm);
router.post("/assign-categories/:projectId", processAssignCategoriesForm);
router.get("/edit-category/:id", showEditCategoryForm);
router.post("/edit-category/:id", categoryValidation, processEditCategoryForm);
router.get("/new-category", showNewCategoryForm);
router.post("/new-category", categoryValidation, processNewCategoryForm);

// error-handling routes
router.get("/test-error", testErrorPage);

export default router;
