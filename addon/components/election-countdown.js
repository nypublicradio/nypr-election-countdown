import layout from '../templates/components/election-countdown';
import CountDown from 'nypr-countdown/components/count-down';

export default CountDown.extend({
  layout,
  classNames: ['election-countdown'],
  tagName: 'div',

  // put this in config/environment.js when import error gets resolved
  calendarLink: '/assets/midterms.ics',

  diffUntilPrimary() {
    this.set('to', this.primaryDayStart);
    return this.diff();
  },

  electionDayEveStart: '2018-11-05T00:00:00.000-05:00',
  electionDayStart: '2018-11-06T00:00:00.000-05:00',
  electionDayEnd: '2018-11-07T00:00:00.000-05:00',

  primaryDayEveStart: '2018-09-12T00:00:00.000-05:00',
  primaryDayStart: '2018-09-13T00:00:00.000-05:00',
  primaryDayEnd: '2018-09-14T00:00:00.000-05:00'
});
