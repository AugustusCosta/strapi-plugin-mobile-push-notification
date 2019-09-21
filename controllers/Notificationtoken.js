'use strict';

/**
 * Notificationtoken.js controller
 *
 * @description: A set of functions called "actions" for managing `Notificationtoken`.
 */

module.exports = {

  /**
   * Retrieve notificationtoken records.
   *
   * @return {Object|Array}
   */

  find: async (ctx, next, { populate } = {}) => {
    if (ctx.query._q) {
      return strapi.plugins[ 'mobile-push-notification' ].services.notificationtoken.search(ctx.query);
    } else {
      return strapi.plugins[ 'mobile-push-notification' ].services.notificationtoken.fetchAll(ctx.query, populate);
    }
  },

  /**
   * Retrieve a notificationtoken record.
   *
   * @return {Object}
   */

  findOne: async (ctx) => {
    if (!ctx.params._id.match(/^[0-9a-fA-F]{24}$/)) {
      return ctx.notFound();
    }

    return strapi.plugins[ 'mobile-push-notification' ].services.notificationtoken.fetch(ctx.params);
  },

  /**
   * Count notificationtoken records.
   *
   * @return {Number}
   */

  count: async (ctx) => {
    return strapi.plugins[ 'mobile-push-notification' ].services.notificationtoken.count(ctx.query);
  },

  /**
   * Create a/an notificationtoken record.
   *
   * @return {Object}
   */

  create: async (ctx) => {
    return strapi.plugins[ 'mobile-push-notification' ].services.notificationtoken.add(ctx.request.body);
  },

  /**
   * Update a/an notificationtoken record.
   *
   * @return {Object}
   */

  update: async (ctx, next) => {
    return strapi.plugins[ 'mobile-push-notification' ].services.notificationtoken.edit(ctx.params, ctx.request.body) ;
  },

  /**
   * Destroy a/an notificationtoken record.
   *
   * @return {Object}
   */

  destroy: async (ctx, next) => {
    return strapi.plugins[ 'mobile-push-notification' ].services.notificationtoken.remove(ctx.params);
  }
};
