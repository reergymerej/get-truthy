import { SideLabel, TruthyError } from "./types"
import { error } from "./visualize"

const andError = (side: SideLabel) => (
  basis: unknown,
  truthyError: TruthyError,
) => new Error(error(side, "&&", basis, truthyError))

export const getLogicalAnd = (side: SideLabel, basis: unknown): number => {
  if (basis) {
    return 1
  }
  throw andError(side)(basis, TruthyError.LogicalAnd)
}
