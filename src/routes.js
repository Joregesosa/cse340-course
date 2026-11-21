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
import { processNewProjectForm, projectDetailsPage, projectsPage, projectValidation, showNewProjectForm } from "./controllers/projects.js";
import {
  categoriesPage,
  categoryDetailsPage,
} from "./controllers/categories.js";
import { testErrorPage } from "./controllers/errors.js";

const router = express.Router();

router.get("/", homePage);

router.get("/organizations", organizationsPage);
router.get("/organization/:id", organizationDetailsPage);
router.get("/new-organization", showNewOrganizationForm);
router.post("/new-organization", organizationValidation, processNewOrganizationForm);
router.get("/edit-organization/:id", showEditOrganizationForm);
router.post("/edit-organization/:id", processEditOrganizationForm);

router.get("/projects", projectsPage);
router.get("/project/:id", projectDetailsPage); 
router.get('/new-project', showNewProjectForm); 
router.post('/new-project', projectValidation, processNewProjectForm);

router.get("/categories", categoriesPage);
router.get("/category/:id", categoryDetailsPage);

// error-handling routes
router.get("/test-error", testErrorPage);

export default router;
