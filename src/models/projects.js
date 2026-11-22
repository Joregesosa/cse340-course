import db from "./db.js";

const getAllProjects = async () => {
  const query = `
        SELECT project_id, title, description FROM public.project;
    `;

  const result = await db.query(query);

  return result.rows;
};

const getProjectsByOrganizationId = async (organizationId) => {
  const query = `
        SELECT
          project_id,
          organization_id,
          title,
          description,
          location,
          date
        FROM project
        WHERE organization_id = $1
        ORDER BY date;
      `;

  const queryParams = [organizationId];
  const result = await db.query(query, queryParams);

  return result.rows;
};

const getUpcomingProjects = async (number_of_projects) => {
  const query = `
    SELECT p.project_id, p.organization_id, p.title, p.description, p.location, p.date, o.name
    FROM  public.project p
    JOIN public.organization o  
    ON o.organization_id = p.organization_id
    WHERE p.date >= Now()
    ORDER BY p.date ASC
    LIMIT $1;
  `;

  const queryParams = [number_of_projects];
  const result = await db.query(query, queryParams);

  return result.rows;
};

const getProjectDetails = async (projectId) => {
  const query = `
    SELECT p.project_id, p.organization_id, p.title, p.description, p.location, p.date, o.name
    FROM  public.project p
    JOIN public.organization o  
    ON o.organization_id = p.organization_id
    WHERE p.project_id = $1
  `;

  const queryParams = [projectId];
  const result = await db.query(query, queryParams);

  return result.rows[0];
};

const createProject = async (
  title,
  description,
  location,
  date,
  organizationId,
) => {
  const query = `
      INSERT INTO project (title, description, location, date, organization_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING project_id;
    `;

  const queryParams = [title, description, location, date, organizationId];
  const result = await db.query(query, queryParams);

  if (result.rows.length === 0) {
    throw new Error("Failed to create project");
  }

  if (process.env.ENABLE_SQL_LOGGING === "true") {
    console.log("Created new project with ID:", result.rows[0].project_id);
  }

  return result.rows[0].project_id;
};

const updateProject = async (
  projectId,
  title,
  description,
  location,
  date,
  organizationId,
) => {
  const query = `
    UPDATE project
    SET title = $2, description = $3, location = $4, date = $5, organization_id = $6
    WHERE project_id = $1
    RETURNING project_id;
  `;

  const queryParams = [
    projectId,
    title,
    description,
    location,
    date,
    organizationId,
  ];
  const result = await db.query(query, queryParams);

  if (result.rows.length === 0) {
    throw new Error("Failed to update project");
  }

  if (process.env.ENABLE_SQL_LOGGING === "true") {
    console.log("Updated project with ID:", result.rows[0].project_id);
  }

  return result.rows[0].project_id;
};

export {
  getAllProjects,
  getProjectsByOrganizationId,
  getUpcomingProjects,
  getProjectDetails,
  createProject,
  updateProject,
};
