import express from "express";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config({ path: '.env' });

import sequelize from "./models/index.js";
import configureRoutes from "./routes/index.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

async function assertDatabaseConnection() {
  console.log(`Checking database connection...`);
  try {
    await sequelize.authenticate();
    console.log("Database connection OK!");
    await sequelize.sync();
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    process.exit(1);
  }
}

async function init() {
  await assertDatabaseConnection();

  configureRoutes(app);

  app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(err?.status || 500).json({
      message: err?.message || "Internal Server Error",
      code: err?.code,
    });
  });

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

init();
