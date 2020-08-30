import { SideLabel, Operator } from "./types"
import { getGreaterThan, getLessThan } from "./greaterOrLessThan"
import { getAddition } from "./getAddition"
import { getSubtraction } from "./getSubtraction"
import { getMultiplication } from "./getMultiplication"
import { getDivision } from "./getDivision"
import { getModulo } from "./getModulo"
import { getNotEqual } from "./getNotEqual"
import { getExponentiation } from "./getExponentiation"

// eslint-disable-next-line complexity
export const left = (operator: Operator, basis: any): any => {
  switch (operator) {
    case ">":
    case ">=":
      return getGreaterThan(operator, SideLabel.left, basis)
    case "<":
    case "<=":
      return getLessThan(operator, SideLabel.left, basis)
    case "==":
    case "===":
      return basis
    case "!=":
    case "!==":
      return getNotEqual(basis)
    case "+":
      return getAddition(basis)
    case "-":
      return getSubtraction(SideLabel.left, basis)
    case "*":
      return getMultiplication(SideLabel.left, basis)
    case "/":
      return getDivision(SideLabel.left, basis)
    case "%":
      return getModulo(SideLabel.left, basis)
    case "**":
      return getExponentiation(SideLabel.left, basis)
    default:
      throw new Error(`unhandled case "${operator}"`)
  }
}

// eslint-disable-next-line complexity
export const right = (operator: Operator, basis: any): any => {
  switch (operator) {
    case ">":
    case ">=":
      return getLessThan("<", SideLabel.right, basis)
    case "<":
    case "<=":
      return getGreaterThan(">", SideLabel.right, basis)
    case "/":
      return getDivision(SideLabel.right, basis)
    case "%":
      return getModulo(SideLabel.right, basis)
    case "**":
      return getExponentiation(SideLabel.right, basis)
    default:
      return left(operator, basis)
  }
}
