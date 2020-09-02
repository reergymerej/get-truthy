import { SideLabel, TruthyError, StringType } from "./types"
import { error } from "./visualize"
import { getStringType, getType } from "./util"

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
  }
}

const solveForLeft = (basis: unknown): number | null => {
  const type = getType(basis)
  switch (type) {
    case "number":
      return 1
    case "string":
      return solveForStringOnLeft(basis as string)
    case "symbol":
      throw error(SideLabel.left, "**", basis, TruthyError.ExpoSymbol)
  }
}

const solveForRight = (basis: unknown): null => {
  const type = getType(basis)
  switch (type) {
    case "symbol":
      throw error(SideLabel.right, "**", basis, TruthyError.ExpoSymbol)
  }
  return null
}

export const getExponentiation = (
  side: SideLabel,
  basis: unknown,
): ReturnType<typeof solveForLeft> | null =>
  side === SideLabel.left
    ? solveForLeft(basis) //
    : solveForRight(basis)
