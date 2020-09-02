import { getType } from "./util"
import { error } from "./visualize"
import { SideLabel, TruthyError } from "./types"

// eslint-disable-next-line complexity
export const getAddition = (
  side: SideLabel,
  basis: unknown,
): number | string => {
  const type = getType(basis)
  switch (type) {
    case "bigint":
      return 9
    case "boolean":
      return 1
    case "function":
      return 1
    case "null":
      return 1
    case "number":
      return basis ? 0 : 1
    case "object":
      return 1
    case "string":
      return "anything"
    case "symbol":
      throw error(side, "+", basis, TruthyError.AdditionSymbol)
    case "undefined":
      return ""
  }
}
