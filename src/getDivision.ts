import { TruthyError, SideLabel } from "./types"
import { error } from "./visualize"

const getDivisionLeftStringError = (basis: any): TruthyError =>
  basis ? TruthyError.DivisionString : TruthyError.DivisionLeftEmptyString

const getDivisionRightStringError = (basis: any): TruthyError =>
  basis ? TruthyError.DivisionString : TruthyError.DivisionRightEmptyString

const getNumber = (side: SideLabel, basis: any) => {
  if (side === SideLabel.left) {
    if (basis === 0) {
      // anything / 0 == Infinity (truthy)
      return 1
    }
    return basis
  } else {
    if (basis === 0) {
      throw new Error(error(side, "/", basis, TruthyError.DivisionNumberZero))
    }
    return basis
  }
}

const getString = (side: SideLabel, basis: any) => {
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

export const getDivision = (side: SideLabel, basis: any): any => {
  const type = typeof basis

  switch (type) {
    case "number":
      return getNumber(side, basis)
    case "string":
      return getString(side, basis)
    default:
      throw new Error(`unhandled case "${type}"`)
  }
}
