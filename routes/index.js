
import exphbs from 'express-handlebars';
import userRoutes from "./users.js";
import institutionRoutes from "./institutions.js";
import petRoutes from "./pets.js";


const constructorMethod = (app) => {
  app.use("/register", userRoutes);
  app.use("/institution_register", institutionRoutes);
  app.use("/pets", petRoutes);



  app.use("*", (req, res) => {
    res.status(404).json({ error: "Not found" });
  });
};

export default constructorMethod;
