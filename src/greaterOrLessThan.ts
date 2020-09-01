import { Operator, SideLabel, TruthyError } from "./types"
import { error } from "./visualize"

const getNextString = (change: number, basis: string): string => {
  const codePoint = basis.codePointAt(0)
  const nextString = String.fromCodePoint((codePoint || 0) + change)
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

const getGreaterOrLessThan = (change: number) => (
  operator: Operator,
  side: SideLabel,
  basis: unknown,
): number | string => {
  const type = typeof basis
  switch (type) {
    case "number":
      return (basis as number) + change
    case "string":
      return getString(change)(operator, basis as string, side)
    default:
      throw new Error(`unhandled case "${type}"`)
  }
}

export const getGreaterThan = getGreaterOrLessThan(1)
export const getLessThan = getGreaterOrLessThan(-1)
