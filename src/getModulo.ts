import { SideLabel, TruthyError, StringType } from "./types"
import { error } from "./visualize"
import { getStringType, getType } from "./util"

const modError = (side: SideLabel) => (
  basis: unknown,
  truthyError: TruthyError,
) => new Error(error(side, "%", basis, truthyError))
const leftError = modError(SideLabel.left)
const rightError = modError(SideLabel.right)

const getLeftBigInt = (basis: bigint): bigint => {
  if (basis === BigInt(0)) {
    throw error(SideLabel.left, "%", basis, TruthyError.ModLeftBigZero)
  }
  // Will fail if basis < 2n
  return basis / BigInt(2)
}

const getLeftNumber = (basis: number): number => {
  if (basis === 0) {
    throw leftError(basis, TruthyError.ModuloNumberZero)
  }
  return basis * 0.5
}

const getRightBigInt = (basis: bigint): bigint => {
  if (basis === BigInt(0)) {
    throw error(SideLabel.right, "%", basis, TruthyError.ModRightBigZero)
  }
  return basis * BigInt(2)
}

const getRightNumber = (basis: number): number => {
  if (basis === 0) {
    throw rightError(basis, TruthyError.ModuloNumberZero)
  }
  return basis * 2
}

const getLeftString = (basis: string) => {
  switch (getStringType(basis)) {
    case StringType.Empty:
      throw rightError(basis, TruthyError.ModuloLeftStringEmpty)
    case StringType.Normal:
      throw rightError(basis, TruthyError.ModuloLeftStringWord)
    case StringType.Numeric:
      return getModulo(SideLabel.left, Number(basis))
  }
}

const getRightString = (basis: string) => {
  switch (getStringType(basis)) {
    case StringType.Empty:
      throw rightError(basis, TruthyError.ModuloRightStringEmpty)
    case StringType.Normal:
      throw rightError(basis, TruthyError.ModuloRightStringWord)
    case StringType.Numeric:
      return getModulo(SideLabel.right, Number(basis))
  }
}

// eslint-disable-next-line complexity
const getLeft = (basis: unknown) => {
  const type = getType(basis)
  switch (type) {
    case "bigint":
      return getLeftBigInt(basis as bigint)
    case "number":
      return getLeftNumber(basis as number)
    case "string":
      return getLeftString(basis as string)
    case "symbol":
      throw error(SideLabel.left, "%", basis, TruthyError.ModSymbol)
    case "null":
      throw error(SideLabel.left, "%", basis, TruthyError.ModLeftNull)
    default:
      throw new Error(`unhandled case "${type}"`)
  }
}
// eslint-disable-next-line complexity
const getRight = (basis: unknown) => {
  const type = getType(basis)
  switch (type) {
    case "bigint":
      return getRightBigInt(basis as bigint)
    case "number":
      return getRightNumber(basis as number)
    case "string":
      return getRightString(basis as string)
    case "symbol":
      throw error(SideLabel.right, "%", basis, TruthyError.ModSymbol)
    case "null":
      throw error(SideLabel.right, "%", basis, TruthyError.ModRightNull)
    default:
      throw new Error(`unhandled case "${type}"`)
  }
}

export const getModulo = (side: SideLabel, basis: unknown): unknown =>
  side === SideLabel.left
    ? getLeft(basis) //
    : getRight(basis)
