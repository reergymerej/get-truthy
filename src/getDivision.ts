import { TruthyError, SideLabel, StringType } from "./types"
import { error } from "./visualize"
import { getStringType, getType } from "./util"

const divisionError = (side: SideLabel) => (
  basis: unknown,
  truthyError: TruthyError,
) => new Error(error(side, "/", basis, truthyError))
const leftError = divisionError(SideLabel.left)
const rightError = divisionError(SideLabel.right)

const solveForBig0 = (side: SideLabel, basis: bigint): bigint => {
  if (side === SideLabel.left) {
    throw error(side, "/", basis, TruthyError.DivisionLeftBigZero)
  } else {
    throw error(side, "/", basis, TruthyError.DivisionRightBigZero)
  }
}

const solveForBigInt = (side: SideLabel, basis: bigint): bigint => {
  if (basis === BigInt(0)) {
    return solveForBig0(side, basis)
  }
  return basis
}

const solveForNumber = (side: SideLabel, basis: number): number => {
  if (side === SideLabel.left) {
    return basis === 0
      ? 1 //
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
  }
}

const solveForString = (side: SideLabel, basis: string): string | number =>
  side === SideLabel.left
    ? //
      solveForLeftString(basis)
    : solveForRightString(basis)

// eslint-disable-next-line complexity
export const getDivision = (
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
      throw error(side, "/", basis, TruthyError.DivisionSymbol)
    case "null":
    case "object":
    case "function":
    case "undefined":
      throw error(side, "/", basis, TruthyError.Division)
    case "boolean": {
      if (basis === true) {
        return 1
      }
      throw error(side, "/", basis, TruthyError.Division)
    }
  }
}
