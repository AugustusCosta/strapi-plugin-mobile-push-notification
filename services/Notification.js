'use strict';

const moment = require( 'moment' );
const { Expo } = require( 'expo-server-sdk' );

/**
 * Read the documentation () to implement custom service functions
 */

module.exports = {
    sendNotification: async notification =>
    {
        let notificationTokens = [];

        if ( !notification.users || !notification.users.length )
        {
            notificationTokens = await strapi.plugins[ 'mobile-push-notification' ].services.notificationtoken.find();
        } else
        {
            notificationTokens = await strapi.plugins[ 'mobile-push-notification' ].services.notificationtoken.find( { user: { $in: notification.users.map( user => user.id ) } } );
        }

        if ( !notificationTokens || !notificationTokens.length ) return;

        await strapi.plugins[ 'mobile-push-notification' ].services.notification.expoPush( notification, notificationTokens );
        await strapi.plugins[ 'mobile-push-notification' ].services.notification.update( notification, { pending: false } );

    },
    sendPendingNotification: async () =>
    {
        let params = {
            pending: true,
            sendDate: { $lte: moment().toDate() },
        };

        const notifications = await strapi.plugins[ 'mobile-push-notification' ].services.notification.find( params );

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
};
