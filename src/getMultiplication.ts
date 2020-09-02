import { SideLabel, TruthyError, StringType } from "./types"
import { error } from "./visualize"
import { getStringType, getType } from "./util"

const solveForNumber = (side: SideLabel, basis: number): number => {
  if (basis === 0) {
    throw new Error(error(side, "*", basis, TruthyError.MultiplyZero))
  }
  return basis
}

const solveForString = (
  side: SideLabel,
  basis: string,
): ReturnType<typeof getMultiplication> => {
  switch (getStringType(basis)) {
    case StringType.Empty:
      throw new Error(error(side, "*", basis, TruthyError.MultiplyEmptyString))
    case StringType.Normal:
      throw new Error(error(side, "*", basis, TruthyError.MultiplyStringWord))
    case StringType.Numeric:
      return getMultiplication(side, Number(basis))
  }
}

export const getMultiplication = (
  side: SideLabel,
  basis: unknown,
): number | string => {
  const type = getType(basis)
  switch (type) {
    case "number":
      return solveForNumber(side, basis as number)
    case "string":
      return solveForString(side, basis as string)
    case "symbol":
      throw error(side, "*", basis, TruthyError.MultiplySymbol)
  }
}
