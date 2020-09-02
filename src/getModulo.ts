import { SideLabel, TruthyError, StringType } from "./types"
import { error } from "./visualize"
import { getStringType, getType } from "./util"

const modError = (side: SideLabel) => (
  basis: unknown,
  truthyError: TruthyError,
) => new Error(error(side, "%", basis, truthyError))
const leftError = modError(SideLabel.left)
const rightError = modError(SideLabel.right)

const getLeftNumber = (basis: number): number => {
  if (basis === 0) {
    throw leftError(basis, TruthyError.ModuloNumberZero)
  }
  return basis * 0.5
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

const getLeft = (basis: unknown) => {
  const type = getType(basis)
  switch (type) {
    case "number":
      return getLeftNumber(basis as number)
    case "string":
      return getLeftString(basis as string)
    case "symbol":
      throw error(SideLabel.left, "%", basis, TruthyError.ModSymbol)
    default:
      throw new Error(`unhandled case "${type}"`)
  }
}
const getRight = (basis: unknown) => {
  const type = getType(basis)
  switch (type) {
    case "number":
      return getRightNumber(basis as number)
    case "string":
      return getRightString(basis as string)
    case "symbol":
      throw error(SideLabel.right, "%", basis, TruthyError.ModSymbol)
    default:
      throw new Error(`unhandled case "${type}"`)
  }
}

export const getModulo = (side: SideLabel, basis: unknown): unknown =>
  side === SideLabel.left
    ? getLeft(basis) //
    : getRight(basis)
