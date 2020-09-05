/* eslint-disable complexity */
import { SideLabel, Operator, TruthyError } from "./types"
import { getAddition } from "./getAddition"
import { getDivision } from "./getDivision"
import { getExponentiation } from "./getExponentiation"
import { getGreaterThan, getLessThan } from "./greaterOrLessThan"
import { getLogicalAnd } from "./getLogicalAnd"
import { getModulo } from "./getModulo"
import { getMultiplication } from "./getMultiplication"
import { getNotEqual } from "./getNotEqual"
import { getSubtraction } from "./getSubtraction"
import { getType } from "./util"
import { error } from "./visualize"
import { getEquality } from "./getEquality"
import { getIdentity } from "./getIdentity"

type ResultLeft =
  | ReturnType<typeof getAddition>
  | ReturnType<typeof getDivision>
  | ReturnType<typeof getExponentiation>
  | ReturnType<typeof getGreaterThan>
  | ReturnType<typeof getLessThan>
  | ReturnType<typeof getLogicalAnd>
  | ReturnType<typeof getModulo>
  | ReturnType<typeof getMultiplication>
  | ReturnType<typeof getNotEqual>
  | ReturnType<typeof getSubtraction>
  | unknown

// eslint-disable-next-line max-statements
export const left = (operator: Operator, basis: unknown): ResultLeft => {
  switch (operator) {
    case "+":
      return getAddition(SideLabel.left, basis)
    case "/":
      return getDivision(SideLabel.left, basis)
    case "**":
      return getExponentiation(SideLabel.left, basis)
    case ">":
    case ">=":
      return getGreaterThan(operator, SideLabel.left, basis)
    case "<":
    case "<=":
      return getLessThan(operator, SideLabel.left, basis)
    case "&&":
      return getLogicalAnd(SideLabel.left, basis)
    case "||":
      return 1
    case "%":
      return getModulo(SideLabel.left, basis)
    case "*":
      return getMultiplication(SideLabel.left, basis)
    case "==": {
      return getEquality(SideLabel.left, basis)
    }
    case "===":
      return basis
    case "!=":
    case "!==":
      return getNotEqual(basis)
    case "-":
      return getSubtraction(SideLabel.left, basis)
  }
}

type ResultRight =
  | ReturnType<typeof getDivision>
  | ReturnType<typeof getExponentiation>
  | ReturnType<typeof getGreaterThan>
  | ReturnType<typeof getLessThan>
  | ReturnType<typeof getLogicalAnd>
  | ReturnType<typeof getModulo>
  | ReturnType<typeof left>

// eslint-disable-next-line complexity
export const right = (operator: Operator, basis: unknown): ResultRight => {
  switch (operator) {
    case "/":
      return getDivision(SideLabel.right, basis)
    case "**":
      return getExponentiation(SideLabel.right, basis)
    case "<":
    case "<=":
      return getGreaterThan(">", SideLabel.right, basis)
    case ">":
    case ">=":
      return getLessThan("<", SideLabel.right, basis)
    case "&&":
      return getLogicalAnd(SideLabel.right, basis)
    case "%":
      return getModulo(SideLabel.right, basis)
    case "===":
      return basis
    default:
      return left(operator, basis)
  }
}
