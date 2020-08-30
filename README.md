# get-truthy

Show me a **binary operator** and a value, I'll show you another value to make it truthy.

[![Build Status](https://travis-ci.org/reergymerej/get-truthy.svg?branch=master)](https://travis-ci.org/reergymerej/get-truthy)
[![Coverage Status](https://coveralls.io/repos/github/reergymerej/get-truthy/badge.svg?branch=master)](https://coveralls.io/github/reergymerej/get-truthy?branch=master)
## Usage

### Get Left Operand

? > 9

```js
import getTruthy from 'get-truthy'

getTruthy.left('>', 9)
// 10
```

### Get Right Operand

9 > ?

```js
getTruthy.right('>', 9)
// 8

// '' > ? == true
getTruthy.right('>', 9)
// throws Impossible: Nothing can be less than an empty string.
```



## Development

* tests - `yarn test`
* watch - `yarn watch`
* dev mode - `yarn dev --inspect`
* lint - `yarn lint`



