'use strict';
module.exports = (sequelize, DataTypes) => {
  const Frame = sequelize.define('Frame', {
    name: DataTypes.STRING
  }, {});
  Frame.associate = function(models) {
      models.Frame.belongsTo(models.Movie, {
          onDelete: "CASCADE",
          foreignKey: {
              allowNull: false
          }
      });
  };
  return Frame;
};