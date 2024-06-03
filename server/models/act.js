// models/act.js
import { Model, DataTypes } from "sequelize";

export default class Act extends Model {
  static initModel(sequelize) {
    Act.init(
      {
        title: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        description: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        beat_sheet_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "beat_sheets",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
        },
        position: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        completed_at: {
          type: DataTypes.DATE,
          defaultValue: null,
        },
      },
      {
        sequelize,
        tableName: "acts",
        modelName: "Act",
        underscored: true,
      }
    );
  }

  static associate(models) {
    Act.belongsTo(models.BeatSheet, {
      foreignKey: "beatSheetId",
      as: "beatSheet",
    });
    Act.hasMany(models.Beat, { as: "beats" });
  }
}
