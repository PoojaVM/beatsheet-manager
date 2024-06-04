// models/beat-sheet.js
import { Model, DataTypes } from "sequelize";

export default class BeatSheet extends Model {
  static initModel(sequelize) {
    BeatSheet.init(
      {
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        title: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        description: {
          type: DataTypes.STRING,
        },
        completed_at: {
          type: DataTypes.DATE,
          defaultValue: null,
        },
        created_by: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        updated_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
      },
      {
        sequelize,
        tableName: "beat_sheets",
        modelName: "BeatSheet",
        underscored: true,
      }
    );
  }

  static associate(models) {
    BeatSheet.hasMany(models.Act, { as: "acts" });
  }
}
