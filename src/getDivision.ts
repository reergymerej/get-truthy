import { TruthyError, SideLabel } from "./types"
import { error } from "./visualize"

const getDivisionLeftStringError = (basis: any): TruthyError =>
  basis ? TruthyError.DivisionString : TruthyError.DivisionLeftEmptyString

const getDivisionRightStringError = (basis: any): TruthyError =>
  basis ? TruthyError.DivisionString : TruthyError.DivisionRightEmptyString

export const getDivision = (side: SideLabel, basis: any): any => {
  const type = typeof basis
  // TODO: refactor
  switch (type) {
    case "number":
      if (side === SideLabel.left) {
        if (basis === 0) {
          // anything / 0 == Infinity (truthy)
          return 1
        }
        return basis
      } else {
        if (basis === 0) {
          throw new Error(
            error(side, "/", basis, TruthyError.DivisionNumberZero),
          )
        }
        return basis
      }
    case "string": {
      const parsed = parseFloat(basis)
      if (isNaN(parsed)) {
        throw new Error(
          error(
            side,
            "/",
            basis,
            side === SideLabel.left
              ? getDivisionLeftStringError(basis)
              : getDivisionRightStringError(basis),
          ),
        )
      }
      return getDivision(side, parsed)
    }
    default:
      throw new Error(`unhandled case "${type}"`)
  }
}
