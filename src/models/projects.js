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

export { getAllProjects, getProjectsByOrganizationId, getUpcomingProjects, getProjectDetails };
