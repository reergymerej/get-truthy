import { SideLabel, TruthyError, StringType } from "./types"
import { error } from "./visualize"
import { getStringType } from "./util"

const expoError = (side: SideLabel) => (
  basis: string,
  truthyError: TruthyError,
) => new Error(error(side, "**", basis, truthyError))
const leftError = expoError(SideLabel.left)

const solveForStringOnLeft = (
  basis: string,
): number | ReturnType<typeof getExponentiation> => {
  switch (getStringType(basis)) {
    case StringType.Normal:
      throw leftError(basis, TruthyError.ExpoLeftStringWord)
    case StringType.Empty:
      return 1
    case StringType.Numeric:
      return getExponentiation(SideLabel.left, Number(basis))
    default:
      throw new Error(`unhandled case "${getStringType(basis)}"`)
  }
}

const solveForLeft = (basis: unknown): number | null => {
  const type = typeof basis
  switch (type) {
    case "number":
      return 1
    case "string":
      return solveForStringOnLeft(basis as string)
    default:
      throw new Error(`unhandled case "${type}"`)
  }
}

export const getExponentiation = (
  side: SideLabel,
  basis: unknown,
): ReturnType<typeof solveForLeft> | null =>
  side === SideLabel.left
    ? solveForLeft(basis) //
    : null
