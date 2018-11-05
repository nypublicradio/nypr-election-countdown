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

  test("one day before election day", async function(assert) {
    let NOW = moment().tz(TIMEZONE);
    let ELECTION_DAY = NOW.clone().add(1, "days");
    let ELECTION_DAY_EVE_START = NOW.clone().subtract(5, "minutes");
    let ELECTION_POLLS_CLOSE = NOW.clone().add(1, "days").add(21, "hours");
    let DAY_AFTER_ELECTION = NOW.clone().add(2, "days");

    this.set("from", NOW);
    this.set("to", ELECTION_DAY);
    this.set("electionDayStart", ELECTION_DAY);
    this.set("electionDayEveStart", ELECTION_DAY_EVE_START);
    this.set("electionPollsClose", ELECTION_POLLS_CLOSE);
    this.set("electionDayEnd", DAY_AFTER_ELECTION);

    await render(hbs`
      {{election-countdown
        from=from
        to=to
        unit='days'
        electionDayStart=electionDayStart
        electionDayEveStart=electionDayEveStart
        electionPollsClose=electionPollsClose
        electionDayEnd=electionDayEnd
      }}
    `);

    assert
      .dom(".election-countdown__left")
      .hasText(
        "1 Day Until the General Election"
      );
  });

  test("early election day, before polls close", async function(assert) {
    let NOW = moment().tz(TIMEZONE);
    let TODAY = moment(`${NOW.format('MM-DD-YYY')} 00:00:00`);
    let ELECTION_DAY = NOW.clone().subtract(1, "hours");
    let ELECTION_POLLS_CLOSE = NOW.clone().add(1, "hours");
    let DAY_AFTER_ELECTION = TODAY.clone().add(1, "days");

    this.set("from", TODAY);
    this.set("to", ELECTION_DAY);
    this.set("electionDayStart", ELECTION_DAY);
    this.set("electionPollsClose", ELECTION_POLLS_CLOSE);
    this.set("electionDayEnd", DAY_AFTER_ELECTION);

    await render(hbs`
      {{election-countdown
        from=from
        to=to
        unit='days'
        electionDayStart=electionDayStart
        electionPollsClose=electionPollsClose
        electionDayEnd=electionDayEnd
      }}
    `);

    assert
      .dom(".election-countdown__left")
      .hasText(
        "It's Election Day. Check the WNYC Voter Guide before heading to the polls."
      );
  });

  test("election day, between polls close and EOD", async function(assert) {
    let NOW = moment().tz(TIMEZONE);
    let TODAY = moment(`${NOW.format('MM-DD-YYY')} 00:00:00`);
    let ELECTION_DAY = NOW.clone();
    let ELECTION_POLLS_CLOSE = NOW.clone().subtract(1, "hours");
    let DAY_AFTER_ELECTION = TODAY.clone().add(1, "days");

    this.set("from", TODAY);
    this.set("to", ELECTION_DAY);
    this.set("electionDayStart", ELECTION_DAY);
    this.set("electionPollsClose", ELECTION_POLLS_CLOSE);
    this.set("electionDayEnd", DAY_AFTER_ELECTION);

    await render(hbs`
      {{election-countdown
        from=from
        to=to
        unit='days'
        electionDayStart=electionDayStart
        electionPollsClose=electionPollsClose
        electionDayEnd=electionDayEnd
      }}
    `);

    assert
      .dom(".election-countdown__left")
      .hasText(
        "Polls have closed. Check out the results."
      );
  });

  test("day after election", async function(assert) {
    let NOW = moment().tz(TIMEZONE);
    let TODAY = moment(`${NOW.format('MM-DD-YYY')} 00:00:00`);
    let ELECTION_DAY = NOW.clone();
    let ELECTION_POLLS_CLOSE = NOW.clone().subtract(2, "days");
    let DAY_AFTER_ELECTION = TODAY.clone().subtract(1, "days");

    this.set("from", TODAY);
    this.set("to", ELECTION_DAY);
    this.set("electionDayStart", ELECTION_DAY);
    this.set("electionPollsClose", ELECTION_POLLS_CLOSE);
    this.set("electionDayEnd", DAY_AFTER_ELECTION);

    await render(hbs`
      {{election-countdown
        from=from
        to=to
        unit='days'
        electionDayStart=electionDayStart
        electionPollsClose=electionPollsClose
        electionDayEnd=electionDayEnd
      }}
    `);

    assert
      .dom(".election-countdown__left")
      .hasText(
        "Polls have closed. Check out the results."
      );
  });
});
