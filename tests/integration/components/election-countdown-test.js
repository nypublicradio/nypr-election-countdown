import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import { render } from "@ember/test-helpers";
import hbs from "htmlbars-inline-precompile";
import Pretender from "pretender";

import moment from "moment";

const TIMEZONE = "America/New_York";

const CHUNK_RESPONSE = {
  data: {
    type: "chunk",
    id: "875272",
    attributes: {
      content: "Example chunk text",
      slug: "election-hub-countdown-text"
    }
  }
};

module("Integration | Component | election-countdown", function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.server = new Pretender(function() {
      this.get(
        "https://api.demo.nypr.digital/api/v3/chunks/election-hub-countdown-text/",
        () => {
          return [
            200,
            { "Content-Type": "application/json" },
            JSON.stringify(CHUNK_RESPONSE)
          ];
        }
      );
    });
  });

  hooks.afterEach(function() {
    this.server.shutdown();
  });

  test("usage", async function(assert) {
    let NOW = moment().tz(TIMEZONE); // today
    let ONE_YEAR_FROM_NOW = NOW.clone().add(1, "year");
    this.set("from", NOW);
    this.set("to", ONE_YEAR_FROM_NOW);
    this.set(
      "electionDayEveStart",
      ONE_YEAR_FROM_NOW.clone().subtract(1, "days")
    );
    await render(hbs`
      {{election-countdown
        from=from
        to=to
        unit='days'
        electionDayStart=to
      }}
    `);
    assert
      .dom(".election-countdown")
      .hasText(
        "365 Days Until the General Election + Add to Cal + Get Updates"
      );

    this.set("from", NOW);
    this.set("to", NOW.clone().add(1, "days"));
    this.set("electionDayEveStart", NOW.clone().subtract(1, "days"));
    await render(hbs`
      {{election-countdown
        from=from
        to=to
        unit='days'
        electionDayEveStart=electionDayEveStart
        electionDayStart=to
      }}
    `);
    assert
      .dom(".election-countdown")
      .hasText("1 Day Until the General Election + Add to Cal + Get Updates");

    this.set("to", NOW.clone().subtract(1, "hours"));
    this.set("electionDayStart", NOW.clone().subtract(1, "days"));
    this.set("electionDayEnd", NOW.clone().add(2, "days"));
    await render(hbs`
      {{election-countdown
        from=from
        to=to
        unit='days'
        electionDayStart=electionDayStart
        electionDayEnd=electionDayEnd
      }}
    `);
    assert.dom(".election-countdown").hasText("Example chunk text");

    this.set("from", NOW.clone().subtract(10, "days"));
    this.set("to", NOW.clone().subtract(5, "days"));
    this.set("electionDayStart", NOW.clone().subtract(5, "days"));
    this.set("electionDayEnd", NOW.clone().subtract(4, "days"));
    await render(hbs`
      {{election-countdown
        from=from
        to=to
        unit='days'
        electionDayStart=electionDayStart
        electionDayEnd=electionDayEnd
      }}
    `);
    assert.dom(".election-countdown").hasText("Example chunk text");
  });
});
