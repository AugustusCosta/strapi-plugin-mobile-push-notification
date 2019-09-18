'use strict';


/**
 * Cron config that gives you an opportunity
 * to run scheduled jobs.
 *
 * The cron format consists of:
 * [MINUTE] [HOUR] [DAY OF MONTH] [MONTH OF YEAR] [DAY OF WEEK] [YEAR (optional)]
 */

module.exports = {
  /**
   * Simple example.
   * Every monday at 1am.
   */
  // '0 1 * * 1': () => {
  //
  // }

  /**
   * Every minute. 
   * 
   */
  // */1 * * * * Every minute. 
  // */5 * * * * * Every 5 seconds. 
  // */60 * * * * * Every 60 seconds. 
  '*/10 * * * * ': async () =>
  {
    strapi.log.info( "CRON " + new Date() );
    await strapi.plugins[ 'mobile-push-notification' ].services.notification.sendPendingNotification();
  }
};
