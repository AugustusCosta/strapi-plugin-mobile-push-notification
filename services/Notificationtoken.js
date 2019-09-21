'use strict';

/**
 * Notificationtoken.js service
 *
 * @description: A set of functions similar to controller's actions to avoid code duplication.
 */

// Public dependencies.
const _ = require( 'lodash' );

module.exports = {

  /**
   * Promise to fetch all notificationtokens.
   *
   * @return {Promise}
   */

  fetchAll: ( params, populate ) =>
  {
    return strapi.query( 'notificationtoken', 'mobile-push-notification' ).find( params, populate );
  },

  /**
   * Promise to fetch a/an notificationtoken.
   *
   * @return {Promise}
   */

  fetch: ( params ) =>
  {
    // Select field to populate.
    return strapi.query( 'notificationtoken', 'mobile-push-notification' ).findOne( _.pick( params, [ '_id', 'id' ] ) );
  },

  /**
   * Promise to count notificationtokens.
   *
   * @return {Promise}
   */

  count: ( params ) =>
  {
    return strapi.query( 'notificationtoken', 'mobile-push-notification' ).find( params ).count();
  },

  /**
   * Promise to add a/an notificationtoken.
   *
   * @return {Promise}
   */

  add: async ( values ) =>
  {
    return strapi.query( 'notificationtoken', 'mobile-push-notification' ).create( values );
  },

  /**
   * Promise to edit a/an notificationtoken.
   *
   * @return {Promise}
   */

  edit: async ( params, values ) =>
  {
    return strapi.query( 'notificationtoken', 'mobile-push-notification' ).update( _.assign( params, values ) );
  },

  /**
   * Promise to remove a/an notificationtoken.
   *
   * @return {Promise}
   */

  remove: async params =>
  {
    return strapi.query( 'notificationtoken', 'mobile-push-notification' ).delete( params );
  },

  removeAll: async ( params, query ) =>
  {

    // TODO remove this logic when we develop plugins' dependencies
    const primaryKey = strapi.query( 'notificationtoken', 'mobile-push-notification' ).primaryKey;
    const toRemove = Object.keys( query ).reduce( ( acc, curr ) =>
    {
      if ( curr !== 'source' )
      {
        return acc.concat( [ query[ curr ] ] );
      }

      return acc;
    }, [] );

    return strapi.query( 'notificationtoken', 'mobile-push-notification' ).deleteMany( {
      [ primaryKey ]: toRemove,
    } );
  },

  /**
   * Promise to search a/an notificationtoken.
   *
   * @return {Promise}
   */

  search: async ( params ) =>
  {

    return strapi.query( 'notificationtoken', 'mobile-push-notification' ).find( params );

  }
};
