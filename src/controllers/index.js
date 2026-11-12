/**
 * Controller for the home page.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
export const homePage = (req, res) => {
  const title = "Home";
  res.render("home", { title });
};
