export const getNotEqual = (basis: any) => {
  const type = typeof basis
  switch (type) {
    case "string":
      return "!" + basis
    default:
      return !basis
  }
}
