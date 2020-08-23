import { SideLabel, TruthyError } from "./types"
import { error } from "./visualize"

export const getMultiplication = (side: SideLabel, basis: any): any => {
  const type = typeof basis
  switch (type) {
    case "number":
      if (basis === 0) {
        throw new Error(error(side, "*", basis, TruthyError.MultiplyZero))
      }
      return basis
    case "string": {
      const parsed = parseFloat(basis)
      if (isNaN(parsed)) {
        throw new Error(
          error(
            side,
            "*",
            basis,
            basis
              ? TruthyError.MultiplyStringWord
              : TruthyError.MultiplyEmptyString,
          ),
        )
      }
      return getMultiplication(side, parsed)
    }
    default:
      throw new Error(`unhandled case "${type}"`)
  }
}
