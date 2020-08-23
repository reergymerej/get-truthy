import { Operator, SideLabel, TruthyError } from "./types"
import { error } from "./visualize"

const getGreaterOrLessThan = (change: number) => (
  operator: Operator,
  side: SideLabel,
  basis: any,
): any => {
  const type = typeof basis
  switch (type) {
    case "number":
      return basis + change
    case "string": {
      if (!basis) {
        if (change < 0) {
          throw new Error(
            error(side, operator, basis, TruthyError.LessThanStringEmpty),
          )
        }
        return "any string"
      }
      const codePoint = basis.codePointAt(0)
      const nextString = String.fromCodePoint(codePoint + change)
      const result = nextString + basis.substring(1)
      return result
    }
    default:
      throw new Error(`unhandled case "${type}"`)
  }
}

export const getGreaterThan = getGreaterOrLessThan(1)
export const getLessThan = getGreaterOrLessThan(-1)
