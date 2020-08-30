# get-truthy

Show me a **binary operator** and a value, I'll show you another value to make it truthy.

## Usage

```js
import getTruthy from 'get-truthy'

// ? > 9 == true
getTruthy.left('>', 9)
// 10

// 9 > ? == true
getTruthy.right('>', 9)
// 8

// '' > ? == true
getTruthy.right('>', 9)
// throws Impossible: Nothing can be less than an empty string.
```

## Bad Error Messages


Impossible: Any string division is NaN.
Impossible: Anything % this string is NaN.
Impossible: Multiplying any non-numeric string is NaN
Impossible: Subtracting any string leads to NaN
Impossible: This string % anything is falsy.

    > 100 - '3'
    97
    > 100 * '3'
    300
    > 100 / '3'
    33.333333333333336
    > 100 % '3'
    1


## Development

* tests - `yarn test`
* watch - `yarn watch`
* dev mode - `yarn dev --inspect`
* lint - `yarn lint`
