const getGreaterOrLessThan = (change: number) => (basis: any): any => {
  const type = typeof basis
  switch(type) {
    case 'number':
      return basis + change
    case 'string': {
      if (!basis) {
        if (change < 0) {
          throw new Error(`Nothing can be less than an empty string.`)
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
    case 'string': {
      throw new Error(`Subtracting any string leads to NaN`)
    }
    default:
      throw new Error(`unhandled case "${type}"`)
  }
}

export const getLeft = (operator: string, basis: any): any => {
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
    default:
      throw new Error(`unhandled case "${operator}"`)
  }
}

export const getRight = (operator: string, basis: any): any => {
  switch(operator) {
    case '>':
    case '>=':
      return getLessThan(basis)
    case '<':
    case '<=':
      return getGreaterThan(basis)
    default:
      return getLeft(operator, basis)
  }
}
