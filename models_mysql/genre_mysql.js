module.exports = (sequelize, Sequelize) => {
  sequelize.define(
    "genre",
    {
      name: {
        type: Sequelize.STRING,
      },
    },
    { timestamps: false }
  );

  // const Genre = sequelize.define(
  //   "genre",
  //   {
  //     name: {
  //       type: Sequelize.STRING,
  //     },
  //   },
  //   { timestamps: false }
  // );

  // return Genre;
};
