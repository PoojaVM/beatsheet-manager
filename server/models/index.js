// models/index.js
import { Sequelize } from "sequelize";
import config from "../config/config.js";

import Beat from "./beat.js";
import BeatSheet from "./beatSheet.js";
import Act from "./act.js";

// const config = configurations[process.env.NODE_ENV || "development"];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

BeatSheet.initModel(sequelize);
Act.initModel(sequelize);
Beat.initModel(sequelize);

BeatSheet.associate({ Act });
Act.associate({ BeatSheet, Beat });
Beat.associate({ Act });

export default sequelize;

export { BeatSheet, Act, Beat, sequelize };
