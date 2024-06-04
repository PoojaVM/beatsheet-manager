import beatSheetRoutes from "./beatSheetRoutes.js";
import actRoutes from "./actRoutes.js";
import beatRoutes from "./beatRoutes.js";
import validateToken from "../middlewares/validateToken.js";

const configureRoutes = (app) => {
  app.use("/api/beatSheets", validateToken, beatSheetRoutes);
  app.use("/api/beatSheets/:beatSheetId/acts", validateToken, actRoutes);
  app.use("/api/acts/:actId/beats", validateToken, beatRoutes);

  app.get("/", (_, res) => res.send("Hello from the server!"));

  app.use("*", (_req, _res, next) => {
    next({ status: 404, message: "Not Found" });
  });
};

export default configureRoutes;
