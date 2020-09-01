import { SideLabel, TruthyError } from "./types"
import { error } from "./visualize"

const solveForString = (
  side: SideLabel,
  basis: string,
): ReturnType<typeof getSubtraction> => {
  const parsed = parseFloat(basis)
  if (isNaN(parsed)) {
    throw new Error(error(side, "-", basis, TruthyError.SubractionString))
  }
  return getSubtraction(side, parsed)
}

export const getSubtraction = (
  side: SideLabel,
  basis: unknown,
): number | string => {
  const type = typeof basis
  switch (type) {
    case "number":
      return basis ? 0 : 1
    case "string":
      return solveForString(side, basis as string)
    default:
      throw new Error(`unhandled case "${type}"`)
  }
}
