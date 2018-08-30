import Changeset from "ember-changeset";
import Component from "@ember/component";
import config from "ember-get-config";
import fetch from "fetch";
import layout from './template';
import lookupValidator from "ember-changeset-validations";
import { set } from "@ember/object";
import { task } from "ember-concurrency";
import {
  validateFormat,
  validatePresence
} from "ember-changeset-validations/validators";

let newsletterEndpoint = `${config.optInAPI}/mailchimp`;
let validations = {
  email: validateFormat({ type: "email"}),
  legalChecked: validatePresence(true)
};

export default Component.extend({
  layout,
  classNames: ["promo-opt-in"],
  emailResponseErrors: null,

  init() {
    this._super(...arguments);
    let changeset = new Changeset(
      {
        email: null,
        legalChecked: true
      },
      lookupValidator(validations),
      validations
    );
    set(this, "changeset", changeset);
  },

  submitField: task(function*(fieldName, endpoint, data) {
    return yield fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    })
      .then(res => {
        // Success response
        if (res.status === 200 || res.status === 201) {
          return {emailSuccess: true, 'changeset.legalChecked': false};
        }
        // Error response
        if (res.status >= 400) {
          return res
            .json()
            .then(json => ({emailResponseErrors: [json.detail]}));
        }
      })
      .catch(e => ({emailResponseErrors: [e]}));
  }),

  actions: {
    submitForms() {
      this.get('changeset').validate().then(() => {
        if (this.get('changeset').get('isValid') && !this.get('emailSuccess')) {
          this.get('submitField').perform("email", `${this.mailchimpEndpoint}`, {
            email: this.get("changeset.email"),
            list: config.mailchimpList
          })
          .then(values => values ? this.setProperties(values) : null);
        }
      })
    }
  }
});
