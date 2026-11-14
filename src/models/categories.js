import db from "./db.js";

const getAllCategories = async () => {
  const query = `
        SELECT category_id, name FROM public.category;
    `;

  const result = await db.query(query);

  return result.rows;
}; 

const getCategoryById = async (categoryId) => {
  const query = `
        SELECT category_id, name FROM public.category WHERE category_id = $1;
    `;
  const values = [categoryId];
  const result = await db.query(query, values);
  return result.rows[0];
};

const getCategoriesByProjectId = async (projectId) => {
  const query = `
        SELECT c.category_id, c.name
        FROM public.category c
        JOIN public.project_category pc ON c.category_id = pc.category_id
        WHERE pc.project_id = $1;
    `;
  const values = [projectId];
  const result = await db.query(query, values);
  return result.rows;
}

const getProjectsByCategoryId = async (categoryId) => {
  const query = `
        SELECT p.project_id, p.title, p.description, p.date
        FROM public.project p
        JOIN public.project_category pc ON p.project_id = pc.project_id
        WHERE pc.category_id = $1;
    `;
  const values = [categoryId];
  const result = await db.query(query, values);
  return result.rows;
}

export { getAllCategories, getCategoryById, getCategoriesByProjectId, getProjectsByCategoryId };
