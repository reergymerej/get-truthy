// Return value safe for eval.
const safe = (value: any) => {
  const type = typeof value
  switch(type) {
    case 'number':
      return value
    case 'string':
      return `"${value}"`
    case 'boolean':
      return value
    default:
      throw new Error(`unhandled case "${type}"`)
  }
}

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

const getLeft = (operator: string, basis: any): any => {
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

const getRight = (operator: string, basis: any): any => {
  switch(operator) {
    case '>':
    case '>=':
      return getLessThan(basis)
    case '<':
    case '<=':
      return getGreaterThan(basis)
    case '==':
    case '===':
    case '!=':
    case '!==':
    case '+':
    case '-':
      return getLeft(operator, basis)
    //   return !basis
    //   return getAddition(basis)
    //   return getSubtraction(basis)
    default:
      throw new Error(`unhandled case "${operator}"`)
  }
}

enum SideLabel {
  left,
  right,
}

const getEvalString = (label: SideLabel, fn: Function, operator: string, basis: any): string => {
  const value = fn(operator, basis)
  const safeValue = safe(value)
  const safeBasis= safe(basis)
  return label === SideLabel.left
    ? `${safeValue} ${operator} ${safeBasis}`
    : `${safeBasis} ${operator} ${safeValue}`
}

type Operator = '>'
  | '<'
  | '>='
  | '<='
  | '=='
  | '==='
  | '!='
  | '!=='
  | '+'
  | '-'
  // "/" | "%" | "*" | "**" | "&" | "|" | ">>" | ">>>" | "<<" | "^"
  // | "in" | "instanceof"

describe.each([
  ['get left', SideLabel.left, getLeft],
  ['get right', SideLabel.right, getRight],
])('%s', (_labelName, label, fn) => {
  describe.each([
    '!=',
    '!==',
    '+',
    '-',
    '<',
    '<=',
    '==',
    '===',
    '>',
    '>=',
  ] as Operator[])
  ('%s', (operator: Operator) => {

    type ItOption = [
      any, // basis
      Operator[], // throws when finding left
      Operator[], // throws when finding right
    ]

    it.each([
      [-100, [], []],
      [100, [], []],
      [-1, [], []],
      [0, [], []],
      [1, [], []],
      ['foo', ['-'], ['-']],
      ['', ['-', '<', '<='], ['-', '>', '>=']],
    ] as ItOption[])
    ('%s', (basis, impossibleLeft, impossibleRight) => {

      const shouldThrow = (label === SideLabel.left
                           && impossibleLeft.includes(operator))
                           || (label === SideLabel.right
                               && impossibleRight.includes(operator))

      if (shouldThrow) {
        expect(() => {
          fn(operator, basis)
        }).toThrow()
      } else {
        const evalString = getEvalString(label, fn, operator, basis)
        // console.log(evalString)
        expect(eval(
          evalString
        )).toBeTruthy()
      }
    })
  })
})
