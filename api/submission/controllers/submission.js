'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

 const {parseMultipartData, sanitizeEntity} = require('strapi-utils')

module.exports = {
    async create(ctx) {
      let entity;
      if (ctx.is('multipart')) {
          throw Error('not implemented')
      } else {
        if(!ctx.request.body.challenge || ctx.request.body.id)
            throw Error('Bad request')
        const challenge = await strapi.services.sfide.findOne({id: ctx.request.body.challenge})
        console.log(challenge)
        const getScore = () => {
          try {
          if(challenge.type === 'risposta_libera' && challenge.correct.trim().toLowerCase() === ctx.request.body.answer.trim().toLowerCase())
            return 10
          if(challenge.type === 'scelta_multipla' && challenge.correct.trim().toLowerCase() === ctx.request.body.answer.trim().toLowerCase())
            return challenge.answers.split('\n').length
          return null
          } catch(e) {
            return null 
          }
        }
        console.log(getScore())
        entity = await strapi.services.submission.create({...ctx.request.body, score: getScore(), user: ctx.state.user.id});
        await (await strapi.query('Sfide').model.query(x => x.where('id', ctx.request.body.challenge)).fetch()).relations.submissions.attach([entity.id])
      }
      return sanitizeEntity({...entity, challenge: ctx.request.body.id}, { model: strapi.models.submission });
    }
};
