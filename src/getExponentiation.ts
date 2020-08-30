import { SideLabel, TruthyError, StringType } from "./types"
import { error } from "./visualize"
import { getStringType } from "./util"

const modError = (side: SideLabel) => (basis: any, truthyError: TruthyError) =>
  new Error(error(side, "%", basis, truthyError))
const leftError = modError(SideLabel.left)
const rightError = modError(SideLabel.right)

const getLeftNumber = (basis: any) => {
  if (basis === 0) {
    return 1
  }
  throw new Error("not implemented")
}

const getRightNumber = (basis: any) => {
  if (basis === 0) {
    return null
  }
  throw new Error("not implemented")
}

const getLeftString = (basis: any) => {
  switch (getStringType(basis)) {
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
      return getExponentiation(SideLabel.right, Number(basis))
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

export const getExponentiation = (side: SideLabel, basis: any): any =>
  side === SideLabel.left
    ? getLeft(basis) //
    : getRight(basis)
