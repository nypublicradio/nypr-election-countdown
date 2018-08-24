import Changeset from "ember-changeset";
import Component from "@ember/component";
import config from "ember-get-config";
import fetch from "fetch";
import layout from './template';
import lookupValidator from "ember-changeset-validations";
import { and } from "@ember/object/computed";
import { computed } from "@ember/object";
import { set } from "@ember/object";
import { all, task } from "ember-concurrency";
import {
  validateFormat,
  validatePresence
} from "ember-changeset-validations/validators";

let newsletterEndpoint = `${config.optInAPI}/mailchimp`;
let smsEndpoint = `${config.optInAPI}/mobile-commons`;
let validations = {
  email: validateFormat({ type: "email", allowBlank: true }),
  phone: validateFormat({ type: "phone", allowBlank: true }),
  legalChecked: validatePresence(true)
};

export default Component.extend({
  layout,
  classNames: ["opt-in"],
  emailResponseErrors: null,
  phoneResponseErrors: null,

  init() {
    this._super(...arguments);
    this.changeset = new Changeset(
      {
        email: null,
        phone: null,
        legalChecked: false
      },
      lookupValidator(validations),
      validations
    );
    set(this, "changeset", this.changeset);
  },

  isSubmitButtonDisabled: computed(
    "changeset.{email,phone,legalChecked}",
    function() {
      return !(
        (this.get("changeset.email") || this.get("changeset.phone")) &&
        this.get("changeset.legalChecked")
      );
    }
  ),
  isFullFormSubmitted: and("phoneSuccess", "emailSuccess"),
  signUpButtonText: computed("phoneSuccess", "emailSuccess", function() {
    if (this.get("phoneSuccess") && !this.get("emailSuccess")) {
      return "Subscribe to the Newsletter";
    }
    if (!this.get("phoneSuccess") && this.get("emailSuccess")) {
      return "Sign Up for SMS";
    }
    return "Sign Up";
  }),
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
      childTasks.push(
        this.get("submitField").perform("phone", smsEndpoint, {
          phoneNumber: (this.get("changeset.phone") || "").replace(/\D/g, ""),
          optIn: config.mobileCommonsOptInKey
        })
      );

      all(childTasks).then(completedJobs => {
        this.set("isLoading", false);
        completedJobs.forEach(values => (values ? this.set(...values) : null));
      });
    }
  }
});
