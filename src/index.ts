// TODO: Update error messages to show the attempt.
// 0 / X = ? 0 divided by anything is NaN.
// 'foo' / X = ? Any string division is NaN.
export enum TruthyError {
  DivisionLeftEmptyString = `Dividing by an empty string is always Infinity.`,
  DivisionRightEmptyString = `'' % is always 0.`,
  DivisionNumberZero = `0 divided by anything is NaN.`,
  DivisionString = `Any string division is NaN.`,
  LessThanStringEmpty = `Nothing can be less than an empty string.`,
  ModuloLeftStringEmpty = `Anything % '' is NaN.`,
  ModuloLeftStringWord = `Anything % this string is NaN.`,
  ModuloNumberZero = `Any number % 0 is NaN.`,
  ModuloRightNumberZero = `0 % anything is falsy.`,
  ModuloRightStringEmpty = `Any empty string % is 0.`,
  ModuloRightStringWord = `This string % anything is falsy.`,
  MultiplyEmptyString = `Multiplying an empty string leads to 0.`,
  MultiplyStringWord = `Multiplying any non-numeric string leads to NaN`,
  MultiplyZero = `Anything multiplied by 0 is falsy.`,
  SubractionString = `Subtracting any string leads to NaN`,
}

// I need a smart way to figure out what we expect to throw for a combination of
  // left/right
  // operator
  // input

const error = (error: TruthyError): string => `Impossible: ${error}`

const getGreaterOrLessThan = (change: number) => (basis: any): any => {
  const type = typeof basis
  switch(type) {
    case 'number':
      return basis + change
    case 'string': {
      if (!basis) {
        if (change < 0) {
          throw new Error(error(TruthyError.LessThanStringEmpty))
        }
        return 'any string'
      }
      const codePoint = (basis || 'A').codePointAt(0)
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
  switch(type) {
    case 'number':
      return 1 - basis
    case 'string':
      return 'any string'
    default:
      throw new Error(`unhandled case "${type}"`)
  }
}

const getSubtraction = (basis: any): any => {
  const type = typeof basis
  switch(type) {
    case 'number':
      return 1 - basis
    case 'string':
      throw new Error(error(TruthyError.SubractionString))
    default:
      throw new Error(`unhandled case "${type}"`)
  }
}

const getMultiplication = (basis: any): any => {
  const type = typeof basis
  switch(type) {
    case 'number':
      if (basis === 0) {
        throw new Error(error(TruthyError.MultiplyZero))
      }
      return basis
    case 'string': {
      throw new Error(error(
        basis
        ? TruthyError.MultiplyStringWord
        : TruthyError.MultiplyEmptyString
      ))
    }
    default:
      throw new Error(`unhandled case "${type}"`)
  }
}

export enum SideLabel {
  left,
  right,
}

const getDivisionLeftStringError = (basis: any): TruthyError => basis
  ? TruthyError.DivisionString
  : TruthyError.DivisionLeftEmptyString

const getDivisionRightStringError = (basis: any): TruthyError => basis
  ? TruthyError.DivisionString
  : TruthyError.DivisionRightEmptyString

const getDivision = (side: SideLabel, basis: any): any => {
  const type = typeof basis
  // TODO: refactor
  switch(type) {
    case 'number':
      if (side === SideLabel.left) {
        if (basis === 0) {
          // anything / 0 == Infinity (truthy)
          return 1
        }
        return basis
      } else {
        if (basis === 0) {
          throw new Error(error(TruthyError.DivisionNumberZero))
        }
        return basis
      }
    case 'string':
      throw new Error(error(
        side === SideLabel.left
        ? getDivisionLeftStringError(basis)
        : getDivisionRightStringError(basis)
      ))
    default:
      throw new Error(`unhandled case "${type}"`)
  }
}

const getModulo = (side: SideLabel, basis: any): any => {
  const type = typeof basis
  if (side === SideLabel.left) {
    switch(type) {
      case 'number':
        if (basis === 0) {
          throw new Error(error(TruthyError.ModuloNumberZero))
        }
        return basis * 0.5
      case 'string':
        throw new Error(error(
          basis
          ? TruthyError.ModuloLeftStringWord
          : TruthyError.ModuloLeftStringEmpty
        ))
      default:
        throw new Error(`unhandled case "${type}"`)
    }
  } else {
    switch(type) {
      case 'number':
        if (basis === 0) {
          throw new Error(error(TruthyError.ModuloNumberZero))
        }
        return basis * 2 || 1
      case 'string':
          throw new Error(error(
            basis
               ? TruthyError.ModuloRightStringWord
               : TruthyError.ModuloRightStringEmpty
            )
            + '\nhttps://www.destroyallsoftware.com/talks/wat'
          )
      default:
        throw new Error(`unhandled case "${type}"`)
    }
  }
}

export type Operator = '>'
  | '<'
  | '>='
  | '<='
  | '=='
  | '==='
  | '!='
  | '!=='
  | '+'
  | '-'
  | '*'
  | '/'
  | '%'
  // | "**" | "&" | "|" | ">>" | ">>>" | "<<" | "^"
  // | "in" | "instanceof"


export const left = (operator: Operator, basis: any): any => {
  switch(operator) {
    case '>':
    case '>=':
      return getGreaterThan(basis)
    case '<':
    case '<=':
      return getLessThan(basis)
    case '==':
    case '===':
      return basis
    case '!=':
    case '!==':
      return !basis
    case '+':
      return getAddition(basis)
    case '-':
      return getSubtraction(basis)
    case '*':
      return getMultiplication(basis)
    case '/':
      return getDivision(SideLabel.left, basis)
    case '%':
      return getModulo(SideLabel.left, basis)
    default:
      throw new Error(`unhandled case "${operator}"`)
  }
}

export const right = (operator: Operator, basis: any): any => {
  switch(operator) {
    case '>':
    case '>=':
      return getLessThan(basis)
    case '<':
    case '<=':
      return getGreaterThan(basis)
    case '/':
      return getDivision(SideLabel.right, basis)
    case '%':
      return getModulo(SideLabel.right, basis)
    default:
      return left(operator, basis)
  }
}
