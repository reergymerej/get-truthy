export const getAddition = (basis: any): any => {
  const type = typeof basis
  switch (type) {
    case "number":
      return basis ? 0 : 1
    case "string":
      return "anything"
    default:
      throw new Error(`unhandled case "${type}"`)
  }
}
