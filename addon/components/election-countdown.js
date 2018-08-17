import layout from '../templates/components/election-countdown';
import CountDown from 'nypr-countdown/components/count-down';

export default CountDown.extend({
  layout,
  classNames: ['election-countdown'],
  tagName: 'div',

  // put this in config/environment.js when import error gets resolved
  calendarLink: '/assets/midterms.ics',

  electionDayEveStart: '2018-11-05T05:00:00.000Z',
  electionDayStart: '2018-11-06T05:00:00.000Z',
  electionDayEnd: '2018-11-07T05:00:00.000Z',
});
