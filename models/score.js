'use strict';
module.exports = (sequelize, DataTypes) => {
  const Score = sequelize.define('Score', {
    count: DataTypes.SMALLINT,
    time: DataTypes.TIME
  }, {});
  Score.associate = function(models) {
    models.Score.belongsTo(models.User, {
          onDelete: "CASCADE",
          foreignKey: {
              allowNull: false
          }
      });
  };
  return Score;
};