import { SideLabel, TruthyError } from "./types"
import { error } from "./visualize"

const andError = (side: SideLabel) => (basis: any, truthyError: TruthyError) =>
  new Error(error(side, "&&", basis, truthyError))

export const getLogicalAnd = (side: SideLabel, basis: any): any => {
  if (basis) {
    return 1
  }
  throw andError(side)(basis, TruthyError.LogicalAnd)
}
