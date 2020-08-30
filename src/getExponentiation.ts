import { SideLabel, TruthyError, StringType } from "./types"
import { error } from "./visualize"
import { getStringType } from "./util"

const expoError = (side: SideLabel) => (basis: any, truthyError: TruthyError) =>
  new Error(error(side, "**", basis, truthyError))
const leftError = expoError(SideLabel.left)
const rightError = expoError(SideLabel.right)

const getLeftNumber = (basis: any) => {
  return 1
}

const getRightNumber = (basis: any) => {
  return null
}

const getLeftString = (basis: any) => {
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

const getRightString = (basis: any) => {
  switch (getStringType(basis)) {
    case StringType.Empty:
      return null
    case StringType.Normal:
      return null
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
