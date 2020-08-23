import { SideLabel, Operator, TruthyError } from "./types"

const printBasis = (basis: any) => {
  const type = typeof basis
  switch (type) {
    case "string":
      return `'${basis}'`
    default:
      return basis
  }
}

export const getProblem = (
  side: SideLabel,
  operator: Operator,
  basis: any,
): string =>
  side === SideLabel.left
    ? `[?] ${operator} ${printBasis(basis)}`
    : `${printBasis(basis)} ${operator} [?]`

export const error = (
  side: SideLabel,
  operator: Operator,
  basis: any,
  error: TruthyError,
): string => {
  const problem = getProblem(side, operator, basis)
  const fullMessage = `${problem}\nImpossible: ${error}`
  // console.log(fullMessage)
  return fullMessage
}
