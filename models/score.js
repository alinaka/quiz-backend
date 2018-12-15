'use strict';
module.exports = (sequelize, DataTypes) => {
  const Score = sequelize.define('Score', {
    count: DataTypes.SMALLINT,
    time: DataTypes.TIME
  }, {});
  Score.associate = function(models) {
    // associations can be defined here
  };
  return Score;
};