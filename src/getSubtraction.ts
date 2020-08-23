import { SideLabel, TruthyError } from "./types"
import { error } from "./visualize"

const getString = (side: SideLabel, basis: any) => {
  const parsed = parseFloat(basis)
  if (isNaN(parsed)) {
    throw new Error(error(side, "-", basis, TruthyError.SubractionString))
  }
  return getSubtraction(side, parsed)
}

export const getSubtraction = (side: SideLabel, basis: any): any => {
  const type = typeof basis
  switch (type) {
    case "number":
      return 1 - basis
    case "string":
      return getString(side, basis)
    default:
      throw new Error(`unhandled case "${type}"`)
  }
}
