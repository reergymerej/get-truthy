/* eslint-disable @typescript-eslint/ban-types */
import { left, right } from "./"
import { SideLabel, Operator, TruthyError } from "./types"
import { getProblem } from "./visualize"

const verbose = 0

const sides: SideRun[] = [
  ["get left", SideLabel.left, left],
  ["get right", SideLabel.right, right],
]

const operators: Operator[] = [
  "!=",
  "!==",
  // "+",
  // "-",
  // "<",
  // "<=",
  "==",
  "===",
  // ">",
  // ">=",
  // "*",
  // "/",
  "%",
  "**",
  // "&&",
  "||",
]

const numbers: ItOption[] = [
  [
    0,
    {
      "*": TruthyError.MultiplyZero,
      "%": TruthyError.ModuloNumberZero,
      "&&": TruthyError.LogicalAnd,
    },
    {
      "*": TruthyError.MultiplyZero,
      "/": TruthyError.DivisionNumberZero,
      "%": TruthyError.ModuloNumberZero,
      "&&": TruthyError.LogicalAnd,
    },
  ],
  [-1, {}, {}],
  [1, {}, {}],
  [-100, {}, {}],
  [100, {}, {}],
  [
    BigInt(0),
    {
      "*": TruthyError.MultiplyBigZero,
      "/": TruthyError.DivisionLeftBigZero,
      "%": TruthyError.ModLeftBigZero,
    },
    {
      "*": TruthyError.MultiplyBigZero,
      "/": TruthyError.DivisionRightBigZero,
      "%": TruthyError.ModRightBigZero,
      "**": TruthyError.ExpoRightBigZero,
    },
  ],
  [BigInt(9007199254740991), {}, {}],
]

const strings: ItOption[] = [
  [
    "foo",
    {
      "-": TruthyError.SubractionString,
      "*": TruthyError.MultiplyStringWord,
      "/": TruthyError.DivisionString,
      "%": TruthyError.ModuloLeftStringWord,
      "**": TruthyError.ExpoLeftStringWord,
    },
    {
      "-": TruthyError.SubractionString,
      "*": TruthyError.MultiplyStringWord,
      "/": TruthyError.DivisionString,
      "%": TruthyError.ModuloRightStringWord,
    },
  ],
  [
    "",
    {
      "-": TruthyError.SubractionString,
      "<": TruthyError.LessThanStringEmpty,
      "<=": TruthyError.LessThanStringEmpty,
      "*": TruthyError.MultiplyEmptyString,
      "/": TruthyError.DivisionLeftEmptyString,
      "%": TruthyError.ModuloLeftStringEmpty,
      "&&": TruthyError.LogicalAnd,
    },
    {
      "-": TruthyError.SubractionString,
      ">": TruthyError.LessThanStringEmpty,
      ">=": TruthyError.LessThanStringEmpty,
      "*": TruthyError.MultiplyEmptyString,
      "/": TruthyError.DivisionRightEmptyString,
      "%": TruthyError.ModuloRightStringEmpty,
      "&&": TruthyError.LogicalAnd,
    },
  ],
]

const numericStrings: ItOption[] = [
  ["3", {}, {}],
  ["0x000000a", {}, {}],
  [
    "0",
    {
      "*": TruthyError.MultiplyZero,
      "%": TruthyError.ModuloNumberZero,
    },
    {
      "*": TruthyError.MultiplyZero,
      "/": TruthyError.DivisionNumberZero,
      "%": TruthyError.ModuloNumberZero,
    },
  ],
]

const junk: ItOption[] = [
  [
    null,
    {
      "%": TruthyError.ModLeftNull,
    },
    {
      "%": TruthyError.ModRightNull,
    },
  ],
  // [
  //   {},
  //   {
  //     "**": TruthyError.ExpoObjectLeft,
  //   },
  //   {},
  // ],
  // [() => {}, {}, {}],
  // [false, {}, {}],
  // [true, {}, {}],
  // [undefined, {}, {}],
  [
    Symbol("of love"),
    {
      "+": TruthyError.AdditionSymbol,
      "-": TruthyError.SubtractionSymbol,
      "<": TruthyError.GreaterThanLessThanSymbol,
      "<=": TruthyError.GreaterThanLessThanSymbol,
      ">": TruthyError.GreaterThanLessThanSymbol,
      ">=": TruthyError.GreaterThanLessThanSymbol,
      "*": TruthyError.MultiplySymbol,
      "/": TruthyError.DivisionSymbol,
      "%": TruthyError.ModSymbol,
      "**": TruthyError.ExpoSymbol,
    },
    {
      "+": TruthyError.AdditionSymbol,
      "-": TruthyError.SubtractionSymbol,
      "<": TruthyError.GreaterThanLessThanSymbol,
      "<=": TruthyError.GreaterThanLessThanSymbol,
      ">": TruthyError.GreaterThanLessThanSymbol,
      ">=": TruthyError.GreaterThanLessThanSymbol,
      "*": TruthyError.MultiplySymbol,
      "/": TruthyError.DivisionSymbol,
      "%": TruthyError.ModSymbol,
      "**": TruthyError.ExpoSymbol,
    },
  ],
]

const itOptions: ItOption[] = [
  //
  ...numbers,
  ...strings,
  ...numericStrings,
  ...junk,
]

// --------------------------------------------------------------------------------
// The tests are kinda whacky.  Just use the values above to add/remove test
// cases.

type SideRun = [string, SideLabel, Function]

type ExpectedErrors = {
  [key in Operator]: TruthyError
}

type ItOption = [
  unknown, // basis
  Partial<ExpectedErrors>, // throws when finding left
  Partial<ExpectedErrors>, // throws when finding right
]

// Return value safe for eval.
type Evaluable = number | string | boolean | undefined | object
// eslint-disable-next-line complexity
const safe = (value: unknown): Evaluable => {
  const type = typeof value
  let result: Evaluable
  switch (type) {
    case "number":
      result = value as number
      break
    case "string":
      result = `"${value}"`
      break
    case "boolean":
      result = !!value
      break
    case "undefined":
      break
    case "bigint":
      result = `BigInt(${String(value)})`
      break
    case "symbol":
      // stringifying the symbol loses the ", just use a dang number
      return `(${String(Symbol(1))})`
    case "function":
      result = String(value)
      break
    case "object":
      if (value === null) {
        return null
      }
      result = JSON.stringify(value)
      break
    default:
      throw new Error(`unhandled case "${type}"`)
  }
  return `(${result})`
}

const getEvalString = (
  label: SideLabel,
  fn: Function,
  operator: string,
  basis: unknown,
): string => {
  const value = fn(operator, basis)
  const safeValue = safe(value)
  const safeBasis = safe(basis)
  return label === SideLabel.left
    ? `${safeValue} ${operator} ${safeBasis}`
    : `${safeBasis} ${operator} ${safeValue}`
}

const getExpectedError = (
  label: SideLabel,
  impossibleLeft: ItOption["1"],
  impossibleRight: ItOption["2"],
  operator: Operator,
) =>
  (label === SideLabel.left && impossibleLeft[operator]) ||
  (label === SideLabel.right && impossibleRight[operator])

const handleExpected = (
  operator: Operator,
  basis: unknown,
  expectedError: TruthyError,
  fn: Function,
) => {
  expect(() => {
    fn(operator, basis)
  }).toThrow(expectedError)
}

// eslint-disable-next-line max-statements
const handleStandard = (
  label: SideLabel,
  fn: Function,
  operator: Operator,
  basis: unknown,
) => {
  const evalString = getEvalString(label, fn, operator, basis)
  if (verbose) {
    const problem = getProblem(label, operator, basis)
    console.log(`${problem}\n${evalString}`)
  }
  if (typeof basis === "symbol") {
    // Even identical symbols aren't the same.  This is a special case where we
    // can't use eval to test.
    return
  }
  expect(eval(evalString)).toBeTruthy()
}

describe.each(sides)("%s", (_labelName, label, fn) => {
  describe.each(operators)("%s", (operator: Operator) => {
    it.each(itOptions)("%s", (basis, impossibleLeft, impossibleRight) => {
      const expectedError = getExpectedError(
        label,
        impossibleLeft,
        impossibleRight,
        operator,
      )
      if (expectedError) {
        handleExpected(operator, basis, expectedError, fn)
      } else {
        handleStandard(label, fn, operator, basis)
      }
    })
  })
})
