import layout from '../templates/components/election-countdown';
import CountDown from 'nypr-countdown/components/count-down';
import { inject } from "@ember/service";

export default CountDown.extend({
  layout,
  classNames: ['election-countdown'],
  chunkSlug: "election-hub-countdown-text",
  tagName: 'div',

  // put this in config/environment.js when import error gets resolved
  calendarLink: '/assets/midterms.ics',

  electionDayEveStart: '2018-11-05T00:00:00.000-05:00',
  electionDayStart: '2018-11-06T00:00:00.000-05:00',
  electionDayEnd: '2018-11-07T00:00:00.000-05:00',

  store: inject(),

  init() {
    this._super(...arguments);
    this.get('store')
      .findRecord("chunk", this.chunkSlug)
      .then(chunkContent => {
        this.set("chunkContent", chunkContent.get('content'));
      });
  }
});
