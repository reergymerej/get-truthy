const error = (message: string): string => `Impossible: ${message}`

const getGreaterOrLessThan = (change: number) => (basis: any): any => {
  const type = typeof basis
  switch(type) {
    case 'number':
      return basis + change
    case 'string': {
      if (!basis) {
        if (change < 0) {
          throw new Error(error(`Nothing can be less than an empty string.`))
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
      throw new Error(error(`Subtracting any string leads to NaN`))
    default:
      throw new Error(`unhandled case "${type}"`)
  }
}

const getMultiplication = (basis: any): any => {
  const type = typeof basis
  switch(type) {
    case 'number':
      if (basis === 0) {
        throw new Error(error('Anything multiplied by 0 is falsy.'))
      }
      return basis
    case 'string': {
      throw new Error(error(`Multiplying any string leads to NaN`))
    }
    default:
      throw new Error(`unhandled case "${type}"`)
  }
}

export enum SideLabel {
  left,
  right,
}

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
          throw new Error(error('0 divided by anything is NaN.'))
        }
        return basis
      }
    case 'string':
      throw new Error(error(`Any string division is NaN.`))
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
          throw new Error(error('Any number % 0 is NaN.'))
        }
        return basis * 0.5
      case 'string':
        throw new Error(error('Anything % this string is NaN.'))
      default:
        throw new Error(`unhandled case "${type}"`)
    }
  } else {
    switch(type) {
      case 'number':
        if (basis === 0) {
          throw new Error(error('0 % any number is 0.'))
        }
        return basis * 2 || 1
      case 'string':
          throw new Error(error(
            (basis
              ? 'Any non-empty string % is NaN.'
              : 'Any empty string % is 0.'
            ) + '\nhttps://www.destroyallsoftware.com/talks/wat'
          ))
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
