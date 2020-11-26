const { Sequelize, Model, DataTypes } = require("sequelize");
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "../db.sqlite3",
});

class Leader extends Model {}
Leader.init(
  {
    name: DataTypes.STRING(100),
    score: DataTypes.INTEGER,
  },
  {
    sequelize,
    // match the table name used by Django
    modelName: "octotramp_leader",
    // prevent the table name from being automatically pluralized
    freezeTableName: true,
    // disable the createdAt and updatedAt fields created by Sequelize
    timestamps: false,
  }
);

module.exports = {
  ready: sequelize.sync(),
  recordScore: (name, score) =>
    Leader.create({
      name,
      score,
    }),
  listScores: () => Leader.findAll({ limit: 20, order: [["score", "DESC"]] }),
};
