'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
    async find(ctx) {
        const entities = await strapi.services.sfide.find(ctx.query)
        console.log(ctx.state.user)
        return entities.map(x => ({
            ...x,
            submissions: x.submissions.filter(y => y.user === ctx.state.user.id)
        }))
    },
    async findOne(ctx) {
        const entity = await strapi.services.sfide.findOne(ctx.query)
        return {
            ...entity,
            submissions: entity.submissions.filter(y => y.user === ctx.state.user.id)
        }
    }
};
