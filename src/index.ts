import { SideLabel, TruthyError, Operator } from "./types"
import { error } from "./visualize"

const getGreaterOrLessThan = (change: number) => (
  operator: Operator,
  side: SideLabel,
  basis: any,
): any => {
  const type = typeof basis
  switch (type) {
    case "number":
      return basis + change
    case "string": {
      if (!basis) {
        if (change < 0) {
          throw new Error(
            error(side, operator, basis, TruthyError.LessThanStringEmpty),
          )
        }
        return "any string"
      }
      const codePoint = basis.codePointAt(0)
      const nextString = String.fromCodePoint(codePoint + change)
      const result = nextString + basis.substring(1)
      return result
    }
    default:
      throw new Error(`unhandled case "${type}"`)
  }
}

const getGreaterThan = getGreaterOrLessThan(1)
const getLessThan = getGreaterOrLessThan(-1)

const getAddition = (basis: any): any => {
  const type = typeof basis
  switch (type) {
    case "number":
      return 1 - basis
    case "string":
      return "any string"
    default:
      throw new Error(`unhandled case "${type}"`)
  }
}

const getSubtraction = (side: SideLabel, basis: any): any => {
  const type = typeof basis
  switch (type) {
    case "number":
      return 1 - basis
    case "string": {
      const parsed = parseFloat(basis)
      if (isNaN(parsed)) {
        throw new Error(error(side, "-", basis, TruthyError.SubractionString))
      }
      return getSubtraction(side, parsed)
    }
    default:
      throw new Error(`unhandled case "${type}"`)
  }
}

const getMultiplication = (side: SideLabel, basis: any): any => {
  const type = typeof basis
  switch (type) {
    case "number":
      if (basis === 0) {
        throw new Error(error(side, "*", basis, TruthyError.MultiplyZero))
      }
      return basis
    case "string": {
      const parsed = parseFloat(basis)
      if (isNaN(parsed)) {
        throw new Error(
          error(
            side,
            "*",
            basis,
            basis
              ? TruthyError.MultiplyStringWord
              : TruthyError.MultiplyEmptyString,
          ),
        )
      }
      return getMultiplication(side, parsed)
    }
    default:
      throw new Error(`unhandled case "${type}"`)
  }
}

const getDivisionLeftStringError = (basis: any): TruthyError =>
  basis ? TruthyError.DivisionString : TruthyError.DivisionLeftEmptyString

const getDivisionRightStringError = (basis: any): TruthyError =>
  basis ? TruthyError.DivisionString : TruthyError.DivisionRightEmptyString

const getDivision = (side: SideLabel, basis: any): any => {
  const type = typeof basis
  // TODO: refactor
  switch (type) {
    case "number":
      if (side === SideLabel.left) {
        if (basis === 0) {
          // anything / 0 == Infinity (truthy)
          return 1
        }
        return basis
      } else {
        if (basis === 0) {
          throw new Error(
            error(side, "/", basis, TruthyError.DivisionNumberZero),
          )
        }
        return basis
      }
    case "string": {
      const parsed = parseFloat(basis)
      if (isNaN(parsed)) {
        throw new Error(
          error(
            side,
            "/",
            basis,
            side === SideLabel.left
              ? getDivisionLeftStringError(basis)
              : getDivisionRightStringError(basis),
          ),
        )
      }
      return getDivision(side, parsed)
    }
    default:
      throw new Error(`unhandled case "${type}"`)
  }
}

const getModulo = (side: SideLabel, basis: any): any => {
  const type = typeof basis
  if (side === SideLabel.left) {
    switch (type) {
      case "number":
        if (basis === 0) {
          throw new Error(error(side, "%", basis, TruthyError.ModuloNumberZero))
        }
        return basis * 0.5
      case "string": {
        const parsed = parseFloat(basis)
        if (isNaN(parsed)) {
          throw new Error(
            error(
              side,
              "%",
              basis,
              basis
                ? TruthyError.ModuloLeftStringWord
                : TruthyError.ModuloLeftStringEmpty,
            ),
          )
        }
        return getModulo(side, parsed)
      }
      default:
        throw new Error(`unhandled case "${type}"`)
    }
  } else {
    switch (type) {
      case "number":
        if (basis === 0) {
          throw new Error(error(side, "%", basis, TruthyError.ModuloNumberZero))
        }
        return basis * 2
      case "string": {
        const parsed = parseFloat(basis)
        if (isNaN(parsed)) {
          throw new Error(
            error(
              side,
              "%",
              basis,
              basis
                ? TruthyError.ModuloRightStringWord
                : TruthyError.ModuloRightStringEmpty,
            ) + "\nhttps://www.destroyallsoftware.com/talks/wat",
          )
        }
        return getModulo(side, parsed)
      }
      default:
        throw new Error(`unhandled case "${type}"`)
    }
  }
}

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
      return !basis
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
    default:
      throw new Error(`unhandled case "${operator}"`)
  }
}

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
    default:
      return left(operator, basis)
  }
}
