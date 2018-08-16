nypr-election-countdown
==============================================================================

Provides a {{election-countdown}} component that calculates the time remaining
until election day and renders the appropriate HTML.

Installation
------------------------------------------------------------------------------

```
ember install nypr-election-countdown
```


Usage
------------------------------------------------------------------------------

Inline usage:

`{{election-countdown unit='days' from=from to='2018-11-06T06:00:00-5:00'}}`

The `from` param defaults to now if excluded. You can use `moment()` or String
values for the `from` and `to` params. If you use Strings, they
must follow the ISO 8601 format. Any of the following work:

- simple date: 2018-6-25
- simple datetime: 2018-6-25T11:30:00
- date time with timezone offset: 2018-6-25T11:30:00-4:00

Block usage:

Note that this addon renders a block of HTML specific to the midterm elections,
including different text treatments depending on whether your `from` date is
before, equal to, or after election day. For that reason, block usage of the
component isn't recommended unless all you need is to add an extra wrapper
around the rendered HTML. (You won't have much additional control.)


Contributing
------------------------------------------------------------------------------

### Installation

* `git clone <repository-url>`
* `cd nypr-election-countdown`
* `npm install`

### Linting

* `npm run lint:js`
* `npm run lint:js -- --fix`

### Running tests

* `ember test` – Runs the test suite on the current Ember version
* `ember test --server` – Runs the test suite in "watch mode"
* `ember try:each` – Runs the test suite against multiple Ember versions

### Running the dummy application

* `ember serve`
* Visit the dummy application at [http://localhost:4200](http://localhost:4200).

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).

License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
