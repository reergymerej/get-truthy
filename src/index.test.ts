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
  "+",
  "-",
  "<",
  "<=",
  "==",
  "===",
  ">",
  ">=",
  "*",
  "/",
  "%",
  "**",
  "&&",
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

const itOptions: ItOption[] = [
  //
  ...numbers,
  ...strings,
  ...numericStrings,
]

// --------------------------------------------------------------------------------
// The tests are kinda whacky.  Just use the values above to add/remove test
// cases.

type SideRun = [string, SideLabel, Function]

type ExpectedErrors = {
  [key in Operator]: TruthyError
}

type ItOption = [
  any, // basis
  Partial<ExpectedErrors>, // throws when finding left
  Partial<ExpectedErrors>, // throws when finding right
]

// Return value safe for eval.
// eslint-disable-next-line complexity
const safe = (value: any): string => {
  const type = typeof value
  let result: string
  switch (type) {
    case "number":
      result = value
      break
    case "string":
      result = `"${value}"`
      break
    case "boolean":
      result = value
      break
    case "undefined":
      result = value
      break
    case "object":
      if (value === null) {
        return null
      }
    // falls through
    default:
      throw new Error(`unhandled case "${type}"`)
  }
  return `(${result})`
}

const getEvalString = (
  label: SideLabel,
  fn: Function,
  operator: string,
  basis: any,
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
  basis: any,
  expectedError: TruthyError,
  fn: Function,
) => {
  expect(() => {
    fn(operator, basis)
  }).toThrow(expectedError)
}

const handleStandard = (
  label: SideLabel,
  fn: Function,
  operator: Operator,
  basis: any,
) => {
  const evalString = getEvalString(label, fn, operator, basis)
  const problem = getProblem(label, operator, basis)
  if (verbose) {
    console.log(`${problem}\n${evalString}`)
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
