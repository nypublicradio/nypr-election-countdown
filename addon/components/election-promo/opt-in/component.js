import Changeset from "ember-changeset";
import Component from "@ember/component";
import config from "ember-get-config";
import fetch from "fetch";
import layout from './template';
import lookupValidator from "ember-changeset-validations";
import { set } from "@ember/object";
import { all, task } from "ember-concurrency";
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
    this.changeset = new Changeset(
      {
        email: null,
        legalChecked: true
      },
      lookupValidator(validations),
      validations
    );
    set(this, "changeset", this.changeset);
  },

  submitField: task(function*(fieldName, endpoint, data) {
    if (
      this.get(`changeset.${fieldName}`) && // email has been entered
      !this.get(`changeset.error.${fieldName}`) && // no errors exist
      !this.get(`${fieldName}Success`) // not already submitted
    ) {
      return yield fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })
        .then(res => {
          // Success response
          if (res.status === 200 || res.status === 201) {
            this.set("changeset.legalChecked", false);
            return [`${fieldName}Success`, true];
          }
          // Error response
          if (res.status >= 400) {
            return res
              .json()
              .then(json => [`${fieldName}ResponseErrors`, [json.detail]]);
          }
        })
        .catch(e => {
          return e;
        });
    }
  }),

  actions: {
    submitForms() {
      let childTasks = [];
      this.set("isLoading", true);

      childTasks.push(
        this.get("submitField").perform("email", newsletterEndpoint, {
          email: this.get("changeset.email"),
          list: config.mailchimpList
        })
      );

      all(childTasks).then(completedJobs => {
        this.set("isLoading", false);
        completedJobs.forEach(values => (values ? this.set(...values) : null));
      });
    }
  }
});