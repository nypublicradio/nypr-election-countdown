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
});
