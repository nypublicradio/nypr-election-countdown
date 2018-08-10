import layout from '../templates/components/election-countdown';
import CountDown from 'nypr-countdown/components/count-down';

export default CountDown.extend({
  layout,
  classNames: ['election-countdown'],
  tagName: 'div',

  electionDayEveStart: '2018-11-05T05:00:00.000Z',
  electionDayStart: '2018-11-06T05:00:00.000Z',
  electionDayEnd: '2018-11-06T05:00:00.000Z',
});
