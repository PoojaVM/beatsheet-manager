"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("beats", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      duration: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      position: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      camera_angle: {
        type: Sequelize.STRING,
      },
      act_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "acts",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      completed_at: {
        type: Sequelize.DATE,
        defaultValue: null,
      },
    });
    // await queryInterface.addConstraint("beats", {
    //   fields: ["act_id", "position"],
    //   type: "unique",
    //   name: "unique_position_per_act",
    // });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("beats");
  },
};
