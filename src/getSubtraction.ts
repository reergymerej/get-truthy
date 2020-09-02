import { SideLabel, TruthyError } from "./types"
import { error } from "./visualize"
import { getType } from "./util"

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

// eslint-disable-next-line complexity
export const getSubtraction = (
  side: SideLabel,
  basis: unknown,
): number | string => {
  const type = getType(basis)
  switch (type) {
    case "number":
      return basis ? 0 : 1
    case "string":
      return solveForString(side, basis as string)
    case "bigint":
      return 1
    case "symbol":
      throw error(side, "-", basis, TruthyError.SubtractionSymbol)
  }
}
