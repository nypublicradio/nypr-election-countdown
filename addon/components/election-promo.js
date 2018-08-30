import Component from "@ember/component";
import layout from "../templates/components/election-promo";
import { inject as service } from "@ember/service";
import { computed } from "@ember/object";

export default Component.extend({
  layout,
  chunkContent: null,
  chunkSlug: "election-promo",
  classNames: ["election-promo"],
  classNameBindings: ['alreadyShown:hidden'],

  cookies: service(),

  init() {
    this._super(...arguments);
    this.get("store")
      .findRecord("chunk", this.chunkSlug)
      .then(chunkContent => {
        this.set("chunkContent", chunkContent.get("content"));
      });
  },

  store: service(),

  countdownTo: "2018-11-06T00:00:00.000-05:00",
  alreadyShown: computed('cookies', function() {
    let cookieService = this.get("cookies");
    return cookieService.read("hasSeenElectionPromo");
  }),
  actions: {
    closeModule() {
      let cookieService = this.get("cookies");
      cookieService.write("hasSeenElectionPromo", true, {path: '/', domain: 'wnyc.org'});
      document.querySelector(".election-promo").remove();
    }
  }
});
