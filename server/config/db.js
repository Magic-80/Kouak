const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("kouak", "root", "123abc", {
  host: "localhost",
  dialect: "mysql",
  logging: false,
});

module.exports = sequelize;
