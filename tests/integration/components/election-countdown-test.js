import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

import moment from 'moment';

const TIMEZONE = 'America/New_York';

module('Integration | Component | election-countdown', function(hooks) {
  setupRenderingTest(hooks);

  test('usage', async function(assert) {
    const NOW = moment().tz(TIMEZONE); // today
    const ONE_YEAR_FROM_NOW = NOW.clone().add(1, 'year');

    this.set('from', NOW);
    this.set('to', ONE_YEAR_FROM_NOW);

    await render(hbs`{{election-countdown from=from to=to unit='days'}}`);
    assert.dom('.election-countdown').hasText('365 Days until Midterms + Add to Cal + Get Updates');

    this.set('to', NOW.clone().add(1, 'days'));
    this.set('electionDayEveStart', ONE_YEAR_FROM_NOW);
    await render(hbs`{{election-countdown from=from to=to unit='days'}}`);
    assert.dom('.election-countdown').hasText('1 Days until Midterms + Add to Cal + Get Updates');

    this.set('to', NOW.clone());
    await render(hbs`{{election-countdown from=from to=to unit='days'}}`);
    assert.dom('.election-countdown').hasText('0 Days until Midterms + Add to Cal + Get Updates');

  });
});
