'use strict';

module.exports = function(environment) {
  let ENV = {
    modulePrefix: 'dummy',
    environment,
    rootURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },
    publisherAPI: 'https://api.demo.nypr.digital/api',
    platformEventsAPI: 'https://api.demo.nypr.digital/analytics',
    webRoot: 'https://wnyc.demo2.wnyc.net',
    adminRoot: 'https://internal.demo2.wnyc.net',
    optInAPI: 'https://lambda-gateway.demo.nypr.digital/opt-in/v1/subscribe',
    mailchimpList: process.env.MAILCHIMP_LIST,
    mobileCommonsOptInKey: process.env.MOBILE_COMMONS_OPT_IN,
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
    ENV['ember-cli-mirage'] = {enabled: false};
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;
  }

  if (environment === 'production') {
    ENV.rootURL = '/nypr-election-countdown';
    ENV.locationType = 'hash';
  }

  return ENV;
};
