import { getLeft, getRight, Operator, SideLabel } from './'


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

const getEvalString = (label: SideLabel, fn: Function, operator: string, basis: any): string => {
  const value = fn(operator, basis)
  const safeValue = safe(value)
  const safeBasis= safe(basis)
  return label === SideLabel.left
    ? `${safeValue} ${operator} ${safeBasis}`
    : `${safeBasis} ${operator} ${safeValue}`
}

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
    '*',
    '/',
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
      [0, ['*'], ['*', '/']],
      [1, [], []],
      ['foo', ['-', '*', '/'], ['-', '*', '/']],
      ['', ['-', '<', '<=', '*', '/'], ['-', '>', '>=', '*', '/']],
    ] as ItOption[])
    ('%s', (basis, impossibleLeft, impossibleRight) => {

      const shouldThrow = (label === SideLabel.left
                           && impossibleLeft.includes(operator))
                           || (label === SideLabel.right
                               && impossibleRight.includes(operator))

      if (shouldThrow) {
        expect(() => {
          fn(operator, basis)
        }).toThrow(/^Impossible/)
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
