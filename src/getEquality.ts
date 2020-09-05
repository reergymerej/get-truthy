import { SideLabel, TruthyError } from "./types"

import { getType } from "./util"
import { error } from "./visualize"

export const getEquality = (side: SideLabel, basis: unknown): unknown => {
  const type = getType(basis)
  switch (type) {
    case "object":
      return "[object Object]"
    case "function":
      throw error(side, "==", basis, TruthyError.EqualityFunction)
    default:
      return basis
  }
}
