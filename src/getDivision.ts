import { TruthyError, SideLabel, StringType } from "./types"
import { error } from "./visualize"
import { getStringType } from "./util"

const divisionError = (side: SideLabel) => (
  basis: unknown,
  truthyError: TruthyError,
) => new Error(error(side, "/", basis, truthyError))
const leftError = divisionError(SideLabel.left)
const rightError = divisionError(SideLabel.right)

const solveForNumber = (side: SideLabel, basis: number): number => {
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

const solveForLeftString = (basis: string): ReturnType<typeof getDivision> => {
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

const solveForRightString = (basis: string): ReturnType<typeof getDivision> => {
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

const solveForString = (side: SideLabel, basis: string): string | number =>
  side === SideLabel.left
    ? //
      solveForLeftString(basis)
    : solveForRightString(basis)

export const getDivision = (
  side: SideLabel,
  basis: unknown,
): number | string => {
  const type = typeof basis

  switch (type) {
    case "number":
      return solveForNumber(side, basis as number)
    case "string":
      return solveForString(side, basis as string)
    default:
      throw new Error(`unhandled case "${type}"`)
  }
}
