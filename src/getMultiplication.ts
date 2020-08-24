import { SideLabel, TruthyError, StringType } from "./types"
import { error } from "./visualize"
import { getStringType } from "./util"

const getNumber = (side: SideLabel, basis: any) => {
  if (basis === 0) {
    throw new Error(error(side, "*", basis, TruthyError.MultiplyZero))
  }
  return basis
}

const getString = (side: SideLabel, basis: any) => {
  switch (getStringType(basis)) {
    case StringType.Empty:
      throw new Error(error(side, "*", basis, TruthyError.MultiplyEmptyString))
    case StringType.Normal:
      throw new Error(error(side, "*", basis, TruthyError.MultiplyStringWord))
    case StringType.Numeric:
      return getMultiplication(side, Number(basis))
    default:
      throw new Error(`unhandled case "${getStringType(basis)}"`)
  }
}

export const getMultiplication = (side: SideLabel, basis: any): any => {
  const type = typeof basis
  switch (type) {
    case "number":
      return getNumber(side, basis)
    case "string":
      return getString(side, basis)
    default:
      throw new Error(`unhandled case "${type}"`)
  }
}
