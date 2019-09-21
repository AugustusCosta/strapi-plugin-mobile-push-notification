'use strict';

/**
 * Notification.js controller
 *
 * @description: A set of functions called "actions" for managing `Notification`.
 */

module.exports = {

  /**
   * Retrieve notification records.
   *
   * @return {Object|Array}
   */

  find: async (ctx, next, { populate } = {}) => {
    if (ctx.query._q) {
      return strapi.plugins[ 'mobile-push-notification' ].services.notification.search(ctx.query);
    } else {
      return strapi.plugins[ 'mobile-push-notification' ].services.notification.fetchAll(ctx.query, populate);
    }
  },

  /**
   * Retrieve a notification record.
   *
   * @return {Object}
   */

  findOne: async (ctx) => {
    if (!ctx.params._id.match(/^[0-9a-fA-F]{24}$/)) {
      return ctx.notFound();
    }

    return strapi.plugins[ 'mobile-push-notification' ].services.notification.fetch(ctx.params);
  },

  /**
   * Count notification records.
   *
   * @return {Number}
   */

  count: async (ctx) => {
    return strapi.plugins[ 'mobile-push-notification' ].services.notification.count(ctx.query);
  },

  /**
   * Create a/an notification record.
   *
   * @return {Object}
   */

  create: async (ctx) => {
    return strapi.plugins[ 'mobile-push-notification' ].services.notification.add(ctx.request.body);
  },

  /**
   * Update a/an notification record.
   *
   * @return {Object}
   */

  update: async (ctx, next) => {
    return strapi.plugins[ 'mobile-push-notification' ].services.notification.edit(ctx.params, ctx.request.body) ;
  },

  /**
   * Destroy a/an notification record.
   *
   * @return {Object}
   */

  destroy: async (ctx, next) => {
    return strapi.plugins[ 'mobile-push-notification' ].services.notification.remove(ctx.params);
  }
};
