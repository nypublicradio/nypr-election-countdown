'use strict';

module.exports = {
  name: 'nypr-election-countdown',
  included: function(/* app */) {
    this._super.included.apply(this, arguments);
  },

  isDevelopingAddon: () => true
};
