<h1>Validators</h1>

[![CI/CD Status][github-action-badge]][github-action-link] [![Codecov][codecov-badge]][codecov-project] [![MIT License][license-image]][license-url]  
[![NPM version][npm-version-image]][npm-package] [![Library size][file-size-badge]][raw-distribution-js]

A collection of form validators.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Table of Contents

- [Usage](#usage)
  - [Available validators](#available-validators)
- [Mocking](#mocking)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

NOTE: This service is provided as a singleton by defining the `providedIn` property as `root`.

## Usage

```typescript
import {
  FormBuilder,
  FormGroup,
} from '@angular/forms';
import { TsValidatorsService } from '@terminus/ui-validators';


@Component({
  ...
})
export class MyComponent {
  // Create a form
  myForm: FormGroup = this.formBuilder.group({
    email: [
      null,
      [
        // Basic validator
        this.validatorsService.email(),
      ],
    ],
    greaterThan: [
      null,
      [
        // Validator with a required argument
        this.validatorsService.greaterThan(10),
      ],
    ],
  });

  constructor(
    private formBuilder: FormBuilder,
    private validatorsService: TsValidatorsService,
  ) {}

}
```

### Available validators

| Validator        | Purpose                                                       |
|------------------|---------------------------------------------------------------|
| `creditCard`     | A credit card number must be valid                            |
| `email`          | An email address must be valid                                |
| `domain`         | A domain must be valid                                        |
| `equalToControl` | A control's value must be equal to another control's value    |
| `greaterThan`    | A number must be greater than another value                   |
| `inCollection`   | A value must be found in a collection                         |
| `isInRange`      | A number must be between two numbers                          |
| `lessThan`       | A number must be less than another value                      |
| `lowercase`      | A value must contain a minimum amount of lowercase characters |
| `maxDate`        | A date must be before a maximum date                          |
| `minDate`        | A date must be after a minimum date                           |
| `numbers`        | A value must contain a minimum amount of numbers              |
| `password`       | A password must meet certain requirements                     |
| `uppercase`      | A value must contain a minimum amount of uppercase characters |
| `url`            | A URL must be valid                                           |

## Mocking

A mocked version of the service is available for testing as `TsValidatorsServiceMock` from `@terminus/ui-validators/testing`.

The mocks consist of Jest mock functions. Based on the class value `isValid` the validator mock will
return an error message or `null`.

<!-- Links -->
[license-url]:         https://github.com/GetTerminus/terminus-oss/blob/release/LICENSE
[license-image]:       http://img.shields.io/badge/license-MIT-blue.svg
[codecov-project]:     https://codecov.io/gh/GetTerminus/terminus-oss
[codecov-badge]:       https://codecov.io/gh/GetTerminus/terminus-oss/branch/release/graph/badge.svg
[npm-version-image]:   http://img.shields.io/npm/v/@terminus/ui-validators.svg
[npm-package]:         https://www.npmjs.com/package/@terminus/ui-validators
[github-action-badge]: https://github.com/GetTerminus/terminus-oss/workflows/Release%20CI/badge.svg
[github-action-link]:  https://github.com/GetTerminus/terminus-oss/actions?query=workflow%3A%22CI+Release%22
[file-size-badge]:     http://img.badgesize.io/https://unpkg.com/@terminus/ui-validators/bundles/terminus-ui-validators.umd.min.js?compression=gzip
[raw-distribution-js]: https://unpkg.com/@terminus/ui-validators/bundles/terminus-ui-validators.umd.js
