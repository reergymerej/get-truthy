import { TruthyError, SideLabel, StringType } from "./types"
import { error } from "./visualize"
import { getStringType } from "./util"

const divisionError = (side: SideLabel) => (
  basis: any,
  truthyError: TruthyError,
) => new Error(error(side, "/", basis, truthyError))
const leftError = divisionError(SideLabel.left)
const rightError = divisionError(SideLabel.right)

const getNumber = (side: SideLabel, basis: any) => {
  if (side === SideLabel.left) {
    return basis === 0
      ? // anything / 0 == Infinity (truthy)
        1
      : basis
  } else {
    if (basis === 0) {
      throw divisionError(side)(basis, TruthyError.DivisionNumberZero)
    }
    return basis
  }
}

const getLeftString = (basis: any) => {
  switch (getStringType(basis)) {
    case StringType.Empty:
      throw leftError(basis, TruthyError.DivisionLeftEmptyString)
    case StringType.Normal:
      throw leftError(basis, TruthyError.DivisionString)
    case StringType.Numeric:
      return getDivision(SideLabel.left, Number(basis))
    default:
      throw new Error(`unhandled case "${getStringType(basis)}"`)
  }
}

const getRightString = (basis: any) => {
  switch (getStringType(basis)) {
    case StringType.Empty:
      throw rightError(basis, TruthyError.DivisionRightEmptyString)
    case StringType.Normal:
      throw rightError(basis, TruthyError.DivisionString)
    case StringType.Numeric:
      return getDivision(SideLabel.right, Number(basis))
    default:
      throw new Error(`unhandled case "${getStringType(basis)}"`)
  }
}

const getString = (side: SideLabel, basis: any) =>
  side === SideLabel.left
    ? //
      getLeftString(basis)
    : getRightString(basis)

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
