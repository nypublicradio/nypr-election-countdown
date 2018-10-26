import layout from '../templates/components/election-countdown';
import CountDown from 'nypr-countdown/components/count-down';

export default CountDown.extend({
  layout,
  classNames: ['election-countdown'],
  tagName: 'div',

  // put this in config/environment.js when import error gets resolved
  calendarLink: '/assets/midterms.ics',

  electionDayEveStart: '2018-11-05T00:00:00.000-05:00',
  electionDayStart: '2018-11-06T00:00:00.000-05:00',
  electionDayPollsClose: '2018-11-06T00:21:00.000-05:00',
  electionDayEnd: '2018-11-07T00:00:00.000-05:00'
});
