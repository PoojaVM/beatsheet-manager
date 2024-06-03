// models/beat.js
import { Model, DataTypes } from "sequelize";

export default class Beat extends Model {
  static initModel(sequelize) {
    Beat.init(
      {
        title: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        description: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        duration: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        position: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        camera_angle: {
          type: DataTypes.STRING,
        },
        act_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "acts",
            key: "id",
          },
          onUpdate: "CASCADE",
          onDelete: "SET NULL",
        },
        completed_at: {
          type: DataTypes.DATE,
          defaultValue: null,
        },
      },
      {
        sequelize,
        tableName: "beats",
        modelName: "Beat",
        underscored: true,
      }
    );
  }

  static associate(models) {
    Beat.belongsTo(models.Act, {
      foreignKey: "actId",
      as: "act",
    });
  }
}
