'use strict';
const { NB_LIKES, NB_USERS, NB_MIN_USERS } = require('../config/seederConfig');
const { getRandomInt, getRandomUniqInt } = require('../helpers/mathHelper');

module.exports = {
  up: async (queryInterface) => {
    const posts = await queryInterface.sequelize.query( `SELECT id from posts;` );

    const likes = [];
    const postLikes = {}

    posts[0].map( post => {
      postLikes[post.id] = { likes : 0, dislikes : 0};
      const userUsed = [];

      likes.push([...Array(getRandomInt(0, NB_LIKES))].map(() => {
        const like = getRandomInt(0, 100) % 2 === 0 ? 1 : -1;
        const userId = getRandomUniqInt(NB_USERS, NB_MIN_USERS, userUsed);

        userUsed.push(userId);
        if( like === 1) { postLikes[post.id].likes ++}
        if( like === -1) { postLikes[post.id].dislikes ++}

        return {
            like: like,
            UserId: userId,
            PostId: post.id
          }
      }));
    });

    for (const [post_id, postLike] of Object.entries(postLikes)) {
      await queryInterface.bulkUpdate("posts", postLike , { id : post_id });
    }

    await queryInterface.bulkInsert('likes', likes.flat(), {});
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('likes', null, {});
  }
};
