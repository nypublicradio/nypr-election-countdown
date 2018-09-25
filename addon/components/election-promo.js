import Component from "@ember/component";
import layout from "../templates/components/election-promo";
import { inject } from "@ember/service";

export default Component.extend({
  layout,
  chunkContent: null,
  chunkSlug: "election-promo",
  classNames: ["election-promo"],
  classNameBindings: ['alreadyShown:hidden'],

  countdownTo: "2018-11-06T00:00:00.000-05:00",

  store: inject(),
  cookies: inject(),

  init() {
    this._super(...arguments);

    let cookieService = this.get("cookies");
    if (cookieService.read("nypr_hasSeenElectionPromo")) {
      this.set("alreadyShown", true);
    }

    this.get('store')
      .findRecord("chunk", this.chunkSlug)
      .then(chunkContent => {
        this.set("chunkContent", chunkContent.get('content'));
      });
  },
  actions: {
    closeModule() {
      let cookieService = this.get("cookies");
      cookieService.write("nypr_hasSeenElectionPromo", true, {path: '/'});
      this.set('alreadyShown', true);
    }
  }
});
