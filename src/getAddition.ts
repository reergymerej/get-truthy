export const getAddition = (basis: any): any => {
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
