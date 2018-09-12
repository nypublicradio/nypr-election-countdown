import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

import moment from 'moment';

const TIMEZONE = 'America/New_York';

module('Integration | Component | election-countdown', function(hooks) {
  setupRenderingTest(hooks);

  test('usage', async function(assert) {
    const PRIMARY = moment.tz(this.get('primaryDayStart'), TIMEZONE);
    const GENERAL = moment.tz(this.get('electionDayStart'), TIMEZONE);

    // Sept primary election tests:
    const ONE_YEAR_BEFORE_PRIMARY = PRIMARY.clone().subtract(1, 'year').add(23, 'hours');
    this.set('to', PRIMARY);

    this.set('from', ONE_YEAR_BEFORE_PRIMARY);
    await render(hbs`
      {{election-countdown
        from=from
        to=to
        unit='days'
      }}
    `);
    assert.dom('.election-countdown').hasText('365 Days Until the NY State Primary Election + Get Updates');

    this.set('from', PRIMARY.clone().subtract(1, 'hours'));
    this.set('primaryDayEveStart', PRIMARY.clone().subtract(2, 'hours'));
    await render(hbs`
      {{election-countdown
        from=from
        to=to
        unit='days'
        primaryDayEveStart=primaryDayEveStart
      }}
    `);
    assert.dom('.election-countdown').hasText('1 Day Until the NY State Primary Election + Get Updates');

    this.set('from', PRIMARY.clone());
    this.set('primaryDayStart', PRIMARY.clone().subtract(2, 'days'));
    this.set('primaryDayEnd', PRIMARY.clone().add(2, 'days'));
    await render(hbs`
      {{election-countdown
        from=from
        to=to
        unit='days'
        primaryDayStart=primaryDayStart
        primaryDayEnd=primaryDayEnd
      }}
    `);
    assert.dom('.election-countdown').hasText('Today is NY State Primary Election Day + Get Updates');

    // Nov midterm election tests:
    //
    const ONE_YEAR_BEFORE_GENERAL = GENERAL.clone().subtract(1, 'year');
    this.set('to', GENERAL);
    this.set('primaryDayStart', GENERAL.clone().subtract(2, 'years')); // primaries are over
    this.set('primaryDayEnd', GENERAL.clone().subtract(2, 'years')); // primaries are over

    this.set('from', ONE_YEAR_BEFORE_GENERAL);
    await render(hbs`
      {{election-countdown
        from=from
        to=to
        unit='days'
        primaryDayStart=primaryDayStart
        primaryDayEnd=primaryDayEnd
      }}
    `);
    assert.dom('.election-countdown').hasText('365 Days Until Elections + Add to Cal + Get Updates');

    this.set('from', GENERAL.clone().subtract(1, 'days'));
    await render(hbs`
      {{election-countdown
        from=from
        to=to
        unit='days'
        primaryDayStart=primaryDayStart
        primaryDayEnd=primaryDayEnd
        electionDayEveStart=electionDayEveStart
      }}
    `);
    assert.dom('.election-countdown').hasText('1 Day Until Elections + Add to Cal + Get Updates');

    this.set('from', GENERAL.clone())
    this.set('electionDayStart', GENERAL.clone().subtract(1, 'days'))
    this.set('electionDayEnd', GENERAL.clone().add(1, 'days'))
    await render(hbs`
      {{election-countdown
        from=from
        to=to
        unit='days'
        primaryDayStart=primaryDayStart
        primaryDayEnd=primaryDayEnd
        electionDayStart=electionDayStart
        electionDayEnd=electionDayEnd
      }}
    `);
    assert.dom('.election-countdown').hasText('Election Day is Today! + Share Voting Issues + Find Polling Place');

    this.set('from', GENERAL.clone().subtract(5, 'days'));
    await render(hbs`
      {{election-countdown
        from=from
        to=to
        unit='days'
        primaryDayStart=primaryDayStart
        primaryDayEnd=primaryDayEnd
        electionDayEnd=to
      }}
    `);
    assert.dom('.election-countdown').hasText('Ready for the Next Election? + Share Your Experience + Look Up Results');

  });
});
