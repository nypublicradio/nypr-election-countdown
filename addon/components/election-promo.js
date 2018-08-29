import Component from '@ember/component';
import layout from '../templates/components/election-promo';
import { inject as service } from '@ember/service';

export default Component.extend({
  layout,
  chunkContent: null,
  chunkSlug: 'election-promo',
  classNames: ['election-promo'],

  init() {
    this._super(...arguments);
    this.get('store').findRecord('chunk', this.chunkSlug).then((chunkContent) => {
      this.set('chunkContent', chunkContent.get('content'));
    })
  },

  store: service(),

  countdownTo: '2018-11-06T00:00:00.000-05:00',
  actions: {
    closeModule() {
      document.querySelector('.election-promo').remove();
    }
  }
});
