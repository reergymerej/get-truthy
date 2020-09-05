import { Operator, SideLabel, TruthyError } from "./types"
import { error } from "./visualize"
import { getType } from "./util"

export const getCodePoint = (basis: string): number => {
  if (!basis) {
    throw new Error(`Unable to determine next when the input string is empty.`)
  }
  return basis.codePointAt(0) as number
}

const getNextString = (change: number, basis: string): string => {
  const codePoint = getCodePoint(basis)
  const nextString = String.fromCodePoint(codePoint + change)
  const result = nextString + basis.substring(1)
  return result
}

const getString = (change: number) => (
  operator: Operator,
  basis: string,
  side: SideLabel,
): string => {
  if (!basis) {
    if (change < 0) {
      throw new Error(
        error(side, operator, basis, TruthyError.LessThanStringEmpty),
      )
    }
    return "any string"
  }
  return getNextString(change, basis)
}

const solveForNull = (
  side: SideLabel,
  operator: Operator,
  basis: unknown,
): number => {
  if (side === SideLabel.right) {
    return 1
  }
  throw error(side, operator, basis, TruthyError.AlwaysFalsy)
}

const solveForBoolean = (
  side: SideLabel,
  operator: Operator,
  basis: unknown,
): number => {
  if (basis === true) {
    return side === SideLabel.right ? 2 : 0
  }
  if (side === SideLabel.right) {
    return 1
  }
  throw error(side, operator, basis, TruthyError.AlwaysFalsy)
}

// eslint-disable-next-line complexity
const getGreaterOrLessThan = (change: number) => (
  operator: Operator,
  side: SideLabel,
  basis: unknown,
): number | string | bigint => {
  const type = getType(basis)
  switch (type) {
    case "bigint":
      return (basis as bigint) + BigInt(change)
    case "number":
      return (basis as number) + change
    case "null":
      return solveForNull(side, operator, basis)
    case "object":
    case "function":
      return getGreaterOrLessThan(change)(operator, side, String(basis))
    case "string":
      return getString(change)(operator, basis as string, side)
    case "symbol":
      throw error(side, operator, basis, TruthyError.GreaterThanLessThanSymbol)
    case "boolean":
      return solveForBoolean(side, operator, basis)
    case "undefined":
      throw error(side, operator, basis, TruthyError.AlwaysFalsy)
  }
}

export const getGreaterThan = getGreaterOrLessThan(1)
export const getLessThan = getGreaterOrLessThan(-1)
