import { SideLabel, TruthyError } from "./types"
import { error } from "./visualize"

export const getSubtraction = (side: SideLabel, basis: any): any => {
  const type = typeof basis
  switch (type) {
    case "number":
      return 1 - basis
    case "string": {
      const parsed = parseFloat(basis)
      if (isNaN(parsed)) {
        throw new Error(error(side, "-", basis, TruthyError.SubractionString))
      }
      return getSubtraction(side, parsed)
    }
    default:
      throw new Error(`unhandled case "${type}"`)
  }
}
