'use strict';

const moment = require( 'moment' );
const { Expo } = require( 'expo-server-sdk' );

const _ = require( 'lodash' );

/**
 * Read the documentation () to implement custom service functions
 */

// const Notification = strapi.plugins[ 'mobile-push-notification' ].models.notification;

module.exports = {
  sendNotification: async notification =>
  {
    let notificationTokens = [];

    if ( !notification.users || !notification.users.length )
    {
      notificationTokens = await strapi.plugins[ 'mobile-push-notification' ].models.notificationtoken.find();
    } else
    {
      notificationTokens = await strapi.plugins[ 'mobile-push-notification' ].models.notificationtoken.find( { user: { $in: notification.users.map( user => user.id ) } } );
    }

    if ( !notificationTokens || !notificationTokens.length ) return;

    await strapi.plugins[ 'mobile-push-notification' ].services.notification.expoPush( notification, notificationTokens );
    await strapi.plugins[ 'mobile-push-notification' ].models.notification.update( notification, { pending: false } );

  },
  sendPendingNotification: async () =>
  {
    let params = {
      pending: true,
      sendDate: { $lte: moment().toDate() },
    };

    const notifications = await strapi.plugins[ 'mobile-push-notification' ].models.notification.find( params );

    if ( !notifications || !notifications.length ) return;

    for ( let index = 0; index < notifications.length; index++ )
    {
      const notification = notifications[ index ];
      await strapi.plugins[ 'mobile-push-notification' ].services.notification.sendNotification( notification );
    }

  },

  expoPush: async ( notification, notificationTokens ) =>
  {
    let expo = new Expo();
    let messages = [];

    for ( let pushToken of notificationTokens )
    {
      // Each push token looks like ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]

      // Check that all your push tokens appear to be valid Expo push tokens
      if ( !Expo.isExpoPushToken( pushToken.token ) )
      {
        console.error( `Push token ${ pushToken.token } is not a valid Expo push token` );
        continue;
      }

      // Construct a message (see https://docs.expo.io/versions/latest/guides/push-notifications.html)
      messages.push( {
        to: pushToken.token,
        title: notification.title,
        subtitle: notification.subtitle,
        body: notification.body,
        priority: notification.priority,
        data: notification.data ? notification.data : {},
      } );
    }

    let chunks = expo.chunkPushNotifications( messages );
    for ( let index = 0; index < chunks.length; index++ )
    {
      const chunk = chunks[ index ];
      try
      {
        await expo.sendPushNotificationsAsync( chunk );
        // NOTE: If a ticket contains an error code in ticket.details.error, you
        // must handle it appropriately. The error codes are listed in the Expo
        // documentation:
        // https://docs.expo.io/versions/latest/guides/push-notifications#response-format
      } catch ( error )
      {
        console.error( error );
      }
    }



  },

  /**
 * Promise to fetch all notifications.
 *
 * @return {Promise}
 */

  fetchAll: ( params, populate ) =>
  {
    return strapi.query( 'notification', 'mobile-push-notification' ).find( params, populate );
  },

  /**
   * Promise to fetch a/an notification.
   *
   * @return {Promise}
   */

  fetch: ( params ) =>
  {
    return strapi.query( 'notification', 'mobile-push-notification' ).findOne( _.pick( params, [ '_id', 'id' ] ) );
  },

  /**
   * Promise to count notifications.
   *
   * @return {Promise}
   */

  count: ( params ) =>
  {
    return strapi.query( 'notificationto', 'mobile-push-notification' ).find( params ).count();
  },

  /**
   * Promise to add a/an notification.
   *
   * @return {Promise}
   */

  add: async ( values ) =>
  {
    // Extract values related to relational data.
    return strapi.query( 'notification', 'mobile-push-notification' ).create( values );
  },

  /**
   * Promise to edit a/an notification.
   *
   * @return {Promise}
   */

  edit: async ( params, values ) =>
  {
    return strapi.query( 'notification', 'mobile-push-notification' ).update( _.assign( params, values ) );
  },

  /**
   * Promise to remove a/an notification.
   *
   * @return {Promise}
   */

  remove: async params =>
  {
    return strapi.query( 'notification', 'mobile-push-notification' ).delete( params );
  },

  removeAll: async ( params, query ) =>
  {

    // TODO remove this logic when we develop plugins' dependencies
    const primaryKey = strapi.query( 'notification', 'mobile-push-notification' ).primaryKey;
    const toRemove = Object.keys( query ).reduce( ( acc, curr ) =>
    {
      if ( curr !== 'source' )
      {
        return acc.concat( [ query[ curr ] ] );
      }

      return acc;
    }, [] );

    return strapi.query( 'notification', 'mobile-push-notification' ).deleteMany( {
      [ primaryKey ]: toRemove,
    } );
  },

  /**
   * Promise to search a/an notification.
   *
   * @return {Promise}
   */

  search: async ( params ) =>
  {
    return strapi.query( 'notification', 'mobile-push-notification' ).find( params );
  }
};
