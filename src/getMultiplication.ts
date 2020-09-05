import { SideLabel, TruthyError, StringType } from "./types"
import { error } from "./visualize"
import { getStringType, getType } from "./util"

const solveForBigInt = (side: SideLabel, basis: bigint): bigint => {
  if (basis === BigInt(0)) {
    throw new Error(error(side, "*", basis, TruthyError.MultiplyBigZero))
  }
  return basis
}

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

// eslint-disable-next-line complexity
export const getMultiplication = (
  side: SideLabel,
  basis: unknown,
): number | string | bigint => {
  const type = getType(basis)
  switch (type) {
    case "bigint":
      return solveForBigInt(side, basis as bigint)
    case "number":
      return solveForNumber(side, basis as number)
    case "string":
      return solveForString(side, basis as string)
    case "symbol":
      throw error(side, "*", basis, TruthyError.MultiplySymbol)
    case "null":
    case "object":
    case "function":
    case "undefined":
      throw error(side, "*", basis, TruthyError.Multiplication)
    case "boolean": {
      if (basis === true) {
        return 1
      }
      throw error(side, "*", basis, TruthyError.Multiplication)
    }
  }
}
