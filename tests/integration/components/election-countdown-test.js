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
    await render(hbs`
      {{election-countdown
        from=from
        to=to
        unit='days'
        electionDayStart=ONE_YEAR_FROM_NOW
      }}
    `);
    assert.dom('.election-countdown').hasText('365 Days until Midterms + Add to Cal + Get Updates');

    this.set('to', NOW.clone().add(1, 'days'));
    await render(hbs`
      {{election-countdown
        from=from
        to=to
        unit='days'
        electionDayEveStart=NOW.clone().subtract(1, 'days')
        electionDayStart=to
      }}
    `);
    assert.dom('.election-countdown').hasText('1 Day until Midterms + Add to Cal + Get Updates');

    this.set('to', NOW.clone().subtract(1, 'hours'));
    await render(hbs`
      {{election-countdown
        from=from
        to=to
        unit='days'
        electionDayStart=NOW.clone().subtract(1, 'days')
        electionDayEnd=NOW.clone().add(2, 'days')
      }}
    `);
    assert.dom('.election-countdown').hasText('Election Day is Today! + Share Voting Issues + Find Polling Place');

    this.set('to', NOW.clone().subtract(5, 'days'));
    await render(hbs`
      {{election-countdown
        from=from
        to=to
        unit='days'
        electionDayEnd=to
      }}
    `);
    assert.dom('.election-countdown').hasText('Ready for the Next Election? + Share Your Experience + Look Up Results');

  });
});
