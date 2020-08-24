import { SideLabel, TruthyError, StringType } from "./types"
import { error } from "./visualize"
import { getStringType } from "./util"

const modError = (side: SideLabel) => (basis: any, truthyError: TruthyError) =>
  new Error(error(side, "%", basis, truthyError))
const leftError = modError(SideLabel.left)
const rightError = modError(SideLabel.right)

const getLeftNumber = (basis: any) => {
  if (basis === 0) {
    throw leftError(basis, TruthyError.ModuloNumberZero)
  }
  return basis * 0.5
}

const getRightNumber = (basis: any) => {
  if (basis === 0) {
    throw rightError(basis, TruthyError.ModuloNumberZero)
  }
  return basis * 2
}

const getLeftString = (basis: any) => {
  switch (getStringType(basis)) {
    case StringType.Empty:
      throw rightError(basis, TruthyError.ModuloLeftStringEmpty)
    case StringType.Normal:
      throw rightError(basis, TruthyError.ModuloLeftStringWord)
    case StringType.Numeric:
      return getModulo(SideLabel.left, Number(basis))
    default:
      throw new Error(`unhandled case "${getStringType(basis)}"`)
  }
}

const getRightString = (basis: any) => {
  switch (getStringType(basis)) {
    case StringType.Empty:
      throw rightError(basis, TruthyError.ModuloRightStringEmpty)
    case StringType.Normal:
      throw rightError(basis, TruthyError.ModuloRightStringWord)
    case StringType.Numeric:
      return getModulo(SideLabel.right, Number(basis))
    default:
      throw new Error(`unhandled case "${getStringType(basis)}"`)
  }
}

const getLeft = (basis: any) => {
  const type = typeof basis
  switch (type) {
    case "number":
      return getLeftNumber(basis)
    case "string":
      return getLeftString(basis)
    default:
      throw new Error(`unhandled case "${type}"`)
  }
}
const getRight = (basis: any) => {
  const type = typeof basis
  switch (type) {
    case "number":
      return getRightNumber(basis)
    case "string":
      return getRightString(basis)
    default:
      throw new Error(`unhandled case "${type}"`)
  }
}

export const getModulo = (side: SideLabel, basis: any): any =>
  side === SideLabel.left
    ? getLeft(basis) //
    : getRight(basis)
