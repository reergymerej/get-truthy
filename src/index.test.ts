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
]

const itOptions: ItOption[] = [
  // numbers
  [-100, {}, {}],
  [100, {}, {}],
  [-1, {}, {}],
  [1, {}, {}],
  [
    0,
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
  [1, {}, {}],

  // strings
  [
    "foo",
    {
      "-": TruthyError.SubractionString,
      "*": TruthyError.MultiplyStringWord,
      "/": TruthyError.DivisionString,
      "%": TruthyError.ModuloLeftStringWord,
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
    },
    {
      "-": TruthyError.SubractionString,
      ">": TruthyError.LessThanStringEmpty,
      ">=": TruthyError.LessThanStringEmpty,
      "*": TruthyError.MultiplyEmptyString,
      "/": TruthyError.DivisionRightEmptyString,
      "%": TruthyError.ModuloRightStringEmpty,
    },
  ],
  ["3", {}, {}],
  // '0x000000a'
  // '5' % 6 == true
  // 9 - '10' == true
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
const safe = (value: any) => {
  const type = typeof value
  switch (type) {
    case "number":
      return value
    case "string":
      return `"${value}"`
    case "boolean":
      return value
    case "undefined":
      return value
    default:
      throw new Error(`unhandled case "${type}"`)
  }
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

describe.each(sides)("%s", (_labelName, label, fn) => {
  describe.each(operators)("%s", (operator: Operator) => {
    it.each(itOptions)("%s", (basis, impossibleLeft, impossibleRight) => {
      const expectedError = getExpectedError(
        label,
        impossibleLeft,
        impossibleRight,
        operator,
      )

      const handleExpected = () => {
        expect(() => {
          fn(operator, basis)
        }).toThrow(expectedError)
      }

      const handleStandard = () => {
        const evalString = getEvalString(label, fn, operator, basis)
        const problem = getProblem(label, operator, basis)
        if (verbose) {
          console.log(`${problem}\n${evalString}`)
        }
        expect(eval(evalString)).toBeTruthy()
      }

      if (expectedError) {
        handleExpected()
      } else {
        handleStandard()
      }
    })
  })
})
